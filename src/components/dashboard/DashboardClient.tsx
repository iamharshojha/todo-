'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2, ListTodo, Calendar, BrainCircuit, LogOut, Settings } from 'lucide-react'
import { TaskManager } from './TaskManager'
import { CalendarView } from './CalendarView'
import { FutureYou } from './FutureYou'
import { useTaskStore } from '@/store/useTaskStore'
import { Database } from '@/types/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']

interface DashboardClientProps {
  user: { id: string; email?: string }
  profile: Profile | null
}

type Tab = 'tasks' | 'calendar' | 'future-you'

export function DashboardClient({ user, profile }: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>('tasks')
  const { fetchTasks } = useTaskStore()

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-black flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <div className="flex items-center gap-2 text-white font-medium">
            <CheckCircle2 className="w-5 h-5 text-purple-500" />
            <span>Antigravity Tasks</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors ${
              activeTab === 'tasks' ? 'bg-purple-500/10 text-purple-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <ListTodo className="w-5 h-5" />
            <span className="font-medium">Tasks</span>
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors ${
              activeTab === 'calendar' ? 'bg-purple-500/10 text-purple-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="font-medium">Calendar</span>
          </button>
          <button
            onClick={() => setActiveTab('future-you')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors ${
              activeTab === 'future-you' ? 'bg-purple-500/10 text-purple-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <BrainCircuit className="w-5 h-5" />
            <span className="font-medium">Future You</span>
          </button>
        </div>

        <div className="p-4 border-t border-white/5 space-y-4">
          <div className="flex items-center gap-3 px-2">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full border border-white/10" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 font-medium">
                {(profile?.full_name || user.email || 'U')[0].toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{profile?.full_name || user.email}</p>
              <p className="text-xs text-gray-500 truncate">Free Plan</p>
            </div>
          </div>
          
          <form action="/auth/signout" method="post">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm text-gray-400 hover:bg-white/5 hover:text-white transition-colors border border-transparent hover:border-white/10">
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-black via-[#0a0a0c] to-black">
        {/* Top Header */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 shrink-0">
          <h1 className="text-xl font-medium capitalize">
            {activeTab.replace('-', ' ')}
          </h1>
          <button className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5">
            <Settings className="w-5 h-5" />
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto h-full">
            {activeTab === 'tasks' && <TaskManager userId={user.id} />}
            {activeTab === 'calendar' && <CalendarView userId={user.id} />}
            {activeTab === 'future-you' && <FutureYou profile={profile} />}
          </div>
        </div>
      </main>
    </div>
  )
}
