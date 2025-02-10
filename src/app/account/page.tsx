import AccountForm from './accountform'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
export const runtime = 'edge';

export default async function Account() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login') 
  }


  return <AccountForm user={user} />
}