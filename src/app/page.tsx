"use client"

import { useUserContext } from "@/contexts/UserDataProviderContext"
import Link from "next/link"

export default function Home() {
  const { user } = useUserContext()

  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen select-none">
      {/* Hero Section */}
      <header className="bg-primary-500 text-white py-20 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to{" "}
          <span className=" text-black text-4xl">Your Productivity Hub</span>
        </h1>
        <p className="text-lg mb-6">
          Stay accountable, achieve your goals, and join a motivated community
        </p>
        {user === null ? (
          <Link
            href="/auth/register"
            className="bg-white text-primary-500 px-6 py-3 rounded-lg shadow-lg font-semibold hover:bg-gray-100 transition"
          >
            Get Started
          </Link>
        ) : (
          <Link
            href="/work"
            className="bg-white text-primary-500 px-6 py-3 rounded-lg shadow-lg font-semibold hover:bg-gray-100 transition"
          >
            Visit Workspace
          </Link>
        )}
      </header>
      {/* <pre className="text-[12px]">{JSON.stringify(user, null, 2)}</pre> */}

      <section className="py-16 px-4 md:px-8 lg:px-16">
        <h2 className="text-3xl font-bold text-center mb-10">Why Choose Us?</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-2">Goal Tracking</h3>
            <p>
              Set and manage your daily, weekly, and monthly goals to stay on
              track and achieve more.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-2">Habit Tracker</h3>
            <p>
              Build new habits and break unproductive ones with our easy-to-use
              habit tracking tools.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-2">Community Challenges</h3>
            <p>
              Join challenges, participate in events, and compete with others on
              the leaderboard.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-2">Personal Insights</h3>
            <p>
              Get personalized insights to reflect on your progress and make
              informed adjustments.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-2">
              Accountability Partners
            </h3>
            <p>
              Find an accountability partner to keep you motivated and
              responsible.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-2">
              Goal-Oriented Community
            </h3>
            <p>
              Connect with like-minded individuals working toward their own
              ambitious goals.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-primary-500 text-white py-16 px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Transform Your Productivity?
        </h2>
        <p className="text-lg mb-6">
          Take the first step towards a more organized, goal-driven life.
        </p>
        {user === null ? (
          <Link
            href="/auth/register"
            className="bg-white text-primary-500 px-6 py-3 rounded-lg shadow-lg font-semibold hover:bg-gray-100 transition"
          >
            Join Now
          </Link>
        ) : (
          <Link
            href="/work"
            className="bg-white text-primary-500 px-6 py-3 rounded-lg shadow-lg font-semibold hover:bg-gray-100 transition"
          >
            Visit Workspace
          </Link>
        )}
      </section>

      <footer className="bg-gray-800 text-white py-8 px-4 text-center mb-0 ">
        <p>
          &copy; {new Date().getFullYear()} Your Productivity Hub. All Rights
          Reserved.
        </p>
      </footer>
    </div>
  )
}
