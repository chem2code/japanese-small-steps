import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '氷河日本語',
    short_name: '氷河日本語',
    description: '面向中文初学者的现代日语学习应用',
    start_url: '/',
    display: 'standalone',
    background_color: '#f7f5f0',
    theme_color: '#f7f5f0',
    icons: [
      { src: '/icons/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/android-chrome-384x384.png', sizes: '384x384', type: 'image/png' },
    ],
  }
}
