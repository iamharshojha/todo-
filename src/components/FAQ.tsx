'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: "How is this different from other todo apps?",
    answer: "Most todo apps are just digital lists. Antigravity Tasks acts as an intelligent assistant, predicting your capacity and auto-prioritizing based on your actual work patterns, not just due dates."
  },
  {
    question: "Do you have a mobile app?",
    answer: "Yes, our iOS and Android apps are included in all plans. They sync instantly and feature a tailored interface for on-the-go quick capture."
  },
  {
    question: "Can I import my data from Notion/Linear/Todoist?",
    answer: "Absolutely. We offer one-click imports from all major productivity tools. Your projects, tasks, and tags will map seamlessly to Antigravity."
  },
  {
    question: "Is there a free tier?",
    answer: "Yes! The free tier includes all core task management features for individuals. You only pay for advanced analytics and team collaboration features."
  }
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-32 relative max-w-3xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Frequently asked questions
        </h2>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index}
            className="border border-white/10 rounded-2xl bg-white/[0.02] overflow-hidden"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
            >
              <span className="font-medium text-white">{faq.question}</span>
              <ChevronDown 
                className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                  openIndex === index ? 'rotate-180' : ''
                }`} 
              />
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="px-6 pb-4 pt-0 text-gray-400">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  )
}
