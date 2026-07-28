"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Sparkles, Upload } from "lucide-react";
import  {Button}  from "@/components/ui/button";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-grid">
      <div className="hero-glow top-20 right-0" />

      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-6 lg:px-8">

        {/* LEFT */}

        <div className="flex-1">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="dark:text-slate-200">AI + Blockchain Resume Platform</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: .15 }}
            className="mt-8 text-6xl font-black leading-tight dark:text-white"
          >
            Land Your Dream Job
            <br />

            <span className="text-blue-600 dark:text-blue-400">
              with TrustHire AI
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity:0,y:20 }}
            animate={{ opacity:1,y:0 }}
            transition={{ delay:.3 }}
            className="mt-8 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-400"
          >
            Upload your resume, receive an AI-powered ATS score,
            discover missing skills, and verify your credentials using blockchain technology.
          </motion.p>

          <motion.div
            initial={{ opacity:0 }}
            animate={{ opacity:1 }}
            transition={{ delay:.45 }}
            className="mt-10 flex gap-4"
          >
            <Link href="/upload">
              <Button size="lg">
                <Upload className="mr-2 h-5 w-5"/>
                Upload Resume
              </Button>
            </Link>

            <Link href="/login">
              <Button
                variant="outline"
                size="lg"
              >
                Live Demo
              </Button>
            </Link>

          </motion.div>

          <div className="mt-16 flex gap-12">

            <div>
              <h2 className="text-3xl font-bold dark:text-white">
                15K+
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Resumes Analyzed
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold dark:text-white">
                96%
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                ATS Accuracy
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold dark:text-white">
                500+
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Recruiters
              </p>
            </div>

          </div>

        </div>

        {/* RIGHT */}

        <motion.div

          initial={{ opacity:0,x:60 }}
          animate={{ opacity:1,x:0 }}

          transition={{
            delay:.3,
            duration:.7
          }}

          className="hidden flex-1 justify-center lg:flex"
        >

          <div className="w-[430px] rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl dark:border-slate-700 dark:bg-slate-900">

            <div className="mb-8 flex items-center justify-between">

              <h3 className="text-xl font-bold dark:text-white">
                Resume Analysis
              </h3>

              <ShieldCheck className="text-green-500"/>

            </div>

            <div className="space-y-6">

              <div>

                <div className="flex justify-between">

                  <span className="dark:text-slate-200">ATS Score</span>

                  <span className="font-bold text-green-600 dark:text-green-400">
                    94%
                  </span>

                </div>

                <div className="mt-2 h-3 rounded-full bg-slate-200 dark:bg-slate-700">

                  <div className="h-3 w-[94%] rounded-full bg-green-500"/>

                </div>

              </div>

              <div className="rounded-xl bg-slate-100 p-5 dark:bg-slate-800">

                <h4 className="font-semibold dark:text-white">
                  Skills Detected
                </h4>

                <div className="mt-4 flex flex-wrap gap-2">

                  {[
                    "React",
                    "Node.js",
                    "MongoDB",
                    "TypeScript",
                    "AWS"
                  ].map(skill=>(
                    <span
                      key={skill}
                      className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                    >
                      {skill}
                    </span>
                  ))}

                </div>

              </div>

              <div className="rounded-xl bg-green-50 p-5 dark:bg-green-900/20">

                <div className="flex items-center gap-3">

                  <ShieldCheck className="text-green-600 dark:text-green-400"/>

                  <div>

                    <h4 className="font-semibold dark:text-white">
                      Blockchain Verified
                    </h4>

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Recruiters can verify authenticity instantly.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </motion.div>

      </div>

    </section>
  );
}
