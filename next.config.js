/** @type {import('next').NextConfig} */

const isStaticExport = process.env.STATIC_EXPORT === 'true';

const nextConfig = {
  // Use static export for GitHub Pages, server mode for Vercel (needed for API routes)
  ...(isStaticExport ? { output: 'export' } : {}),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // basePath only needed for GitHub Pages
  ...(isStaticExport ? { basePath: '/sudan-interactive-curriculum' } : {}),
}

module.exports = nextConfig
