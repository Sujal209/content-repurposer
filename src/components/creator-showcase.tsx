'use client'

import { motion } from 'framer-motion'
import { ExternalLink, TrendingUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const creators = [
  {
    name: "Alex Johnson",
    handle: "@alexbuilds",
    niche: "SaaS Development",
    followers: "45K",
    growth: "+300% in 3 months",
    avatar: "AJ",
    story: "Went from 15K to 45K followers using repuposemate to repurpose technical blog posts into engaging Twitter threads.",
    platform: "Twitter"
  },
  {
    name: "Maria Santos",
    handle: "@designwithmaria",
    niche: "UI/UX Design",
    followers: "78K",
    growth: "+250% engagement",
    avatar: "MS",
    story: "Transformed design case studies into viral LinkedIn carousels, landing 3 new high-paying clients.",
    platform: "LinkedIn"
  },
  {
    name: "David Kim",
    handle: "@marketingdave",
    niche: "Digital Marketing",
    followers: "92K",
    growth: "+400% reach",
    avatar: "DK",
    story: "Repurposed marketing guides into Instagram story series, growing from 20K to 92K followers.",
    platform: "Instagram"
  }
]

export default function CreatorShowcase() {
  return (
    <section className="py-28 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 text-white">Creator Success Stories</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Real creators, real results. See how repuposemate helped them scale their audience.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {creators.map((creator, index) => (
            <motion.div
              key={creator.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-[10px]"
            >
              <Card className="h-full min-h-[280px] hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-200">
                <CardContent className="p-7">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {creator.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{creator.name}</div>
                      <div className="text-sm text-gray-300">{creator.handle}</div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-500/20 p-3 rounded-lg mb-5 border border-blue-500/30">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="h-4 w-4 text-blue-400" />
                      <span className="font-bold text-blue-300">{creator.growth}</span>
                    </div>
                    <div className="text-sm text-blue-200 font-medium">{creator.followers} followers • {creator.niche}</div>
                  </div>
                  
                  <p className="text-gray-200 leading-relaxed mb-5 font-medium">"{creator.story}"</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300 font-medium">{creator.platform}</span>
                    <ExternalLink className="h-4 w-4 text-gray-400" />
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