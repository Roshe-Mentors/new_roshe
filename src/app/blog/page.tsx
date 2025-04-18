"use client"
import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { Search } from "lucide-react"
import Link from "next/link"

export default function BlogPage() {
  const [email, setEmail] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle subscription logic here
    console.log("Subscribing with email:", email)
    setEmail("")
    // You could add success message or API call here
  }

  const handleSubmitArticle = () => {
    // Handle article submission logic
    console.log("Submit article clicked")
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Sidebar and Main Content Container */}
      <div className="flex flex-grow">
        {/* Sidebar */}
        <div className="hidden md:flex flex-col w-24 border-r border-gray-200 py-8">
          <div className="flex flex-col items-center justify-center h-32 border-b border-gray-200">
            <span className="transform -rotate-90 text-gray-500 font-medium tracking-wide">News & Update</span>
          </div>
          <div className="flex flex-col items-center justify-center h-32">
            <span className="transform -rotate-90 text-gray-500 font-medium tracking-wide">Videos</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow px-4 md:px-8 py-6">
          {/* Blog Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Blog</h1>
            <div className="flex w-full md:w-auto gap-4">
              <div className="relative flex-grow md:w-80">
                <input
                  type="text"
                  placeholder="Search article"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-gray-500 focus:border-gray-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <button
                onClick={handleSubmitArticle}
                className="px-4 py-2 bg-gray-900 text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
              >
                Submit Article
              </button>
            </div>
          </div>

          {/* Featured Article */}
          <div className="grid md:grid-cols-5 gap-6 mb-12">
            <div className="md:col-span-2">
              <div className="rounded-lg overflow-hidden">
                <div className="bg-purple-400 text-white p-6 text-center">
                  <h2 className="text-2xl font-serif">The Future of 3D Animation: Trends to Watch.</h2>
                </div>
                <Image
                  src="/placeholder.svg?height=300&width=500"
                  alt="3D Animation"
                  width={500}
                  height={300}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            <div className="md:col-span-3 flex flex-col justify-center">
              <div className="mb-2">
                <span className="text-purple-400">News & Updates</span>
                <span className="text-gray-700"> — March 19, 2025</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">The future of 3D Animation: Trends to watch</h2>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    alt="Author"
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">Apinke Afolabi</p>
                  <p className="text-sm text-gray-600">April 4th, 2025</p>
                </div>
              </div>
            </div>
          </div>

          {/* Latest Blog Posts */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Latest blog posts</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="relative">
                    <Image
                      src={`/placeholder.svg?height=200&width=400&text=Blog${item}`}
                      alt={`Blog post ${item}`}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-white text-xs font-medium px-2 py-1 rounded">
                      Top rated
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="mb-2">
                      <span className="text-purple-400 text-sm">News & Updates</span>
                      <span className="text-gray-500 text-sm"> — March 19, 2025</span>
                    </div>
                    <h3 className="font-bold mb-3">The future of 3D Animation: Trends to watch.</h3>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden">
                        <Image
                          src="/placeholder.svg?height=32&width=32"
                          alt="Author"
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Apinke Afolabi</p>
                        <p className="text-xs text-gray-600">April 4th, 2025</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
                Load more posts
              </button>
            </div>
          </div>

          {/* Top Writers */}
          <div className="border-l border-gray-200 pl-6 mb-12">
            <h2 className="text-2xl font-bold mb-6">Top writers</h2>
            <div className="space-y-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=40&width=40"
                        alt="Writer"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">Apinke Afolabi</p>
                      <p className="text-sm text-gray-600">April 4th, 2025</p>
                    </div>
                  </div>
                  <Link href="#" className="text-purple-400 text-sm hover:underline">
                    Read Blogs
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto">
              <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl">👀</span>
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Roshe Mentorship&apos;s Newsletter</h2>
          <p className="text-gray-300 mb-6 max-w-xl mx-auto">
            Get the world&apos;s most powerful insight on animation, game and film and accelerating your career — 1 idea,
            every week.
          </p>
          <p className="text-gray-400 mb-6">By Omobolaji Moses • Over 100 subscribers</p>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto mb-4">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your Email"
                className="w-full pl-10 pr-4 py-2 bg-white text-gray-900 rounded-md focus:outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-400 text-white font-medium rounded-md hover:bg-purple-500 transition-colors"
            >
              Subscribe
            </button>
          </form>

          <p className="text-gray-400 text-sm">
            By subscribing you agree to{" "}
            <Link href="#" className="underline">
              Substack&apos;s Terms of Use
            </Link>
            ,{" "}
            <Link href="#" className="underline">
              our Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="#" className="underline">
              our Information collection notice
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
