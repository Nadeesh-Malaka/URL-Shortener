"use client"

import type React from "react"
import { ThumbsUp, Link, ShieldCheck, BarChart2, Zap, Smartphone } from "lucide-react"

const FeatureCard = ({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode
  title: string
  description: string
  color: string
}) => {
  return (
    <div className="flex flex-col items-center text-center p-6">
      <div className={`w-16 h-16 flex items-center justify-center rounded-full mb-4 ${color}`}>{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

const FeaturesSection = () => {
  return (
    <div id="features" className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Why Choose <span className="text-purple-600">ShortURL</span>?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<ThumbsUp size={32} className="text-blue-600" />}
            title="Easy"
            description="ShortURL is easy and fast, enter the long link to get your shortened link"
            color="bg-blue-100"
          />
          <FeatureCard
            icon={<Link size={32} className="text-purple-600" />}
            title="Shortened"
            description="Use any link, no matter what size, TinyURL always shortens"
            color="bg-purple-100"
          />
          <FeatureCard
            icon={<ShieldCheck size={32} className="text-green-600" />}
            title="Secure"
            description="It is fast and secure, our service has HTTPS protocol and data encryption"
            color="bg-green-100"
          />
          <FeatureCard
            icon={<BarChart2 size={32} className="text-amber-600" />}
            title="Statistics"
            description="Check the number of clicks that your shortened URL received"
            color="bg-amber-100"
          />
          <FeatureCard
            icon={<Zap size={32} className="text-red-600" />}
            title="Reliable"
            description="All links that try to disseminate spam, viruses and malware are deleted"
            color="bg-red-100"
          />
          <FeatureCard
            icon={<Smartphone size={32} className="text-indigo-600" />}
            title="Devices"
            description="Compatible with smartphones, tablets and desktop"
            color="bg-indigo-100"
          />
        </div>
      </div>
    </div>
  )
}

export default FeaturesSection
