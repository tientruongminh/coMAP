import { Footer } from "@/components/layout/Footer";

/** Every page except /ban-do gets the footer (spec 2.3). */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main id="noi-dung" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
