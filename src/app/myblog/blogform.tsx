'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteBlogPost } from '@/app/actions/blog-actions'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { type User } from '@supabase/supabase-js'
import { UserCircleIcon } from '@heroicons/react/24/solid'

export interface Post {
    id: string
    title: string
    content: string
    created_at: string
    user_id: string
}

const PAGE_SIZE = 5

interface BlogViewProps {
    user: User | null
}

export default function BlogView({ user }: BlogViewProps) {
    const supabase = createClient()
    const router = useRouter()
    const [posts, setPosts] = useState<Post[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        if (!user) {
            router.push('/login')
        }
    }, [user, router])

    const fetchPosts = useCallback(async () => {
        if (!user) return

        setIsLoading(true)
        try {
            const startIndex = (currentPage - 1) * PAGE_SIZE
            const endIndex = startIndex + PAGE_SIZE - 1

            const { data, error, count } = await supabase
                .from('blogs')
                .select('*', { count: 'exact' })
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .range(startIndex, endIndex)

            if (error) throw error

            setPosts(data as Post[])
            setTotalPages(count ? Math.ceil(count / PAGE_SIZE) : 1)
        } catch (error) {
            console.error('Error fetching posts:', error)
        } finally {
            setIsLoading(false)
        }
    }, [currentPage, supabase, user])

    useEffect(() => {
        if (user) {
            fetchPosts()
        }
    }, [user, fetchPosts])

    const handleDelete = async (postId: string) => {
        if (!confirm('Are you sure you want to delete this post?')) return
    
        setIsDeleting(true)
        try {
            await deleteBlogPost(postId)
            router.push('/myblog') 
            fetchPosts() 
        } catch (error) {
            console.error('Delete error:', error)
        } finally {
            setIsDeleting(false)
        }
    }
    

    if (!user) {
        return <div>Redirecting to login...</div>
    }

    return (
        <div className="max-w-4xl mx-auto p-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Your Blog Posts</h1>
                <div className="flex items-center gap-4">
                    <Link href="/myblog/new" className="inline-flex px-4 py-2 bg-green-600 text-white rounded">
                        New Post
                    </Link>
                    <Link href="/account">
                        <UserCircleIcon className="w-8 h-8 text-gray-700 hover:text-gray-900 cursor-pointer" />
                    </Link>
                </div>
            </div>
            {isLoading ? (
                <div className="text-center">Loading posts...</div>
            ) : posts.length === 0 ? (
                <div className="text-center">No posts found</div>
            ) : (
                <>
                    <div className="space-y-6">
                        {posts.map((post) => (
                            <article key={post.id} className="border p-4 rounded-lg shadow-sm relative">
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <Link href={`/myblog/edit/${post.id}`} className="px-3 py-1 text-sm bg-blue-600 text-white rounded">
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(post.id)}
                                        className="px-3 py-1 text-sm bg-red-600 text-white rounded disabled:opacity-50"
                                        disabled={isDeleting}
                                    >
                                        {isDeleting ? 'Deleting...' : 'Delete'}
                                    </button>
                                </div>
                                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                                <p className="text-gray-600 mb-4">{post.content}</p>
                                <time className="text-sm text-gray-400">{new Date(post.created_at).toLocaleDateString()}</time>
                            </article>
                        ))}
                    </div>
                    <div className="mt-8 flex justify-center items-center gap-4">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1 || isLoading} className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50">
                            Previous
                        </button>
                        <span>Page {currentPage} of {totalPages}</span>
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages || isLoading} className="px-4 py-2 bg-gray-800 text-white rounded disabled:opacity-50">
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}
