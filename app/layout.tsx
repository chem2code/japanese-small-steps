import type { Metadata } from 'next'
import '../src/styles.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://hyoga-japanese-learning.chenlianguu.chatgpt.site'),
  title: {
    default: '氷河日本語 · 30天日语入门',
    template: '%s · 氷河日本語',
  },
  description: '面向中文零基础学习者的30天日语入门计划。每天15分钟，从听懂到开口。',
  applicationName: '氷河日本語',
  openGraph: {
    title: '30天日语入门 · 氷河日本語',
    description: '每天15分钟，从听懂到开口。',
    type: 'website',
    images: [{ url: '/og.png', width: 1536, height: 1024, alt: '30天日语入门，每天15分钟，从听懂到开口' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '30天日语入门 · 氷河日本語',
    description: '每天15分钟，从听懂到开口。',
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
