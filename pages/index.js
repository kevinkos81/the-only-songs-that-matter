// pages/index.js
import React, { useState } from 'react'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote'
import AudioPlayer from '../components/AudioPlayer'
import SearchBar from '../components/SearchBar'

export async function getStaticProps() {
  const postsDir = path.join(process.cwd(), 'posts')
  const filenames = fs.readdirSync(postsDir).filter((f) =>
    f.endsWith('.mdx')
  )

  const posts = await Promise.all(
    filenames.map(async (filename) => {
      const slug = filename.replace(/\.mdx$/, '')
      const fullPath = path.join(postsDir, filename)
      const raw = fs.readFileSync(fullPath, 'utf8')
      const { data: meta, content } = matter(raw)
      const contentState = await serialize(content)
      return { slug, meta, content: contentState }
    })
  )

  // Alphabetical order by title
  posts.sort((a, b) => a.meta.title.localeCompare(b.meta.title))

  return {
    props: { posts },
  }
}

export default function Home({ posts }) {
  // ← Hooks must be at top of component
  const [searchTerm, setSearchTerm] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)

  // Filter + re-sort alphabetically
  const filtered = posts
    .filter(({ meta }) =>
      meta.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.meta.title.localeCompare(b.meta.title))

  // Build playlist from meta/url fields
  const playlist = posts.map(({ slug, meta }) => {
    const audioUrl = meta.url
      ? meta.url.startsWith('/')
        ? meta.url
        : `/audio/${meta.url}`
      : ''
    let coverUrl = '/covers/default-cover.jpg'
    if (meta.cover) {
      const filename = meta.cover.split('/').pop()
      coverUrl = `/covers/${filename}`
    }
    return {
      url: audioUrl,
      title: meta.title,
      artist: meta.artist,
      year: meta.year,
      cover: coverUrl,
    }
  })

  // ---- JSX with balanced tags & responsive layout ----
  return (
    <div className="h-screen flex flex-col md:flex-row">
      {/* PLAYER (mobile: first & full-width; desktop: 1/3) */}
      <aside className="order-first w-full md:order-none md:w-1/3 p-6 bg-gray-50 overflow-auto">
        <AudioPlayer
          playlist={playlist}
          currentIndex={currentIndex}
          onTrackChange={setCurrentIndex}
        />
      </aside>

      {/* POSTS (mobile: last & full-width; desktop: 2/3) */}
      <main className="order-last w-full md:order-none md:w-2/3 p-6 overflow-auto space-y-8">
        <SearchBar onSearch={setSearchTerm} />

        {filtered.map(({ meta, content }, idx) => (
          <article key={idx}>
            <h1
              className="text-3xl font-bold mb-2 cursor-pointer"
              onClick={() => setCurrentIndex(idx)}
            >
              {meta.title}
            </h1>
            <h3 className="text-sm text-gray-600 mb-4">
              {meta.artist} • {meta.year}
            </h3>
            <div className="prose">
              <MDXRemote {...content} />
            </div>
          </article>
        ))}
      </main>
    </div>
  )
}
