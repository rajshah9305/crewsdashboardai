import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface Mission {
  id: string
  mission: string
  result: string
  status: 'pending' | 'completed' | 'failed'
  created_at: string
  completed_at?: string
}

export async function saveMission(mission: string, result: string, status: 'completed' | 'failed') {
  const { data, error } = await supabase
    .from('missions')
    .insert([
      {
        mission,
        result,
        status,
        completed_at: new Date().toISOString()
      }
    ])
    .select()

  if (error) {
    console.error('Error saving mission:', error)
    return null
  }

  return data
}

export async function getMissions(limit = 10) {
  const { data, error } = await supabase
    .from('missions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching missions:', error)
    return []
  }

  return data as Mission[]
}
