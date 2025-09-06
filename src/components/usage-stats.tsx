'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Users, Clock, Zap } from 'lucide-react'

const stats = [
  {
    icon: Users,
    number: "12,000+",
    label: "Active Creators",
    description: "Content creators trust RepuposeMate",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: TrendingUp,
    number: "2.5M+",
    label: "Posts Generated",
    description: "Social media posts created this month",
    color: "from-green-500 to-green-600"
  },
  {
    icon: Clock,
    number: "50,000+",
    label: "Hours Saved",
    description: "Time saved by creators this week",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: Zap,
    number: "98%",
    label: "Satisfaction Rate",
    description: "Creators love RepuposeMate",
    color: "from-yellow-500 to-orange-500"
  }
]

export default function UsageStats() {
  return (
    <section className="py-28 bg-gradient-to-r from-gray-900 to-gray-800">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 text-white">Trusted by Creators Worldwide</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join thousands of content creators who are scaling their reach with RepuposeMate
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={stat.label} className="p-[10px]">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-lg font-semibold text-gray-300 mb-1">{stat.label}</div>
                <div className="text-sm text-gray-400">{stat.description}</div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}