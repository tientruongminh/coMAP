import { ChalkboardTeacher, GraduationCap, Student } from "@phosphor-icons/react/ssr";

/**
 * The map legend as plain markup (spec 6.6), so diagrams speak the map's
 * language: lime squircle = trường đào tạo, indigo circle = cơ sở thực tập,
 * outlined circle = sinh viên. Decorative; the diagram carries the name.
 */
export function SchoolPin({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center border-2 border-white bg-lime-400 text-ink shadow-1 ${className}`}
      style={{ width: size, height: size, borderRadius: Math.round(size * 0.29) }}
    >
      <GraduationCap weight="fill" size={Math.round(size * 0.53)} />
    </span>
  );
}

export function SitePin({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-full border-2 border-white bg-indigo-600 text-white shadow-1 ${className}`}
      style={{ width: size, height: size }}
    >
      <ChalkboardTeacher weight="fill" size={Math.round(size * 0.53)} />
    </span>
  );
}

export function StudentPin({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-full border-2 border-ink bg-surface text-ink shadow-1 ${className}`}
      style={{ width: size, height: size }}
    >
      <Student weight="bold" size={Math.round(size * 0.5)} />
    </span>
  );
}
