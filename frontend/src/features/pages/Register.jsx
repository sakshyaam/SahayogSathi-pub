import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Register = () => {

    const navigate = useNavigate();
  return (

    <div className="min-h-screen bg-white text-black">
      <div className="mx-auto flex min-h-screen max-w-md items-center px-6 py-12 sm:px-8">
        <div className="w-full">
          <div className="mb-10">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
              Create account
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl">
              Register
            </h1>
            <p className="mt-3 text-sm leading-6 text-zinc-600">
              Fill in your details to create a new account.
            </p>
          </div>

          <form className="space-y-5">
            <div>
              <label
                htmlFor="fullName"
                className="mb-2 block text-sm font-medium text-zinc-800"
              >
                Full name
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="Your full name"
                className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-black focus:ring-0"
              />
            </div>

            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-medium text-zinc-800"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Choose a username"
                className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-black focus:ring-0"
              />
            </div>

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
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-zinc-800"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Create a password"
                className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-black focus:ring-0"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              Create account
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-zinc-600">
            Already have an account?{" "}
            <Link
              to={'/login'}
              className="font-medium text-black underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;