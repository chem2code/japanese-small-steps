import type { Metadata } from 'next'
import '../src/styles.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://hyoga-japanese-learning.chenlianguu.chatgpt.site'),
  title: {
    default: '日语小步 · 免费日语课程',
    template: '%s · 日语小步',
  },
  description: '面向中文初学者的免费日语学习工具。课程、读音、复习与进度记录全部开放。',
  applicationName: '日语小步',
  openGraph: {
    title: '免费日语课程 · 日语小步',
    description: '打开即继续学习，免费使用课程、读音、复习与进度记录。',
    type: 'website',
    images: [{ url: '/og.png', width: 1536, height: 1024, alt: '日语小步免费日语课程' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '免费日语课程 · 日语小步',
    description: '打开即继续学习，免费使用课程、读音、复习与进度记录。',
    images: ['/og.png'],
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
