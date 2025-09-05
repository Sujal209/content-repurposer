'use client'

import { motion } from 'framer-motion'
import { Shield, Lock, Eye, Server } from 'lucide-react'

const securityFeatures = [
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption for all your content"
  },
  {
    icon: Lock,
    title: "Privacy First",
    description: "Your content is never stored or shared"
  },
  {
    icon: Eye,
    title: "GDPR Compliant",
    description: "Full compliance with data protection laws"
  },
  {
    icon: Server,
    title: "99.9% Uptime",
    description: "Reliable service you can count on"
  }
]

export default function SecurityBadges() {
  return (
    <section className="py-28 bg-surface/20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h3 className="text-2xl font-bold mb-4 text-white">Secure & Reliable</h3>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Your content and data are protected with enterprise-grade security
          </p>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-6">
          {securityFeatures.map((feature, index) => (
            <div key={feature.title} className="p-[10px]">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-4"
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-blue-400" />
                </div>
                <h4 className="font-bold text-white mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-300 font-medium">{feature.description}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}