'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createBlogPost(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    throw new Error('User not authenticated')
  }

  const { error } = await supabase
    .from('blogs')
    .insert({
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      user_id: user.id
    })

  if (error) {
    throw new Error('Failed to create post')
  }

  revalidatePath('/myblog')
  return { success: true }
}

export async function updateBlogPost(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get('id') as string
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    throw new Error('User not authenticated')
  }

  const { error } = await supabase
    .from('blogs')
    .update({
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      created_at: new Date().toISOString()
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Update Error:', error.message);
    throw new Error(error.message);
  }

  revalidatePath('/myblog')
  return { success: true }
}

export async function deleteBlogPost(id: string) {
  const supabase =  await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    throw new Error('User not authenticated')
  }

  const { error } = await supabase
    .from('blogs')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    throw new Error('Failed to delete post')
  }

  revalidatePath('/myblog')
  return { success: true }
}
