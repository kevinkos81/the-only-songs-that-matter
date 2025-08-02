// File: pages/_app.js

import '../styles/globals.css'
import { Analytics } from '@vercel/analytics/next'
import { MDXProvider } from '@mdx-js/react'

const components = {
  // your custom MDX components go here
}

function MyApp({ Component, pageProps }) {
  return (
    <>
      {/* first, render your MDXProvider + page */}
      <MDXProvider components={components}>
        <Component {...pageProps} />
      </MDXProvider>

      {/* then, drop in the Analytics */}
      <Analytics />
    </>
  )
}

export default MyApp
