'use client'

import { useState } from 'react'
import { useTaskStore } from '@/store/useTaskStore'
import { CheckCircle, Circle, Trash2, Calendar as CalendarIcon, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Database } from '@/types/database.types'

type Priority = Database['public']['Tables']['tasks']['Row']['priority']

export function TaskManager({ userId }: { userId: string }) {
  const { tasks, addTask, toggleTaskCompletion, deleteTask, error, isLoading } = useTaskStore()
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [dueDate, setDueDate] = useState('')

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('[TaskManager] handleAddTask called. Title:', newTaskTitle)
    if (!newTaskTitle.trim()) {
      console.log('[TaskManager] Title is empty, returning.')
      return
    }

    console.log('[TaskManager] Calling addTask from store...')
    addTask({
      title: newTaskTitle,
      user_id: userId,
      priority,
      due_date: dueDate ? new Date(dueDate).toISOString() : null,
      is_completed: false
    })

    console.log('[TaskManager] Clearing form state.')
    setNewTaskTitle('')
    setDueDate('')
    setPriority('medium')
  }

  // Analytics for the top of the task manager
  const completedCount = tasks.filter(t => t.is_completed).length
  const totalCount = tasks.length
  const completionPercentage = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100)

  return (
    <div className="flex flex-col h-full space-y-8">
      {/* Mini Analytics Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
          <p className="text-gray-400 text-sm mb-1">Total Tasks</p>
          <p className="text-2xl font-semibold">{totalCount}</p>
        </div>
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
          <p className="text-gray-400 text-sm mb-1">Completed</p>
          <p className="text-2xl font-semibold text-emerald-400">{completedCount}</p>
        </div>
        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5">
          <p className="text-gray-400 text-sm mb-1">Completion Rate</p>
          <div className="flex items-end gap-3">
            <p className="text-2xl font-semibold text-purple-400">{completionPercentage}%</p>
            <div className="flex-1 h-2 bg-white/5 rounded-full mb-1.5 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400 flex items-center justify-between">
          <span>⚠️ {error}</span>
          <button onClick={() => useTaskStore.setState({ error: null })} className="text-red-500 hover:text-red-300 ml-4">Dismiss</button>
        </div>
      )}

      {/* Task Creation Form */}
      <form onSubmit={handleAddTask} className="bg-white/[0.02] border border-white/5 rounded-2xl p-2 flex flex-col md:flex-row items-center gap-2 relative z-10 focus-within:bg-white/[0.04] transition-colors shadow-lg">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 bg-transparent px-4 py-3 text-white placeholder-gray-500 focus:outline-none"
        />
        <div className="flex items-center gap-2 px-2 w-full md:w-auto">
          <div className="relative flex items-center border border-white/10 rounded-lg overflow-hidden bg-black/50 hover:bg-white/5 transition-colors">
            <CalendarIcon className="w-4 h-4 text-gray-400 absolute left-3 pointer-events-none" />
            <input 
              type="date" 
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-transparent pl-9 pr-3 py-2 text-sm text-gray-300 focus:outline-none w-[130px] custom-date-input" 
            />
          </div>
          
          <div className="relative flex items-center border border-white/10 rounded-lg overflow-hidden bg-black/50 hover:bg-white/5 transition-colors">
            <AlertCircle className={`w-4 h-4 absolute left-3 pointer-events-none ${
              priority === 'critical' ? 'text-red-500' :
              priority === 'high' ? 'text-orange-400' :
              priority === 'medium' ? 'text-yellow-400' : 'text-blue-400'
            }`} />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="bg-transparent pl-9 pr-8 py-2 text-sm text-gray-300 focus:outline-none appearance-none cursor-pointer w-[110px]"
            >
              <option value="low" className="bg-black">Low</option>
              <option value="medium" className="bg-black">Medium</option>
              <option value="high" className="bg-black">High</option>
              <option value="critical" className="bg-black">Critical</option>
            </select>
          </div>
          
          <button 
            type="submit"
            className="bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors ml-auto md:ml-2"
          >
            Add Task
          </button>
        </div>
      </form>

      {/* Task List */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <h3 className="text-lg font-medium mb-4 text-gray-200">Your Tasks</h3>
        
        {tasks.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-gray-500" />
            </div>
            <h4 className="text-xl font-medium text-white mb-2">No tasks yet</h4>
            <p className="text-gray-400 max-w-sm">Create a task above to start organizing your day. Tasks sync instantly across all your devices.</p>
          </div>
        ) : (
          <div className="space-y-2 overflow-y-auto pb-20 pr-2 custom-scrollbar">
            <AnimatePresence>
              {tasks.map((task) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`group flex items-start gap-4 p-4 rounded-xl border transition-all duration-300 ${
                    task.is_completed 
                      ? 'bg-white/[0.01] border-transparent opacity-60 hover:opacity-100' 
                      : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]'
                  }`}
                >
                  <button 
                    onClick={() => toggleTaskCompletion(task.id, !task.is_completed)}
                    className="mt-0.5 shrink-0 focus:outline-none"
                  >
                    {task.is_completed ? (
                      <CheckCircle className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-500 hover:text-white transition-colors" />
                    )}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <p className={`text-base transition-all ${
                      task.is_completed ? 'text-gray-500 line-through' : 'text-gray-200 font-medium'
                    }`}>
                      {task.title}
                    </p>
                    
                    <div className="flex items-center gap-3 mt-2 text-xs">
                      <span className={`px-2 py-0.5 rounded-full border ${
                        task.priority === 'critical' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                        task.priority === 'high' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 
                        task.priority === 'medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 
                        'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </span>
                      
                      {task.due_date && (
                        <span className="flex items-center gap-1 text-gray-400">
                          <CalendarIcon className="w-3 h-3" /> 
                          {new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .custom-date-input::-webkit-calendar-picker-indicator {
          filter: invert(1);
          opacity: 0.5;
          cursor: pointer;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}} />
    </div>
  )
}
