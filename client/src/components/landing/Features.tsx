import Container from "@/components/layout/Container";
import SectionHeading from "@/components/common/SectionHeading";
import FeatureCard from "./FeatureCard";
import { FEATURES } from "@/constants/landing";

export default function Features() {
  return (
    <section
      id="features"
      className="py-24 bg-slate-50 dark:bg-slate-950"
    >
      <Container>
        <SectionHeading
          badge="Features"
          title="Everything you need for smarter hiring"
          description="AI-powered resume analysis combined with blockchain verification to build trust between candidates and recruiters."
        />

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}