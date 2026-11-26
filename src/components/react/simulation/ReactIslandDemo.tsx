import { useState } from "react";

export default function ReactIslandDemo() {
  const [interactionCount, setInteractionCount] = useState(0);

  return (
    <section className="react-island" aria-labelledby="react-island-title">
      <div>
        <p className="react-island__eyebrow">UJI INTEGRASI</p>
        <h2 id="react-island-title">Komponen interaktif siap diuji</h2>
        <p className="react-island__description">
          Bagian ini dirender oleh Astro dan dihidupkan oleh React di browser.
        </p>
      </div>

      <div className="react-island__controls">
        <p className="react-island__count" aria-live="polite">
          Interaksi berhasil: <strong>{interactionCount}</strong>
        </p>
        <button
          className="react-island__button"
          type="button"
          onClick={() => setInteractionCount((count) => count + 1)}
        >
          Uji interaksi React
        </button>
      </div>
    </section>
  );
}
