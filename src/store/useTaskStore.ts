import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'

export interface Task {
  id: string
  user_id: string
  project_id: string | null
  title: string
  description: string | null
  is_completed: boolean
  priority: 'low' | 'medium' | 'high' | 'critical'
  due_date: string | null
  created_at: string
  updated_at: string
}

export interface NewTask {
  user_id: string
  project_id?: string | null
  title: string
  description?: string | null
  is_completed?: boolean
  priority?: 'low' | 'medium' | 'high' | 'critical'
  due_date?: string | null
}

export interface UpdateTask {
  title?: string
  description?: string | null
  is_completed?: boolean
  priority?: 'low' | 'medium' | 'high' | 'critical'
  due_date?: string | null
  project_id?: string | null
}

interface TaskStore {
  tasks: Task[]
  isLoading: boolean
  error: string | null
  fetchTasks: () => Promise<void>
  addTask: (task: NewTask) => Promise<void>
  updateTask: (id: string, updates: UpdateTask) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  toggleTaskCompletion: (id: string, isCompleted: boolean) => Promise<void>
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  fetchTasks: async () => {
    set({ isLoading: true, error: null })
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false }) as { data: Task[] | null; error: any }

      if (error) {
        set({ error: error.message, isLoading: false })
      } else {
        set({ tasks: data || [], isLoading: false })
      }
    } catch (err: any) {
      console.error('[Antigravity] fetchTasks exception:', err)
      set({ error: err.message || 'An unexpected error occurred while fetching tasks', isLoading: false })
    }
  },

  addTask: async (task) => {
    console.log('[useTaskStore] addTask called with:', task)
    const tempId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15)
    const now = new Date().toISOString()
    const optimisticTask: Task = {
      id: tempId,
      user_id: task.user_id,
      project_id: task.project_id ?? null,
      title: task.title,
      description: task.description ?? null,
      is_completed: task.is_completed ?? false,
      priority: task.priority ?? 'medium',
      due_date: task.due_date ?? null,
      created_at: now,
      updated_at: now,
    }
    
    console.log('[useTaskStore] Applying optimistic update')
    set((state) => ({ tasks: [optimisticTask, ...state.tasks] }))

    console.log('[useTaskStore] Sending to Supabase...')
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('tasks')
        .insert(task as any)
        .select()
        .single() as { data: Task | null; error: any }

      console.log('[useTaskStore] Supabase response - data:', data, 'error:', error)

      if (error) {
        console.error('[Antigravity] Failed to add task:', error.message, error)
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== tempId), error: error.message }))
      } else if (data) {
        console.log('[useTaskStore] Replacing optimistic task with real data')
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === tempId ? data : t)),
        }))
      }
    } catch (err: any) {
      console.error('[Antigravity] addTask exception:', err)
      set((state) => ({ tasks: state.tasks.filter((t) => t.id !== tempId), error: err.message || 'An unexpected error occurred while adding the task' }))
    }
  },

  updateTask: async (id, updates) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, ...updates, updated_at: new Date().toISOString() } : t
      ),
    }))

    const supabase = createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('tasks') as any)
      .update(updates)
      .eq('id', id)

    if (error) {
      set({ error: error.message })
      get().fetchTasks()
    }
  },

  deleteTask: async (id) => {
    const prev = get().tasks
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    }))

    const supabase = createClient()
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)

    if (error) {
      set({ error: error.message, tasks: prev })
    }
  },

  toggleTaskCompletion: async (id, isCompleted) => {
    await get().updateTask(id, { is_completed: isCompleted })
  },
}))
