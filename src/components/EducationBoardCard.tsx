import type { EducationBoard } from "@/lib/education-data";
import TrackedLink from "@/components/TrackedLink";

export default function EducationBoardCard({ board }: { board: EducationBoard }) {
  return (
    <article
      id={board.id}
      className="rounded-xl border border-[#304055] bg-[#101A28] text-[#F7FAFF] p-6 md:p-8 scroll-mt-20"
    >
      <p className="text-red font-bold uppercase tracking-wide text-xs mb-1">{board.eyebrow}</p>
      <h3 className="font-display text-2xl md:text-3xl mb-4">{board.title}</h3>

      {board.paragraphs?.map((p, i) => (
        <p key={i} className="mb-3">
          {p}
        </p>
      ))}

      {board.diagram && (
        <div className="my-5 rounded-lg bg-white/5 p-4">
          <ol className="flex flex-wrap items-center gap-2 text-sm font-semibold">
            {board.diagram.mainSteps.map((step, i) => (
              <li key={i} className="flex items-center gap-2">
                {i > 0 && <span className="text-muted">→</span>}
                <span>{step}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-xs font-bold uppercase tracking-wide text-gold-soft">
            {board.diagram.branchLabel}
          </p>
          <ol className="flex flex-wrap items-center gap-2 text-sm font-semibold mt-2">
            {board.diagram.branchSteps.map((step, i) => (
              <li key={i} className="flex items-center gap-2">
                {i > 0 && <span className="text-muted">→</span>}
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {board.columns && (
        <div className="grid md:grid-cols-2 gap-5 my-5">
          <div className="rounded-lg border border-red/30 p-4">
            <p className="font-semibold text-sm mb-2">{board.columns.can.heading}</p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              {board.columns.can.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {board.columns.can.note && (
              <p className="text-xs text-muted mt-2">{board.columns.can.note}</p>
            )}
          </div>
          <div className="rounded-lg border border-gold/40 p-4">
            <p className="font-semibold text-sm mb-2">{board.columns.cannot.heading}</p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              {board.columns.cannot.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {board.framing && <p className="mb-4 text-sm text-muted">{board.framing}</p>}

      {board.timeline && (
        <ol className="border-l-2 border-gold pl-5 space-y-4 my-5">
          {board.timeline.map((t) => (
            <li key={t.year}>
              <span className="font-display text-lg text-red block">{t.year}</span>
              <span className="text-sm">{t.text}</span>
            </li>
          ))}
        </ol>
      )}

      {board.wordBreakdown && (
        <div className="grid sm:grid-cols-3 gap-3 my-5">
          {board.wordBreakdown.map((w) => (
            <div key={w.part} className="rounded-lg bg-white/5 p-4 text-center">
              <p className="font-display text-xl">{w.part}</p>
              <p className="text-xs text-muted mt-1">{w.meaning}</p>
            </div>
          ))}
        </div>
      )}

      {board.diagramSteps && (
        <ol className="space-y-2 my-5">
          {board.diagramSteps.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="font-display text-gold">{i + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      )}

      {board.disclaimer && (
        <p className="text-xs text-muted italic mb-2">{board.disclaimer}</p>
      )}
      {board.note && <p className="text-xs text-muted mb-2">{board.note}</p>}

      {board.comparison && (
        <div className="grid sm:grid-cols-3 gap-4 my-5">
          {board.comparison.map((c) => (
            <div
              key={c.name}
              className={`rounded-lg border p-4 ${
                c.urgent ? "border-red bg-red/5" : "border-[#304055]"
              }`}
            >
              <p className="font-display text-xl mb-2">{c.name}</p>
              <ul className="text-sm space-y-1">
                {c.points.map((pt) => (
                  <li key={pt}>{pt}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      {board.urgentLinkLabel && board.urgentLinkHref && (
        <a
          href={board.urgentLinkHref}
          className="inline-block bg-red text-paper text-xs font-bold uppercase tracking-wide rounded-md px-4 py-2 my-2"
        >
          {board.urgentLinkLabel}
        </a>
      )}

      {board.flowSteps && (
        <ol className="flex flex-wrap items-center gap-2 text-sm font-semibold my-5">
          {board.flowSteps.map((step, i) => (
            <li key={i} className="flex items-center gap-2">
              {i > 0 && <span className="text-muted">→</span>}
              <span>{step}</span>
            </li>
          ))}
        </ol>
      )}

      {board.branches && (
        <div className="grid sm:grid-cols-2 gap-4 my-5">
          {board.branches.map((b) => (
            <div key={b.label} className="rounded-lg bg-white/5 p-4">
              <p className="font-semibold text-sm mb-1">{b.label}</p>
              <p className="text-sm text-muted">{b.text}</p>
            </div>
          ))}
        </div>
      )}

      {board.facts && (
        <ul className="list-disc pl-5 text-sm space-y-1 my-4">
          {board.facts.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      )}

      {board.takeaway && (
        <p className="font-display text-lg text-gold-soft mt-4">{board.takeaway}</p>
      )}

      <div className="mt-5 pt-4 border-t border-[#304055] flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
        {board.sources.map((s) => (
          <TrackedLink
            key={s.url}
            href={s.url}
            eventType="education_source_clicked"
            providerId={board.id}
            className="hover:text-red underline"
          >
            {s.label} ↗
          </TrackedLink>
        ))}
      </div>
    </article>
  );
}
