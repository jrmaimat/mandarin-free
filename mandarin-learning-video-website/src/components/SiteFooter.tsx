import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line bg-paper-deep/60">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="seal grid h-10 w-10 place-items-center rounded-[8px] text-lg">
                汉
              </span>
              <p className="display text-xl font-semibold">Mandarin Compass</p>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-soft">
              A complete, free starting point for Mandarin Chinese — tone foundations,
              everyday China basics, an eighty-four-video library, a patient AI speaking
              partner and spaced recall practice.
            </p>
            <p className="hanzi mt-4 text-xs tracking-widest text-ink-soft/70">
              慢慢来 · 一步一步 · 加油
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-soft/70">
              Study rooms
            </p>
            <ul className="mt-3 space-y-2 text-sm text-ink-soft">
              <li>
                <Link href="/" className="hover:text-vermilion">
                  Lessons
                </Link>
              </li>
              <li>
                <Link href="/basics" className="hover:text-vermilion">
                  China basics
                </Link>
              </li>
              <li>
                <Link href="/videos" className="hover:text-vermilion">
                  Video library
                </Link>
              </li>
              <li>
                <Link href="/tutor" className="hover:text-vermilion">
                  AI speaking partner
                </Link>
              </li>
              <li>
                <Link href="/review" className="hover:text-vermilion">
                  Review studio
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink-soft/70">
              A note on tones
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Say it slowly. Tones first, speed later. Every phrase on this site can be
              read, heard and spoken back to you.
            </p>
            <div className="mt-4 flex gap-2">
              {["mā", "má", "mǎ", "mà"].map((tone) => (
                <span
                  key={tone}
                  className="hanzi rounded-md border border-line bg-card px-2 py-1 text-sm text-vermilion"
                >
                  {tone}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-vermilion/25 bg-card/80 p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-vermilion">
                ©️ Credit & thanks
              </p>
              <p className="display mt-2 text-lg font-semibold text-ink">
                All thanks to Tshedza Malima
              </p>
              <p className="mt-1 text-sm text-ink-soft">
                This Mandarin learning site exists because of Tshedza Malima — the vision,
                the encouragement and the reason it teaches China the friendly way.
              </p>
            </div>
            <p className="hanzi shrink-0 text-2xl text-vermilion/80">谢谢 · Tshedza Malima</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-line pt-6 text-xs text-ink-soft/75 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Mandarin Compass · All thanks to Tshedza Malima.</p>
          <p>Made for curious beginners · 学中文，看中国</p>
        </div>
      </div>
    </footer>
  );
}
