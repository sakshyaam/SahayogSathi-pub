import React from "react";
import { Link } from "react-router-dom";

const stats = [
  { title: "Open requests", value: "48", change: "+12 this week" },
  { title: "Active volunteers", value: "126", change: "+8 today" },
  { title: "Resolved cases", value: "342", change: "+24 this month" },
  { title: "Communities", value: "18", change: "+3 new groups" },
];

const requests = [
  {
    title: "Medicine pickup needed",
    category: "Medical",
    location: "Kathmandu",
    status: "Open",
  },
  {
    title: "Need blood donor coordination",
    category: "Emergency",
    location: "Lalitpur",
    status: "Urgent",
  },
  {
    title: "Temporary food support request",
    category: "Support",
    location: "Bhaktapur",
    status: "In Progress",
  },
  {
    title: "Transport help for hospital visit",
    category: "Transport",
    location: "Kirtipur",
    status: "Open",
  },
];

const activities = [
  "A new support request was posted 10 minutes ago.",
  "Two volunteers joined the Kathmandu community group.",
  "One emergency request was marked resolved.",
  "A coordinator updated the request priority status.",
];

const statusStyles = {
  Open: "bg-zinc-100 text-zinc-700",
  Urgent: "bg-red-100 text-red-700",
  "In Progress": "bg-amber-100 text-amber-700",
};

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-stone-50 text-zinc-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-zinc-200 bg-white lg:flex lg:flex-col">
          <div className="border-b border-zinc-200 px-6 py-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-zinc-200 bg-stone-50">
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
                <p className="text-xs text-zinc-500">Dashboard</p>
              </div>
            </Link>
          </div>

          <nav className="flex-1 px-4 py-6">
            <p className="px-3 text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">
              Navigation
            </p>

            <div className="mt-4 space-y-2">
              <button className="flex w-full items-center rounded-2xl bg-black px-4 py-3 text-left text-sm font-medium text-white">
                Overview
              </button>
              <button className="flex w-full items-center rounded-2xl px-4 py-3 text-left text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-black">
                Requests
              </button>
              <button className="flex w-full items-center rounded-2xl px-4 py-3 text-left text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-black">
                Volunteers
              </button>
              <button className="flex w-full items-center rounded-2xl px-4 py-3 text-left text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-black">
                Communities
              </button>
              <button className="flex w-full items-center rounded-2xl px-4 py-3 text-left text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-black">
                Reports
              </button>
              <button className="flex w-full items-center rounded-2xl px-4 py-3 text-left text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-black">
                Settings
              </button>
            </div>
          </nav>

          <div className="border-t border-zinc-200 p-4">
            <div className="rounded-2xl bg-stone-50 p-4">
              <p className="text-sm font-medium text-zinc-900">Coordinator</p>
              <p className="mt-1 text-xs text-zinc-500">Manage support clearly and calmly.</p>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <header className="border-b border-zinc-200 bg-stone-50/90 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
                  Overview
                </p>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-black sm:text-3xl">
                  Community dashboard
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <button className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-400 hover:text-black">
                  Export
                </button>
                <button className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800">
                  New request
                </button>
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[1.75rem] border border-zinc-200 bg-white p-6"
                >
                  <p className="text-sm text-zinc-500">{item.title}</p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-black">
                    {item.value}
                  </p>
                  <p className="mt-2 text-sm text-teal-700">{item.change}</p>
                </div>
              ))}
            </section>

            <section className="mt-8 grid gap-8 xl:grid-cols-[1.4fr_0.8fr]">
              <div className="rounded-[2rem] border border-zinc-200 bg-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-zinc-900">Recent requests</p>
                    <p className="mt-1 text-sm text-zinc-500">
                      Track support needs across communities
                    </p>
                  </div>
                  <button className="text-sm font-medium text-zinc-600 transition hover:text-black">
                    View all
                  </button>
                </div>

                <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-200">
                  <div className="grid grid-cols-4 border-b border-zinc-200 bg-zinc-50 px-5 py-3 text-xs font-medium uppercase tracking-[0.16em] text-zinc-500">
                    <p>Request</p>
                    <p>Category</p>
                    <p>Location</p>
                    <p>Status</p>
                  </div>

                  <div className="divide-y divide-zinc-200">
                    {requests.map((request) => (
                      <div
                        key={request.title}
                        className="grid grid-cols-4 items-center px-5 py-4 text-sm"
                      >
                        <p className="font-medium text-zinc-900">{request.title}</p>
                        <p className="text-zinc-600">{request.category}</p>
                        <p className="text-zinc-600">{request.location}</p>
                        <div>
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                              statusStyles[request.status]
                            }`}
                          >
                            {request.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="rounded-[2rem] border border-zinc-200 bg-white p-6">
                  <p className="text-sm font-medium text-zinc-900">Quick actions</p>
                  <div className="mt-5 space-y-3">
                    <button className="w-full rounded-2xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800">
                      Create support request
                    </button>
                    <button className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm font-medium text-zinc-700 transition hover:border-zinc-400 hover:text-black">
                      Add volunteer
                    </button>
                    <button className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm font-medium text-zinc-700 transition hover:border-zinc-400 hover:text-black">
                      Create community group
                    </button>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-zinc-200 bg-white p-6">
                  <p className="text-sm font-medium text-zinc-900">Recent activity</p>
                  <div className="mt-5 space-y-4">
                    {activities.map((item, index) => (
                      <div key={index} className="flex gap-3">
                        <span className="mt-2 h-2.5 w-2.5 rounded-full bg-teal-600" />
                        <p className="text-sm leading-6 text-zinc-600">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[2rem] bg-teal-700 p-6 text-white">
                  <p className="text-sm font-medium">Support overview</p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                    Keep help organized.
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-white/80">
                    Review open cases, track responses, and help your community
                    move faster with a calmer workflow.
                  </p>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;