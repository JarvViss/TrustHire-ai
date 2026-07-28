"use client";

export default function Thinking() {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-blue-50 p-5 dark:bg-blue-900/20">

      <div className="flex gap-1">

        <span className="h-2 w-2 animate-bounce rounded-full bg-blue-600 dark:bg-blue-400" />

        <span
          className="h-2 w-2 animate-bounce rounded-full bg-blue-600 dark:bg-blue-400"
          style={{
            animationDelay: "0.15s",
          }}
        />

        <span
          className="h-2 w-2 animate-bounce rounded-full bg-blue-600 dark:bg-blue-400"
          style={{
            animationDelay: "0.3s",
          }}
        />

      </div>

      <p className="font-medium text-blue-700 dark:text-blue-400">
        AI is evaluating your answer...
      </p>

    </div>
  );
}