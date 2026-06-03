import React from "react";
import { Link } from "react-router-dom";

const stats = [
  { value: "2,000+", label: "Requests supported" },
  { value: "300+", label: "Active helpers" },
  { value: "25+", label: "Community groups" },
];

const features = [
  {
    title: "Request support",
    text: "Let people ask for help in a clear, organized, and respectful way.",
  },
  {
    title: "Coordinate faster",
    text: "Bring volunteers, updates, and responses into one simple place.",
  },
  {
    title: "Build trust",
    text: "Use a calm interface that makes support feel reliable and human.",
  },
];

const steps = [
  {
    number: "01",
    title: "Post a need",
    text: "Someone shares a request for help, support, or information.",
  },
  {
    number: "02",
    title: "Get responses",
    text: "Relevant people or volunteers respond based on availability.",
  },
  {
    number: "03",
    title: "Track progress",
    text: "Everyone stays updated until the request is resolved.",
  },
];

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-stone-50 text-zinc-900">
      <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-stone-50/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-zinc-200 bg-white">
              <svg
                viewBox="0 0 48 48"
                className="h-6 w-6 text-teal-700"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 24C14 18.477 18.477 14 24 14C29.523 14 34 18.477 34 24"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
                <path
                  d="M18 28C18 31.314 20.686 34 24 34C27.314 34 30 31.314 30 28"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
                <circle cx="24" cy="24" r="2.5" fill="currentColor" />
              </svg>
            </div>

            <div>
              <p className="text-sm font-semibold tracking-tight">SathiSahayog</p>
              <p className="text-xs text-zinc-500">Community support platform</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#about" className="text-sm text-zinc-600 transition hover:text-black">
              About
            </a>
            <a href="#features" className="text-sm text-zinc-600 transition hover:text-black">
              Features
            </a>
            <a href="#how" className="text-sm text-zinc-600 transition hover:text-black">
              How it works
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden text-sm font-medium text-zinc-700 transition hover:text-black sm:inline-flex"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl gap-16 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
          <div className="flex flex-col justify-center">
            <p className="mb-5 text-xs font-medium uppercase tracking-[0.24em] text-zinc-500">
              Minimal. Helpful. Community first.
            </p>

            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-black sm:text-5xl lg:text-6xl">
              A better way for people to help each other.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-zinc-600 sm:text-lg">
              SathiSahayog helps communities connect requests with real support.
              Keep help simple, organized, and easy to act on.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
              >
                Start now
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-medium text-zinc-900 transition hover:border-zinc-400 hover:bg-zinc-50"
              >
                See features
              </a>
            </div>

            <div className="mt-12 grid max-w-xl gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-zinc-200 bg-white p-5"
                >
                  <p className="text-2xl font-semibold tracking-tight">{stat.value}</p>
                  <p className="mt-1 text-sm text-zinc-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-4xl border border-zinc-200 bg-white p-4 shadow-[0_18px_60px_rgba(0,0,0,0.05)]">
              <div className="rounded-3xl border border-zinc-200 bg-stone-50 p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-900">Support requests</p>
                    <p className="text-xs text-zinc-500">Live community overview</p>
                  </div>
                  <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
                    Active
                  </span>
                </div>

                <div className="space-y-4">
                  {[
                    "Need emergency medicine pickup",
                    "Looking for blood donor coordination",
                    "Student seeking temporary support",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-zinc-200 bg-white p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-zinc-900">{item}</p>
                          <p className="mt-1 text-xs text-zinc-500">
                            Community verified • Updated recently
                          </p>
                        </div>
                        <span className="mt-1 h-2.5 w-2.5 rounded-full bg-teal-600" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl bg-black p-5 text-white">
                  <p className="text-sm font-medium">Designed for calm action</p>
                  <p className="mt-2 text-sm leading-6 text-white/70">
                    Clear requests, fast responses, and a more focused way to
                    support people who need help.
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -left-6 top-8 hidden h-24 w-24 rounded-full bg-teal-100 blur-2xl lg:block" />
            <div className="absolute -right-6 bottom-8 hidden h-24 w-24 rounded-full bg-zinc-200/70 blur-2xl lg:block" />
          </div>
        </section>

        <section
          id="about"
          className="border-y border-zinc-200 bg-white"
        >
          <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-500">
                  Mission
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-black">
                  Community support should feel easy to access.
                </h2>
              </div>

              <div>
                <p className="text-base leading-7 text-zinc-600">
                  SathiSahayog is built for local communities, volunteers, and
                  organizations that need a simple platform to coordinate help.
                  The goal is to reduce confusion and make support more direct.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-500">
              Features
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-black sm:text-4xl">
              Built to keep support clear.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-[1.75rem] border border-zinc-200 bg-white p-7"
              >
                <div className="mb-5 h-10 w-10 rounded-full bg-zinc-100" />
                <h3 className="text-lg font-semibold tracking-tight text-black">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  {feature.text}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section id="how" className="bg-black text-white">
          <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-400">
                How it works
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                A simple flow from need to support.
              </h2>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="rounded-[1.75rem] border border-white/10 bg-white/5 p-7"
                >
                  <p className="text-sm text-teal-300">{step.number}</p>
                  <h3 className="mt-4 text-xl font-semibold">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/70">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[2rem] border border-zinc-200 bg-white p-8">
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-zinc-500">
                Why it matters
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-black">
                Less friction, more support.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-zinc-600">
                When people are asking for help, interfaces should not create
                extra stress. A minimal design helps users focus on what matters
                most: responding, coordinating, and solving the request.
              </p>
            </div>

            <div className="space-y-6">
              <div className="rounded-[1.75rem] border border-zinc-200 bg-stone-100 p-7">
                <p className="text-base leading-7 text-zinc-800">
                  “Simple design makes the platform feel trustworthy and easy to use.”
                </p>
                <p className="mt-4 text-sm text-zinc-500">— Community volunteer</p>
              </div>

              <div className="rounded-[1.75rem] border border-zinc-200 bg-white p-7">
                <p className="text-base leading-7 text-zinc-800">
                  “The structure helps teams respond faster without making things feel complicated.”
                </p>
                <p className="mt-4 text-sm text-zinc-500">— Local organizer</p>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 pb-20 lg:px-8">
          <div className="mx-auto max-w-6xl rounded-[2rem] bg-teal-700 px-8 py-12 text-white sm:px-10 lg:px-14 lg:py-16">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-teal-100">
                  Get started
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Start building a more helpful community platform.
                </h2>
                <p className="mt-4 text-base leading-7 text-white/80">
                  Create an account and begin organizing support with clarity.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-medium text-teal-800 transition hover:bg-teal-50"
                >
                  Create account
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;