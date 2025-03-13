import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, Users, Target, Zap } from "lucide-react"

import LandingPage from "@/AppComponents/Landing";

export default function WorkPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Image src="/placeholder.svg" alt="Logo" width={32} height={32} />
            <span className="ml-2 text-xl font-bold text-slate-900">WorkApp</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/work/personal" className="text-slate-600 hover:text-slate-900">
              Personal
            </Link>
            <Link href="/work/community" className="text-slate-600 hover:text-slate-900">
              Community
            </Link>
            <Button variant="outline">Log in</Button>
            <Button>Sign up</Button>
          </div>
        </nav>
      </header>

      <main className="flex-grow">
        <section className="bg-slate-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl md:text-6xl">
                Stay Accountable. Achieve More.
              </h1>
              <p className="mt-3 max-w-md mx-auto text-xl text-slate-500 sm:text-2xl md:mt-5 md:max-w-3xl">
                Your personal and community-driven productivity platform. Track habits, set goals, journal your
                progress, and connect with like-minded individuals—all in one place.
              </p>
              <div className="mt-10 flex justify-center">
                <Button size="lg" className="px-8 py-3 text-lg">
                  Sign Up & Start Your Journey
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Key Features</h2>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: CheckCircle,
                  title: "Personal Productivity Tools",
                  description: "To-dos, Goals, Habits, Notes, Journal",
                },
                { icon: Users, title: "Community Chats & Challenges", description: "Connect and compete with others" },
                { icon: Target, title: "Daily Progress Tracking", description: "Build streaks and stay consistent" },
                { icon: Zap, title: "Reward System", description: "Stay motivated with achievements" },
              ].map((feature, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <feature.icon className="h-12 w-12 text-indigo-500 mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-500">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-100 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:flex lg:items-center lg:justify-between">
              <div className="lg:w-1/2">
                <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl mb-6">
                  Your All-in-One Productivity Dashboard
                </h2>
                <p className="text-xl text-slate-500 mb-8">
                  Get a bird's-eye view of your tasks, habits, goals, and community interactions. Everything you need to
                  stay productive and accountable, all in one place.
                </p>
                <Button size="lg">Explore the Dashboard</Button>
              </div>
              <div className="mt-10 lg:mt-0 lg:w-1/2">
                <Image
                  src="/placeholder.svg"
                  alt="Dashboard Preview"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">What Our Users Say</h2>
            </div>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {[
                {
                  name: "Alex Johnson",
                  role: "Entrepreneur",
                  quote:
                    "This app has revolutionized my productivity. The community aspect keeps me accountable like never before.",
                },
                {
                  name: "Sarah Lee",
                  role: "Fitness Coach",
                  quote:
                    "I love how I can track my habits and goals while connecting with like-minded individuals. It's a game-changer!",
                },
                {
                  name: "Michael Chen",
                  role: "Student",
                  quote:
                    "The reward system and streaks feature have made staying consistent with my studies so much easier and more fun.",
                },
              ].map((testimonial, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <p className="text-slate-600 mb-4">"{testimonial.quote}"</p>
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Image
                        src="/placeholder.svg"
                        alt={testimonial.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-slate-900">{testimonial.name}</p>
                      <p className="text-sm text-slate-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-slate-300 hover:text-white">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-300 hover:text-white">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-300 hover:text-white">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-slate-300 hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-300 hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-300 hover:text-white">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-slate-300 hover:text-white">
                    Community
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-300 hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-300 hover:text-white">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-slate-300 hover:text-white">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-300 hover:text-white">
                    Facebook
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-slate-300 hover:text-white">
                    Instagram
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-slate-700 pt-8 flex justify-between items-center">
            <p className="text-sm text-slate-400">&copy; 2023 WorkApp. All rights reserved.</p>
            <div className="flex space-x-6">
              <Link href="#" className="text-slate-400 hover:text-white">
                Terms
              </Link>
              <Link href="#" className="text-slate-400 hover:text-white">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

