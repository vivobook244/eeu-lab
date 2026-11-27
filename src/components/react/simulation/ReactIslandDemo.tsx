import { useState } from "react";

export default function ReactIslandDemo() {
  const [interactionCount, setInteractionCount] = useState(0);

  return (
    <section
      className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/[0.04] sm:p-7"
      aria-labelledby="react-island-title"
    >
      <div>
        <p className="mb-2 text-[0.68rem] font-bold tracking-[0.16em] text-blue-700">
          UJI INTEGRASI
        </p>
        <h2 id="react-island-title" className="text-lg font-bold tracking-tight text-slate-900">
          Komponen interaktif siap diuji
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Bagian ini dirender oleh Astro dan dihidupkan oleh React di browser.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5">
        <p className="text-sm text-slate-600" aria-live="polite">
          Interaksi berhasil:{" "}
          <strong className="text-slate-950 tabular-nums">{interactionCount}</strong>
        </p>
        <button
          className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
          type="button"
          onClick={() => setInteractionCount((count) => count + 1)}
        >
          Uji interaksi React
        </button>
      </div>
    </section>
  );
}
