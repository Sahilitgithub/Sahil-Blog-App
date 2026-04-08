import React from 'react'
import AllPost from './AllPost'
import { getPosts } from '@/utils/prisma/prismaPost'

const PostPage = async () => {
  // Get all posts from prisma via mongodb
  const posts = await getPosts()
  return (
    <section className="px-1 sm:px-2 p-2 mb-20 min-h-screen">
      <AllPost posts={posts} />
    </section>
  )
}

export default PostPage
