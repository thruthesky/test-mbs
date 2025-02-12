import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export const runtime = 'edge'

export default async function Home() {
  const supabase =  await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/myblog') // Redirect if user is logged in
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-3xl font-bold">BlogSite</h1>
        <p className="text-lg text-center sm:text-left">
          Welcome to your BlogSite!
        </p>
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a href="/login" className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-600 text-white gap-2 hover:bg-blue-700 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5">
            Login
          </a>
          <a href="/signup" className="rounded-full border border-solid border-gray-400 transition-colors flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44">
            Register
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center text-sm">
        <p>&copy; {new Date().getFullYear()} BlogSite. All rights reserved.</p>
      </footer>
    </div>
  )
}
