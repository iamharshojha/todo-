'use client'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden min-h-screen flex items-center">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-[128px] mix-blend-screen" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px] mix-blend-screen" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-purple-400 text-sm mb-8"
          >
            <Sparkles className="w-4 h-4" />
            <span>Introducing Antigravity Tasks 2.0</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-6"
          >
            Plan less. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              Achieve more.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            The premium task management tool designed for deep work. 
            Organize your life, predict your future capacity, and hit your goals faster than ever.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <Link
              href="/signup"
              className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-full font-medium flex items-center justify-center gap-2 hover:bg-gray-100 transition-all hover:scale-105 active:scale-95"
            >
              Start for free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/signup"
              className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white border border-white/10 rounded-full font-medium flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              Book a demo
            </Link>
          </motion.div>
        </div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="relative mx-auto max-w-5xl"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 h-full w-full pointer-events-none" />
          <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden shadow-2xl p-2">
            <div className="rounded-xl border border-white/5 bg-[#0A0A0A] overflow-hidden">
              {/* Fake Window Header */}
              <div className="h-12 border-b border-white/5 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
              </div>
              {/* Fake App Content */}
              <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 h-[400px]">
                <div className="col-span-1 space-y-4">
                  <div className="h-8 w-3/4 bg-white/5 rounded-md" />
                  <div className="h-24 w-full bg-white/5 rounded-md" />
                  <div className="h-24 w-full bg-white/5 rounded-md" />
                </div>
                <div className="col-span-2 space-y-4">
                  <div className="h-8 w-1/4 bg-white/5 rounded-md" />
                  <div className="h-40 w-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-white/5 rounded-md flex items-center justify-center">
                    <span className="text-white/20">Interactive Dashboard Preview</span>
                  </div>
                  <div className="h-40 w-full bg-white/5 rounded-md" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
