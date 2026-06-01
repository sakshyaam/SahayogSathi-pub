import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="min-h-screen bg-white text-black">
      <div className="mx-auto flex min-h-screen max-w-md items-center px-6 py-12 sm:px-8">
        <div className="w-full">
          <div className="mb-10">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
              Welcome back
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl">
              Sign in
            </h1>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              Enter your email and password to continue.
            </p>
          </div>

          <form className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-zinc-800"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-black focus:ring-0"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-zinc-800"
                >
                  Password
                </label>
                <button
                  type="button"
                  className="text-sm text-zinc-500 transition hover:text-black"
                >
                  Forgot?
                </button>
              </div>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-black focus:ring-0"
              />
            </div>

            <label className="flex items-center gap-3 text-sm text-zinc-600">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-zinc-300 text-black focus:ring-0"
              />
              Remember me
            </label>

            <button
              type="submit"
              className="w-full rounded-2xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              Sign in
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-zinc-600">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="font-medium text-black underline underline-offset-4">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;