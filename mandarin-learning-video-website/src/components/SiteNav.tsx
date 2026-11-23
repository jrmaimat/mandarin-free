"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "Learn", hanzi: "学", note: "12 lessons" },
  { href: "/basics", label: "Basics", hanzi: "基", note: "China survival" },
  { href: "/videos", label: "Videos", hanzi: "看", note: "84 lessons" },
  { href: "/tutor", label: "AI Speaking Partner", hanzi: "说", note: "Talk & listen" },
  { href: "/review", label: "Review", hanzi: "复", note: "Recall studio" },
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        <Link href="/" className="group flex items-center gap-3 self-start">
          <span className="seal grid h-11 w-11 place-items-center rounded-[10px] text-xl leading-none">
            汉
          </span>
          <span className="leading-tight">
            <span className="display block text-lg font-semibold tracking-tight text-ink">
              Mandarin Compass
            </span>
            <span className="block text-[10px] font-medium uppercase tracking-[0.22em] text-ink-soft/70">
              Pinyin · People · Places
            </span>
          </span>
        </Link>

        <nav aria-label="Main sections" className="tab-scroll -mx-1 overflow-x-auto">
          <ul className="flex items-stretch gap-1 px-1">
            {TABS.map((tab) => {
              const active =
                tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
              return (
                <li key={tab.href} className="shrink-0">
                  <Link
                    href={tab.href}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "flex items-center gap-2 rounded-full px-3 py-2 text-[13px] font-medium transition",
                      active
                        ? "bg-ink text-paper shadow-sm"
                        : "text-ink-soft hover:bg-paper-deep/70 hover:text-ink",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "hanzi grid h-6 w-6 place-items-center rounded-full text-[13px]",
                        active ? "bg-vermilion text-paper" : "bg-paper-deep text-ink-soft",
                      ].join(" ")}
                    >
                      {tab.hanzi}
                    </span>
                    <span>{tab.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
