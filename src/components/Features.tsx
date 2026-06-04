'use client'
import { motion } from 'framer-motion'
import { Brain, Target, BarChart3, Clock } from 'lucide-react'

const features = [
  {
    title: "Smart Task Management",
    description: "Our AI auto-categorizes and prioritizes your tasks based on your habits and impending deadlines.",
    icon: Brain,
    color: "text-purple-400",
    bg: "bg-purple-400/10"
  },
  {
    title: "Priority Tracking",
    description: "Never lose sight of what matters. Advanced algorithms keep your most critical work front and center.",
    icon: Target,
    color: "text-blue-400",
    bg: "bg-blue-400/10"
  },
  {
    title: "Productivity Analytics",
    description: "Deep insights into how you work. Identify bottlenecks and optimize your daily workflow effortlessly.",
    icon: BarChart3,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10"
  },
  {
    title: "Future You Predictions",
    description: "See into the future. We predict your capacity next week based on your historical velocity.",
    icon: Clock,
    color: "text-orange-400",
    bg: "bg-orange-400/10"
  }
]

export function Features() {
  return (
    <section id="features" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">flow</span>.
          </h2>
          <p className="text-lg text-gray-400">
            We stripped away the clutter and left only the tools that actually help you get work done. Beautifully designed and blisteringly fast.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${feature.bg}`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
