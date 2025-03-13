import AuthButton from "@/features/home/AuthButton"
import FeatureCard from "@/features/home/FeatureCard"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Your Productivity Hub - Stay Accountable & Achieve Goals",
  description:
    "Take control of your life with powerful habit tracking, goal setting, and an inspiring accountability community. Join today and stay on track!",
  keywords: [
    "productivity",
    "habit tracker",
    "goal setting",
    "accountability",
    "self-improvement",
    "success mindset",
    "time management"
  ],
  authors: [{ name: "Your Productivity Hub" }]
}

export default function Home() {
  return (
    <div className=" text-gray-800 min-h-screen select-none">
      {/* 🚀 Hero Section */}
      <header className=" bg-gradient-to-tr from-indigo-500 to-cyan-500 py-32 px-4 text-center text-white">
        <div className="container mx-auto">
        <h1 className="text-5xl font-extrabold mb-4 leading-tight">
          Unlock Your Full Potential with{" "}
          <span className="text-black text-5xl">Your Productivity Hub</span>
        </h1>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          Your journey to a focused, disciplined, and highly productive life
          starts today! Set goals, track habits, and surround yourself with a
          community that keeps you accountable.
        </p>
        <AuthButton />
        </div>
      </header>

      {/* 🎯 Features Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16 dark:text-white">
        <h2 className="text-4xl font-extrabold text-center mb-12">
          Why Choose{" "}
          <span className="text-indigo-500">Your Productivity Hub?</span>
        </h2>
        <p className="text-lg text-center  max-w-2xl mx-auto mb-10">
          Because success is a habit, not a one-time event. Our platform is
          designed to help you build consistent daily routines, crush your
          goals, and stay accountable like never before.
        </p>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map(({ title, description }) => (
            <FeatureCard key={title} title={title} content={description} />
          ))}
        </div>
      </section>

      {/* 🔥 Call to Action Section */}
      <section className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white dark:text-white py-20 px-4 text-center">
        <h2 className="text-4xl font-extrabold mb-4">
          🚀 Ready to Take Control of Your Life?
        </h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          Procrastination kills dreams. Take the first step towards a focused,
          disciplined, and productive future. Start tracking your habits,
          setting powerful goals, and staying accountable.
        </p>
        <AuthButton />
        <p className="mt-6 text-sm text-gray-200">
          No credit card required. Start for free today!
        </p>
      </section>

      {/* 🌍 Community Invitation Section */}
      <section className="py-20 px-4 md:px-8 lg:px-16 text-center dark:text-white">
        <h1 className="text-4xl font-extrabold mb-6">
          Join a Thriving Community of Achievers
        </h1>
        <p className="text-lg  max-w-2xl mx-auto mb-8">
          You're not alone on this journey. Connect with thousands of driven
          individuals who are serious about their success. Participate in
          challenges, share your wins, and grow together.
        </p>
        <AuthButton />
      </section>

      {/* 📌 Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4 text-center">
        <p>
          &copy; {new Date().getFullYear()} Your Productivity Hub. All Rights
          Reserved.
        </p>
      </footer>
    </div>
  )
}

// 🎯 Feature List with Stronger Hooks
const features = [
  {
    title: "📊 Goal Tracking",
    description:
      "Set and manage your daily, weekly, and monthly goals with ease. Get reminders and insights to stay on track."
  },
  {
    title: "📅 Habit Builder",
    description:
      "Turn small daily actions into lifelong habits. Keep streaks, break bad habits, and build a disciplined lifestyle."
  },
  {
    title: "🏆 Community Challenges",
    description:
      "Compete in goal-driven challenges with other users. Push yourself to the next level while staying motivated."
  },
  {
    title: "🔍 Personalized Insights",
    description:
      "Get in-depth analytics and performance reports. See what's working, what’s not, and how to improve."
  },
  {
    title: "🤝 Accountability Partners",
    description:
      "Team up with an accountability buddy to keep each other motivated, focused, and on track."
  },
  {
    title: "🔥 Gamification & Rewards",
    description:
      "Earn points, unlock achievements, and stay motivated through a fun and rewarding experience."
  }
]
