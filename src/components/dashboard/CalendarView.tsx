'use client'

import { useState } from 'react'
import { useTaskStore } from '@/store/useTaskStore'
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function CalendarView({ userId }: { userId: string }) {
  const { tasks } = useTaskStore()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  // Calendar logic
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay()

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const blanks = Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }, (_, i) => i) // Adjust for Monday start (0=Sun)
  
  // Real JS Date comparison helper
  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate()
  }

  const tasksForSelectedDate = tasks.filter(t => t.due_date && isSameDay(new Date(t.due_date), selectedDate))

  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex-1 flex flex-col xl:flex-row gap-8">
        
        {/* Calendar Grid */}
        <div className="xl:w-2/3 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold">{monthNames[month]} {year}</h2>
            <div className="flex gap-2">
              <button onClick={prevMonth} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={nextMonth} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2 text-center text-sm font-medium text-gray-500">
            <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
          </div>
          
          <div className="grid grid-cols-7 gap-2 flex-1">
            {blanks.map((b) => (
              <div key={`blank-${b}`} className="min-h-[100px] rounded-xl bg-white/[0.01] border border-transparent" />
            ))}
            
            {days.map((day) => {
              const date = new Date(year, month, day)
              const isSelected = isSameDay(date, selectedDate)
              const isToday = isSameDay(date, new Date())
              const dayTasks = tasks.filter(t => t.due_date && isSameDay(new Date(t.due_date), date))
              
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(date)}
                  className={`min-h-[100px] p-2 rounded-xl flex flex-col items-start border transition-all ${
                    isSelected 
                      ? 'bg-purple-500/20 border-purple-500/50' 
                      : 'bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04]'
                  }`}
                >
                  <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium mb-2 ${
                    isToday ? 'bg-purple-500 text-white' : isSelected ? 'text-purple-300' : 'text-gray-300'
                  }`}>
                    {day}
                  </span>
                  
                  <div className="flex flex-col gap-1 w-full overflow-hidden">
                    {dayTasks.slice(0, 3).map((task, i) => (
                      <div key={i} className={`w-full text-left text-xs truncate px-2 py-1 rounded-md ${
                        task.is_completed ? 'bg-white/5 text-gray-500 line-through' : 'bg-purple-500/20 text-purple-200'
                      }`}>
                        {task.title}
                      </div>
                    ))}
                    {dayTasks.length > 3 && (
                      <div className="text-xs text-gray-500 font-medium pl-1">
                        +{dayTasks.length - 3} more
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Selected Date Tasks sidebar */}
        <div className="xl:w-1/3 bg-black/40 rounded-xl border border-white/5 p-6 flex flex-col h-full overflow-hidden">
          <h3 className="text-xl font-medium mb-1">
            {isSameDay(selectedDate, new Date()) ? 'Today' : selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
          </h3>
          <p className="text-gray-500 text-sm mb-6">{tasksForSelectedDate.length} tasks due</p>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            <AnimatePresence>
              {tasksForSelectedDate.length > 0 ? (
                tasksForSelectedDate.map(task => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="p-4 rounded-xl border border-white/10 bg-white/[0.03] flex items-start gap-3"
                  >
                     <CheckCircle className={`w-5 h-5 mt-0.5 shrink-0 ${task.is_completed ? 'text-emerald-500' : 'text-gray-600'}`} />
                     <div>
                        <p className={`text-sm font-medium ${task.is_completed ? 'text-gray-500 line-through' : 'text-white'}`}>{task.title}</p>
                        <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] border ${
                          task.priority === 'critical' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                          task.priority === 'high' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 
                          task.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 
                          'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}>
                          {task.priority.toUpperCase()}
                        </span>
                     </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">No tasks due on this date.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  )
}
