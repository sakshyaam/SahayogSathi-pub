import React from "react";
import { Link } from "react-router-dom";

interface MyPost {
  id: number;
  title: string;
  category: string;
  location: string;
  status: "Open" | "Closed" | "Draft";
  date: string;
}

const myPosts: MyPost[] = [
  {
    id: 1,
    title: "Need medicine pickup by evening",
    category: "Medical",
    location: "Patan",
    status: "Open",
    date: "Posted 2 days ago",
  },
  {
    id: 2,
    title: "Looking for temporary food support",
    category: "Food",
    location: "Bhaktapur",
    status: "Closed",
    date: "Posted 5 days ago",
  },
  {
    id: 3,
    title: "Transport support for hospital checkup",
    category: "Transport",
    location: "Kirtipur",
    status: "Draft",
    date: "Saved yesterday",
  },
];

const badgeStyles: Record<"Open" | "Closed" | "Draft", string> = {
  Open: "bg-zinc-100 text-zinc-700",
  Closed: "bg-stone-200 text-zinc-700",
  Draft: "bg-amber-100 text-amber-700",
};

const MyPosts = () => {
  return (
    <div className="min-h-screen bg-stone-50 text-zinc-900">
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
              My posts
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-black">
              Manage your posts
            </h1>
          </div>

          <Link
            to="/create-post"
            className="inline-flex rounded-full bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            Create new post
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {["All", "Open", "Closed", "Draft"].map((tab, index) => (
            <button
              key={tab}
              className={`rounded-full px-4 py-2 text-sm font-medium ${
                index === 0
                  ? "bg-black text-white"
                  : "border border-zinc-200 bg-white text-zinc-600 hover:text-black"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <section className="mt-6 space-y-4">
          {myPosts.map((post) => (
            <article
              key={post.id}
              className="rounded-[1.75rem] border border-zinc-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${badgeStyles[post.status]}`}
                    >
                      {post.status}
                    </span>
                    <span className="text-sm text-zinc-500">{post.date}</span>
                  </div>

                  <h2 className="mt-3 text-lg font-semibold text-black">{post.title}</h2>
                  <p className="mt-2 text-sm text-zinc-600">
                    {post.category} • {post.location}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700">
                    View
                  </button>
                  <button className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700">
                    Edit
                  </button>
                  <button className="rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700">
                    Close
                  </button>
                  <button className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white">
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
};

export default MyPosts;
