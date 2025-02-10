'use server'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import BlogEditor from '@/app/myblog/blogeditor'
export const runtime = 'edge';

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id?: string }>
}) {
  const resolvedParams = await params; 

  if (!resolvedParams?.id) {
    redirect('/myblog');
  }

  const supabase = await createClient();

  const { data: post, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('id', resolvedParams.id) 
    .single();

  if (error || !post) {
    redirect('/myblog');
  }

  return <BlogEditor post={post} />;
}
