'use client'
import { motion } from 'framer-motion'

const stats = [
  {
    value: "12M+",
    label: "Tasks Completed",
    description: "Our users get things done."
  },
  {
    value: "47%",
    label: "Productivity Increase",
    description: "Average weekly output jump."
  },
  {
    value: "150k",
    label: "Active Users",
    description: "Join the top performers."
  }
]

export function Stats() {
  return (
    <section id="stats" className="py-20 relative border-y border-white/5 bg-black/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 md:gap-6 divide-y md:divide-y-0 md:divide-x divide-white/5">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center md:px-6 pt-12 md:pt-0 first:pt-0"
            >
              <h4 className="text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-2">
                {stat.value}
              </h4>
              <p className="text-xl font-medium text-white mb-2">{stat.label}</p>
              <p className="text-gray-500">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
