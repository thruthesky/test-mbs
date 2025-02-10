'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Post } from '@/app/myblog/blogform'
import { createBlogPost, updateBlogPost } from '@/app/actions/blog-actions'

interface BlogEditorProps {
  post?: Post
}

export default function BlogEditor({ post }: BlogEditorProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: post?.title || '',
    content: post?.content || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
  
    try {
      const form = new FormData()
      form.append('title', formData.title)
      form.append('content', formData.content)
  
      if (post) {
        form.append('id', post.id)
        await updateBlogPost(form)
      } else {
        await createBlogPost(form)
      }
  
      router.push('/myblog') 
      router.refresh() 
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-black-100">
      <div className="max-w-2xl w-full bg-white p-6 shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          {post ? 'Edit Post' : 'Create New Post'}
        </h2>
        
        {error && <div className="text-red-500 bg-red-100 p-2 rounded mb-4 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-lg font-medium text-gray-700">Title</label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-lg font-medium text-gray-700">Content</label>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg h-48 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              required
            />
          </div>

          <div className="flex justify-between items-center">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Post'}
            </button>
            
            <button
              type="button"
              onClick={() => router.push('/myblog')}
              className="px-5 py-2 bg-gray-300 text-gray-700 text-lg font-medium rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
