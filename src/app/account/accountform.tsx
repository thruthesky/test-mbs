'use client'
import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { type User } from '@supabase/supabase-js'
import Link from 'next/link'

export default function AccountView({ user }: { user: User | null }) {
  const supabase = createClient()
  const [username, setUsername] = useState<string | null>(null)

  const getProfile = useCallback(async () => {
    try {
      const { data, error, status } = await supabase
        .from('profiles')
        .select(`username`)
        .eq('id', user?.id)
        .single()

      if (error && status !== 406) throw error
      if (data) setUsername(data.username)
    } catch (error) {
      console.error('Error loading user data:', error)
    }
  }, [user, supabase])

  useEffect(() => {
    if (user) getProfile()
  }, [user, getProfile])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96">
        <h1 className="text-2xl font-bold text-center mb-4">Account Details</h1>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">Email</label>
          <input 
            type="text" 
            value={user?.email || ''} 
            disabled 
            className="w-full p-2 border border-gray-300 rounded bg-gray-200 text-gray-800"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">Username</label>
          <input 
            type="text" 
            value={username || ''} 
            disabled 
            className="w-full p-2 border border-gray-300 rounded bg-gray-200 text-gray-800"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold">Password</label>
          <input 
            type="password" 
            value="••••••••" 
            disabled 
            className="w-full p-2 border border-gray-300 rounded bg-gray-200 text-gray-800"
          />
        </div>
        <div className="flex justify-between">
          <Link href="/myblog">
            <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Back</button>
          </Link>
          <form action="/auth/signout" method="post">
            <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" type="submit">
              Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
