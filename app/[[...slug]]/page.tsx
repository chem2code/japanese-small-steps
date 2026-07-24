'use client'

import dynamic from 'next/dynamic'

const LearnJapanClient = dynamic(() => import('./LearnJapanClient'), {
  ssr: false,
  loading: () => (
    <div className="route-loading">
      <span>読み込み中</span>
      <p>正在准备学习内容…</p>
    </div>
  ),
})

export default function LearnJapanPage() {
  return <LearnJapanClient />
}
