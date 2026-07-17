export default function Hero() {
  return (
    <section className="mx-auto flex min-h-[90vh] max-w-7xl flex-col items-center justify-center px-6 text-center">
      <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
        AI + Blockchain Resume Platform
      </span>

      <h1 className="mt-6 text-6xl font-extrabold leading-tight">
        Land Your Dream Job
        <br />
        with
        <span className="text-blue-600"> TrustHire AI</span>
      </h1>

      <p className="mt-6 max-w-2xl text-lg text-gray-600">
        Upload your resume, get an ATS score, AI-powered suggestions,
        and blockchain verification—all in one platform.
      </p>

      <div className="mt-10 flex gap-4">
        <button className="rounded-xl bg-blue-600 px-8 py-3 text-white hover:bg-blue-700">
          Get Started
        </button>

        <button className="rounded-xl border px-8 py-3">
          Learn More
        </button>
      </div>
    </section>
  );
}