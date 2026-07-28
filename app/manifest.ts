import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '日语小步',
    short_name: '日语小步',
    description: '面向中文初学者的现代日语学习应用',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#f5f5f7',
    theme_color: '#f5f5f7',
    icons: [
      { src: '/icons/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/android-chrome-384x384.png', sizes: '384x384', type: 'image/png' },
      { src: '/icons/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
