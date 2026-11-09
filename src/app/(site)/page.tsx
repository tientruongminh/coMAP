import { Hero } from "@/components/home/Hero";
import { DataStrip } from "@/components/home/DataStrip";
import { HowItWorks } from "@/components/home/HowItWorks";
import { MatchingSection } from "@/components/home/MatchingSection";
import { ServicesBento } from "@/components/home/ServicesBento";
import { SchoolsGrid } from "@/components/home/SchoolsGrid";
import { LatestNews } from "@/components/home/LatestNews";
import { RoleBand } from "@/components/home/RoleBand";

/** Trang chủ (spec 2.4, 3.1): a guided tour of one map, in 8 sections. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <DataStrip />
      <HowItWorks />
      <MatchingSection />
      <ServicesBento />
      <SchoolsGrid />
      <LatestNews />
      <RoleBand />
    </>
  );
}
