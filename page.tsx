import { auth } from "@clerk/nextjs/server";
import { getUserSubscription } from "@/lib/supabase";
import { GraderClient } from "@/components/GraderClient";

export default async function Home() {
  const { userId } = await auth();
  let isPro = false;

  if (userId) {
    const sub = await getUserSubscription(userId);
    isPro = !!sub;
  }

  return (
    <main className="min-h-screen bg-[var(--bg)]">
      {/* Nav */}
      <nav className="border-b border-[var(--border)] px-4 py-3 flex items-center justify-between max-w-3xl mx-auto">
        <span className="font-semibold text-sm tracking-tight">
          Cold Email Grader
        </span>
        <div className="flex items-center gap-3 text-sm">
          {isPro && (
            <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2 py-0.5 rounded-full">
              Pro
            </span>
          )}
          {userId ? (
            <a href="/sign-out" className="text-[var(--muted)] hover:text-[var(--fg)] transition-colors">
              Sign out
            </a>
          ) : (
            <a href="/sign-in" className="text-[var(--muted)] hover:text-[var(--fg)] transition-colors">
              Sign in
            </a>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-2xl mx-auto px-4 pt-12 pb-8 text-center">
        <h1 className="text-3xl font-semibold tracking-tight mb-3">
          Paste your cold email.
          <br />
          <span className="text-[var(--muted)]">Get an AI score in seconds.</span>
        </h1>
        <p className="text-[var(--muted)] text-base">
          Free forever · No signup required · 3 grades/day
        </p>
      </section>

      {/* Grader (client component for interactivity) */}
      <GraderClient isPro={isPro} userId={userId ?? null} />

      {/* Social proof */}
      <section className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-sm text-[var(--muted)]">
          Used by sales teams, founders, and SDRs worldwide
        </p>
      </section>
    </main>
  );
}
