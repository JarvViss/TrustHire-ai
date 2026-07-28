import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-24">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 px-12 py-20 text-center text-white shadow-2xl">
          <div className="hero-glow -top-20 right-0 opacity-30" />

          <Sparkles className="mx-auto mb-6 h-12 w-12 text-blue-200" />

          <h2 className="mb-6 text-4xl font-black md:text-5xl">
            Ready to stand out?
          </h2>

          <p className="mx-auto mb-10 max-w-xl text-lg text-blue-100">
            Join thousands of candidates who improved
            their resumes and landed interviews with
            TrustHire AI.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-white text-blue-700 hover:bg-blue-50 dark:bg-white dark:text-blue-700 dark:hover:bg-blue-50"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-blue-400 text-white hover:bg-blue-700 dark:border-blue-400 dark:text-white dark:hover:bg-blue-700"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
