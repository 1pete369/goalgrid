"use client"

import { useUserContext } from "@/contexts/UserDataProviderContext"
import Link from "next/link"
import { BiLinkExternal } from "react-icons/bi"

export default function WorkPage() {

  const { user }= useUserContext()

  if (user === null) return <div className="min-h-[cal(100vh)] w-full flex justify-center items-center"><p className="">Loading...</p></div>

  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen w-[100%] select-none mx-auto">
      <header className="bg-blue-600 text-white py-10 px-4 text-center ">
        <h1 className="text-4xl font-bold mb-4">Your Daily Tasks</h1>
        <p className="text-lg mb-6">
          Manage your work, stay productive, and keep track of progress!
        </p>
        {
          user===null &&
          <Link href="/auth/register" className="bg-white text-blue-600 px-6 py-3 rounded-lg shadow-lg font-semibold hover:bg-gray-100 transition">
        Get Started
      </Link>
        }
      </header>

      <section className="py-16 px-4 md:px-8 lg:px-16">
        <h2 className="text-2xl font-bold  mb-10">Featuring!!</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition max-w-sm hover:bg-blue-600 hover:text-white">
          <Link href={"/work/personal/todos"} className="hover:bg-blue-600 flex items-center gap-1">
              <h3 className="text-xl font-semibold mb-2 underline">
                Todos Space!
              </h3><div><BiLinkExternal /></div>
          </Link>
              <p className="text-lg">Create a checkList of tasks!📃</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition max-w-sm hover:bg-blue-600 hover:text-white">
            <h3 className="text-xl font-semibold mb-2 underline">
              Adding more!!
            </h3>
            <p className="text-lg">Stay Tuned!👋</p>
          </div>
        </div>
      </section>
    </div>
  )
}
