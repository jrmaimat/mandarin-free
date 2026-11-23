"use client";

const KEY_STORAGE = "mandarin-compass:learner-key";

export function getLearnerKey(): string {
  if (typeof window === "undefined") return "server";
  let key = window.localStorage.getItem(KEY_STORAGE);
  if (!key) {
    const random =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `learner-${Math.random().toString(36).slice(2)}-${Date.now()}`;
    key = random;
    window.localStorage.setItem(KEY_STORAGE, key);
  }
  return key;
}

export async function callApi<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
  const body = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) {
    throw new Error(body?.error ?? "Something went wrong. Please try again.");
  }
  return body;
}
