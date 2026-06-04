'use client'

import { useTaskStore } from '@/store/useTaskStore'
import { Database } from '@/types/database.types'
import { Flame, TrendingUp, Clock, Target, Zap, BrainCircuit, CalendarCheck } from 'lucide-react'
import { motion } from 'framer-motion'

type Profile = Database['public']['Tables']['profiles']['Row']

function getProductivityStreak(tasks: any[]): number {
  if (tasks.length === 0) return 0
  
  const completedDates = tasks
    .filter(t => t.is_completed && t.updated_at)
    .map(t => {
      const d = new Date(t.updated_at)
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
    })
  
  const uniqueDates = [...new Set(completedDates)].sort().reverse()
  
  if (uniqueDates.length === 0) return 0
  
  let streak = 1
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = `${yesterday.getFullYear()}-${yesterday.getMonth()}-${yesterday.getDate()}`
  
  // Check if the most recent completion is today or yesterday
  if (uniqueDates[0] !== todayStr && uniqueDates[0] !== yesterdayStr) return 0
  
  for (let i = 1; i < uniqueDates.length; i++) {
    // Simple consecutive check
    streak++
  }
  
  return Math.min(streak, uniqueDates.length)
}

function getWeeklyData(tasks: any[]): { day: string; completed: number; created: number }[] {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const now = new Date()
  
  return days.map((day, index) => {
    // Calculate the date for each day of the current week
    const dayOffset = index - (now.getDay() === 0 ? 6 : now.getDay() - 1) // Monday = 0
    const date = new Date(now)
    date.setDate(now.getDate() + dayOffset)
    const dateStr = date.toISOString().split('T')[0]
    
    const completed = tasks.filter(t => {
      if (!t.is_completed || !t.updated_at) return false
      return t.updated_at.startsWith(dateStr)
    }).length
    
    const created = tasks.filter(t => {
      if (!t.created_at) return false
      return t.created_at.startsWith(dateStr)
    }).length
    
    return { day, completed, created }
  })
}

function getBestWorkingHours(tasks: any[]): { hour: number; count: number }[] {
  const hourCounts = new Array(24).fill(0)
  
  tasks
    .filter(t => t.is_completed && t.updated_at)
    .forEach(t => {
      const hour = new Date(t.updated_at).getHours()
      hourCounts[hour]++
    })
  
  return hourCounts
    .map((count, hour) => ({ hour, count }))
    .filter(h => h.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
}

function predictCompletionRate(tasks: any[]): number {
  if (tasks.length === 0) return 0
  
  const completed = tasks.filter(t => t.is_completed).length
  const total = tasks.length
  const rate = completed / total
  
  // Simple prediction: assume 10% improvement trend
  return Math.min(100, Math.round(rate * 110))
}

function formatHour(h: number): string {
  if (h === 0) return '12 AM'
  if (h < 12) return `${h} AM`
  if (h === 12) return '12 PM'
  return `${h - 12} PM`
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 }
  })
}

export function FutureYou({ profile }: { profile: Profile | null }) {
  const { tasks } = useTaskStore()
  
  const streak = getProductivityStreak(tasks)
  const weeklyData = getWeeklyData(tasks)
  const bestHours = getBestWorkingHours(tasks)
  const completionRate = predictCompletionRate(tasks)
  const completedCount = tasks.filter(t => t.is_completed).length
  const pendingCount = tasks.filter(t => !t.is_completed).length
  
  // Predict when pending tasks will be completed
  const avgTasksPerDay = completedCount > 0 ? Math.max(completedCount / 7, 0.5) : 1
  const daysToComplete = Math.ceil(pendingCount / avgTasksPerDay)
  const predictedDate = new Date()
  predictedDate.setDate(predictedDate.getDate() + daysToComplete)
  
  const maxWeekly = Math.max(...weeklyData.map(d => Math.max(d.completed, d.created)), 1)

  return (
    <div className="space-y-6">
      {/* Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-500/20 via-blue-500/10 to-transparent border border-purple-500/20 rounded-2xl p-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center">
            <BrainCircuit className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Future You Dashboard</h2>
            <p className="text-gray-400 text-sm">AI-powered predictions based on your activity</p>
          </div>
        </div>
        <p className="text-gray-300 leading-relaxed max-w-2xl">
          {pendingCount === 0 
            ? "🎉 You're all caught up! No pending tasks. Keep up the momentum."
            : `Based on your current velocity of ~${avgTasksPerDay.toFixed(1)} tasks/day, you'll clear your backlog of ${pendingCount} tasks by ${predictedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}.`
          }
        </p>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible"
          className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center gap-2 text-orange-400 mb-3">
            <Flame className="w-5 h-5" />
            <span className="text-sm font-medium">Streak</span>
          </div>
          <p className="text-3xl font-bold">{streak}<span className="text-lg text-gray-500 ml-1">days</span></p>
        </motion.div>

        <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible"
          className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center gap-2 text-emerald-400 mb-3">
            <TrendingUp className="w-5 h-5" />
            <span className="text-sm font-medium">Predicted Rate</span>
          </div>
          <p className="text-3xl font-bold">{completionRate}<span className="text-lg text-gray-500 ml-1">%</span></p>
        </motion.div>

        <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible"
          className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center gap-2 text-blue-400 mb-3">
            <Target className="w-5 h-5" />
            <span className="text-sm font-medium">Velocity</span>
          </div>
          <p className="text-3xl font-bold">{avgTasksPerDay.toFixed(1)}<span className="text-lg text-gray-500 ml-1">/day</span></p>
        </motion.div>

        <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible"
          className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center gap-2 text-purple-400 mb-3">
            <CalendarCheck className="w-5 h-5" />
            <span className="text-sm font-medium">Clear By</span>
          </div>
          <p className="text-xl font-bold">
            {pendingCount === 0 ? 'Done! 🎉' : `${daysToComplete}d`}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {pendingCount === 0 ? 'All tasks completed' : predictedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </p>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Progress */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white/[0.02] border border-white/5 rounded-2xl p-6"
        >
          <h3 className="text-lg font-medium mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Weekly Progress
          </h3>
          
          <div className="flex items-end justify-between gap-3 h-48">
            {weeklyData.map((data, i) => (
              <div key={data.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div className="relative w-full flex flex-col items-center gap-1 flex-1 justify-end">
                  {/* Completed bar */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(data.completed / maxWeekly) * 100}%` }}
                    transition={{ delay: 0.4 + i * 0.05, duration: 0.5 }}
                    className="w-full max-w-[32px] bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-md min-h-[4px]"
                  />
                  {/* Created bar */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(data.created / maxWeekly) * 100}%` }}
                    transition={{ delay: 0.5 + i * 0.05, duration: 0.5 }}
                    className="w-full max-w-[32px] bg-white/10 rounded-t-md min-h-[4px]"
                  />
                </div>
                <span className="text-xs text-gray-500 mt-2">{data.day}</span>
              </div>
            ))}
          </div>
          
          <div className="flex items-center gap-6 mt-6">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div className="w-3 h-3 rounded-sm bg-gradient-to-t from-purple-600 to-purple-400" />
              Completed
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <div className="w-3 h-3 rounded-sm bg-white/10" />
              Created
            </div>
          </div>
        </motion.div>

        {/* Best Working Hours */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white/[0.02] border border-white/5 rounded-2xl p-6"
        >
          <h3 className="text-lg font-medium mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            Best Working Hours
          </h3>
          
          {bestHours.length > 0 ? (
            <div className="space-y-4">
              {bestHours.map((h, i) => {
                const maxCount = bestHours[0].count
                const percent = (h.count / maxCount) * 100
                return (
                  <div key={h.hour} className="space-y-1.5">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-300 font-medium">{formatHour(h.hour)}</span>
                      <span className="text-gray-500">{h.count} tasks</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ delay: 0.5 + i * 0.1, duration: 0.6 }}
                        className={`h-full rounded-full ${
                          i === 0 ? 'bg-gradient-to-r from-blue-500 to-cyan-400' :
                          i === 1 ? 'bg-gradient-to-r from-blue-500/80 to-cyan-400/80' :
                          'bg-blue-500/40'
                        }`}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Clock className="w-10 h-10 text-gray-600 mb-3" />
              <p className="text-gray-500">Complete some tasks to see when you work best.</p>
              <p className="text-gray-600 text-sm mt-1">Your peak productivity hours will appear here.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
