import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import BlogView from '@/app/myblog/blogform'

export default async function BlogPage() {
  const  supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return <BlogView user={user} />
}