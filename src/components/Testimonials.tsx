'use client'
import { motion } from 'framer-motion'

const testimonials = [
  {
    quote: "Antigravity Tasks completely changed how our product team operates. We ship 30% faster and nothing falls through the cracks.",
    author: "Sarah Chen",
    role: "VP of Product, TechFlow",
    avatar: "https://i.pravatar.cc/150?u=sarah"
  },
  {
    quote: "The interface is so clean it gets out of your way. It's the first todo app that doesn't feel like a chore to use.",
    author: "Marcus Rodriguez",
    role: "Founder, Minimal Studio",
    avatar: "https://i.pravatar.cc/150?u=marcus"
  },
  {
    quote: "Finally, a task manager that understands modern workflows. The predictive analytics are basically magic.",
    author: "Elena Rostov",
    role: "Engineering Manager, DataSync",
    avatar: "https://i.pravatar.cc/150?u=elena"
  }
]

export function Testimonials() {
  return (
    <section id="testimonials" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Loved by builders.
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what teams who have switched to Antigravity are saying.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 rounded-2xl bg-gradient-to-b from-white/[0.05] to-transparent border border-white/5 flex flex-col justify-between h-full"
            >
              <p className="text-lg text-gray-300 leading-relaxed mb-8">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center gap-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.author} 
                  className="w-12 h-12 rounded-full border border-white/10"
                />
                <div>
                  <h4 className="text-white font-medium">{testimonial.author}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
