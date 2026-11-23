import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  hanzi,
  title,
  description,
  aside,
}: {
  eyebrow: string;
  hanzi: string;
  title: ReactNode;
  description: string;
  aside?: ReactNode;
}) {
  return (
    <section className="border-b border-line bg-paper-deep/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.6fr_1fr] lg:items-end lg:py-16">
        <div className="rise">
          <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-vermilion">
            <span className="hanzi text-base tracking-normal">{hanzi}</span>
            {eyebrow}
          </p>
          <h1 className="display mt-4 max-w-2xl text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-soft">{description}</p>
        </div>
        {aside ? <div className="rise">{aside}</div> : null}
      </div>
    </section>
  );
}
