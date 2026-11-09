import { createHash, randomBytes } from "node:crypto";
import { appendFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { byId, schools } from "@/lib/locations";
import { isLeadType, validateLead } from "@/lib/lead-schema";
import { packageOptions } from "@/content/forms";

/**
 * POST /api/lead (spec 5.6). Re-validates with the shared schema, then appends
 * one JSON line to data/submissions/leads.jsonl (gitignored personal data).
 * Never logs field values. The client IP is only hashed, kept in memory for the
 * rate limit, and never written anywhere.
 */

const DIR = path.join(process.cwd(), "data", "submissions");
const FILE = path.join(DIR, "leads.jsonl");
const MAX_BYTES = 16_000;
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;

const schoolIds = schools.map((s) => s.id);
const goiValues: readonly string[] = packageOptions.map((o) => o.value);

// ---------- rate limit: in memory, salted hash of the IP, per process ----------
const salt = randomBytes(16).toString("hex");
const hits = new Map<string, number[]>();

function clientKey(req: Request) {
  const fwd = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = fwd || req.headers.get("x-real-ip") || "local";
  return createHash("sha256").update(salt + ip).digest("hex").slice(0, 32);
}

function limited(key: string, now: number) {
  if (hits.size > 5000) {
    for (const [k, list] of hits) if (list.every((t) => now - t > WINDOW_MS)) hits.delete(k);
  }
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > LIMIT;
}

// ---------- code CM-{yyMM}-{nnnn}, writes serialized so codes never collide ----------
function yyMM(d: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Ho_Chi_Minh", year: "2-digit", month: "2-digit" }).formatToParts(d);
  const y = parts.find((p) => p.type === "year")?.value ?? "00";
  const m = parts.find((p) => p.type === "month")?.value ?? "00";
  return `${y}${m}`;
}

async function nextCode(now: Date) {
  const prefix = `CM-${yyMM(now)}-`;
  let n = 0;
  try {
    const text = await readFile(FILE, "utf8");
    for (const line of text.split("\n")) if (line.includes(`"id":"${prefix}`)) n++;
  } catch {
    // no file yet
  }
  return `${prefix}${String(n + 1).padStart(4, "0")}`;
}

let queue: Promise<unknown> = Promise.resolve();
function serialized<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task, task);
  queue = run.catch(() => undefined);
  return run;
}

// ---------- context and source page ----------
function cleanContext(raw: unknown) {
  if (!raw || typeof raw !== "object") return undefined;
  const c = raw as Record<string, unknown>;
  const out: Record<string, string> = {};
  if (typeof c.diem === "string" && byId.has(c.diem)) out.diem = c.diem;
  if (typeof c.goi === "string" && goiValues.includes(c.goi)) out.goi = c.goi;
  if (typeof c.taiLieu === "string" && c.taiLieu.trim()) out.taiLieu = c.taiLieu.trim().slice(0, 200);
  return Object.keys(out).length ? out : undefined;
}

function cleanSourcePage(raw: unknown) {
  if (typeof raw !== "string" || !raw.startsWith("/")) return "/";
  return raw.split(/[?#]/)[0].slice(0, 200);
}

const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  if (limited(clientKey(request), Date.now())) return json({ ok: false }, 429);

  let body: Record<string, unknown>;
  try {
    const text = await request.text();
    if (text.length > MAX_BYTES) return json({ ok: false, errors: {} }, 400);
    const parsed: unknown = JSON.parse(text);
    if (!parsed || typeof parsed !== "object") throw new Error("not an object");
    body = parsed as Record<string, unknown>;
  } catch {
    return json({ ok: false, errors: {} }, 400);
  }

  const { type, fields, context, sourcePage, website } = body;

  // Honeypot: bots fill the hidden `website` field. Answer like a success, store nothing.
  if (typeof website === "string" && website.trim()) {
    const fake = `CM-${yyMM(new Date())}-${String(1000 + Math.floor(Math.random() * 9000))}`;
    return json({ ok: true, code: fake });
  }

  if (!isLeadType(type)) return json({ ok: false, errors: {} }, 400);

  const result = validateLead(type, fields, { schoolIds });
  if (!result.ok) return json({ ok: false, errors: result.errors }, 400);

  try {
    const code = await serialized(async () => {
      const now = new Date();
      const id = await nextCode(now);
      const ctx = cleanContext(context);
      const record = {
        id,
        type,
        fields: result.fields,
        context: ctx ?? {},
        sourcePage: cleanSourcePage(sourcePage),
        createdAt: now.toISOString(),
      };
      await mkdir(DIR, { recursive: true });
      await appendFile(FILE, `${JSON.stringify(record)}\n`, "utf8");
      return id;
    });
    return json({ ok: true, code });
  } catch (e) {
    // only the error code, never the payload
    console.error("lead: could not store submission", (e as NodeJS.ErrnoException)?.code ?? "unknown");
    return json({ ok: false }, 500);
  }
}
