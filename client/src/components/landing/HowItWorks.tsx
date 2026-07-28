import Container from "@/components/layout/Container";
import SectionHeading from "@/components/common/SectionHeading";
import { Upload, Brain, ShieldCheck } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Your Resume",
    description:
      "Drag and drop or paste your resume. Our AI extracts skills, experience, and credentials in seconds.",
  },
  {
    icon: Brain,
    step: "02",
    title: "Get AI-Powered Insights",
    description:
      "Receive an ATS score, missing skills analysis, and personalized suggestions to improve your resume.",
  },
  {
    icon: ShieldCheck,
    step: "03",
    title: "Verify & Get Hired",
    description:
      "Your credentials are verified on the blockchain. Recruiters can trust your profile instantly.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24">
      <Container>
        <SectionHeading
          badge="How It Works"
          title="Three steps to your dream job"
          description="Our streamlined process makes it easy to improve your resume and stand out to recruiters."
        />

        <div className="relative grid gap-12 md:grid-cols-3">
          <div className="absolute left-[16%] right-[16%] top-12 hidden h-px bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 md:block dark:from-blue-800 dark:via-blue-600 dark:to-blue-800" />

          {steps.map((step) => (
            <div
              key={step.step}
              className="relative flex flex-col items-center text-center"
            >
              <div className="relative z-10 mb-6 inline-flex h-24 w-24 items-center justify-center rounded-full border-2 border-blue-200 bg-white shadow-lg dark:border-blue-700 dark:bg-slate-900">
                <step.icon className="h-10 w-10 text-blue-600 dark:text-blue-400" />
              </div>

              <span className="mb-2 text-sm font-bold text-blue-500 dark:text-blue-400">
                STEP {step.step}
              </span>

              <h3 className="mb-3 text-xl font-semibold dark:text-white">
                {step.title}
              </h3>

              <p className="max-w-xs leading-7 text-slate-600 dark:text-slate-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
