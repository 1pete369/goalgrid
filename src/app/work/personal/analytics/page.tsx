"use client" // Add this if you are using Next.js App Router

import { motion } from "framer-motion"

import {
  BarChart,
  PieChart,
  LineChart,
  Activity,
  TrendingUp
} from "lucide-react"
import Link from "next/link"

export default function AnalyticsLanding() {
  return (
    <div className="min-h-screen bg-gray-900 text-white pt-20">
      {/* Header */}
      <header className="text-center py-16 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
          Unlock Powerful <span className="text-blue-500">Analytics</span>
        </h1>
        <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
          Gain deep insights into your habits, productivity, and goals. Make
          data-driven decisions to optimize your workflow.
        </p>
      </header>

      {/* Analytics Features */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6 md:px-16">
        {analyticsData.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col items-center text-center"
          >
            {" "}
            <Link href={item.link}>
              <item.icon className="text-blue-500 w-12 h-12" />
              <h3 className="text-xl font-semibold mt-4">{item.title}</h3>
              <p className="text-gray-400 mt-2 text-sm">{item.description}</p>
            </Link>
          </motion.div>
        ))}
      </section>
      
      {/* CTA Section */}
      <section className="text-center py-16">
        <h2 className="text-3xl font-bold text-white">Start Tracking Today</h2>
        <p className="text-gray-300 mt-2">
          Take control of your productivity with real-time insights.
        </p>
        <button className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition">
          View Dashboard
        </button>
      </section>
    </div>
  )
}

// Analytics Feature Data
const analyticsData = [
  {
    title: "Habit Progress",
    description:
      "Track daily, weekly, and monthly habits with detailed insights.",
    link: "/work/personal/analytics/habits",
    icon: BarChart
  },
  {
    title: "Goal Completion",
    description: "Monitor goal progress and stay on track with visual reports.",
    link: "/work/personal/analytics/goals",
    icon: TrendingUp
  },
  {
    title: "Task Performance",
    description: "Analyze completed and pending tasks for better efficiency.",
    link: "/work/personal/analytics/tasks",
    icon: Activity
  },
  {
    title: "Engagement Metrics",
    description: "See community interactions and participation levels.",
    link: "/work/personal/analytics/engagement-metrics",
    icon: PieChart
  }
]
