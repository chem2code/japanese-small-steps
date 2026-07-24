import type { Metadata } from 'next'
import '../src/styles.css'

export const metadata: Metadata = {
  title: {
    default: '氷河日本語',
    template: '%s · 氷河日本語',
  },
  description: '面向中文初学者的现代日语学习应用：课程、读音、真人录音与闪卡复习。',
  applicationName: '氷河日本語',
  openGraph: {
    title: '氷河日本語',
    description: 'Japanese, one day at a time.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '氷河日本語',
    description: 'Japanese, one day at a time.',
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
