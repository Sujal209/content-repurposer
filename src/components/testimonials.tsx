'use client'

import { motion } from 'framer-motion'
import { Star, Twitter, Linkedin, Instagram } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Indie Maker",
    company: "BuildFast",
    followers: "50K",
    platform: Twitter,
    avatar: "SC",
    content: "RepurposeMate saved me 6 hours this week. One blog post became 12 viral tweets that got 50K impressions!",
    metrics: "50K impressions, 1.2K likes",
    rating: 5
  },
  {
    name: "Marcus Rodriguez",
    role: "Content Creator",
    company: "GrowthHacks",
    followers: "85K",
    platform: Linkedin,
    avatar: "MR",
    content: "Finally, a tool that understands my voice. My LinkedIn engagement increased 3x since using RepurposeMate.",
    metrics: "3x engagement increase",
    rating: 5
  },
  {
    name: "Emma Thompson",
    role: "Solopreneur",
    company: "DesignDaily",
    followers: "120K",
    platform: Instagram,
    avatar: "ET",
    content: "I was spending 4 hours adapting each blog post. Now it takes 30 seconds and performs better!",
    metrics: "4 hours → 30 seconds",
    rating: 5
  }
]

export default function Testimonials() {
  return (
    <section className="py-28 bg-surface/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 text-white">Loved by 12,000+ Creators</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            See what content creators are saying about RepurposeMate
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-[10px]"
            >
              <Card className="h-full min-h-[280px] hover:shadow-xl transition-shadow duration-300 border-2 border-transparent hover:border-primary/20">
                <CardContent className="p-7">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  <p className="text-gray-200 mb-6 leading-relaxed font-medium">"{testimonial.content}"</p>
                  
                  <div className="bg-green-500/20 p-3 rounded-lg mb-5 border border-green-500/30">
                    <p className="text-green-300 text-sm font-semibold">📈 {testimonial.metrics}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-700 flex items-center justify-center text-white font-bold">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-white">{testimonial.name}</div>
                        <div className="text-sm text-gray-300 font-medium">{testimonial.role} • {testimonial.company}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <testimonial.platform className="h-4 w-4" />
                      <span className="text-sm font-medium">{testimonial.followers}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}