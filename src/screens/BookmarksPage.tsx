import { BookOpen, Bookmark, Volume2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { japaneseMarkup } from '../content'
import { exampleForWord } from '../wordExamples'
import type { StudyController } from '../study'

export function BookmarksPage({ study }: { study: StudyController }) {
  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text.replace(/@\d*/g, ''))
    utterance.lang = 'ja-JP'
    utterance.rate = 0.85
    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className="page bookmarks-page">
      <header className="product-page-head compact">
        <div>
          <span className="eyebrow">IMPORTANT WORDS</span>
          <h1>重点单词</h1>
          <p>把值得反复看的词集中起来，并用课文原句记住它的使用场景。</p>
        </div>
        <div className="review-count"><Bookmark size={22} /><strong>{study.bookmarkedWords.length}</strong><span>个已标记</span></div>
      </header>

      {study.bookmarkedWords.length === 0 ? (
        <section className="bookmarks-empty">
          <span><Bookmark size={30} /></span>
          <h2>还没有重点单词</h2>
          <p>在课程生词表或复习卡片上点击书签图标，单词就会收集到这里。</p>
          <Link className="button primary" to="/review">去复习单词</Link>
        </section>
      ) : (
        <section className="bookmarked-grid">
          {study.bookmarkedWords.map((word) => {
            const example = exampleForWord(word)
            const lessonId = Number(word.lesson.match(/\d+/)?.[0]) || 1
            const spokenWord = (word.word || word.kanji || word.kana).replace(/!|\([^)]*\)/g, '')
            return (
              <article className="bookmarked-card" key={`${word.lesson}-${word.word}-${word.desc}`}>
                <div className="bookmarked-word-head">
                  <div>
                    <strong dangerouslySetInnerHTML={{ __html: japaneseMarkup(word.word || word.kanji || word.kana) }} />
                    <span>{word.kana.replace(/@\d*/g, '')}</span>
                  </div>
                  <button type="button" onClick={() => study.toggleBookmark(word)} aria-label="取消重点标记" title="取消重点标记">
                    <Bookmark size={18} fill="currentColor" />
                  </button>
                </div>
                <p className="bookmarked-meaning"><small>{word.pos}</small>{word.desc}</p>
                {example ? (
                  <blockquote>
                    <span>课文原句</span>
                    <p>{example.sentence}</p>
                    <cite>第 {example.lessonId} 课 · {example.section}</cite>
                  </blockquote>
                ) : (
                  <div className="example-missing">本课课文中暂未找到包含该词的原句。</div>
                )}
                <div className="bookmarked-actions">
                  <button type="button" onClick={() => speak(spokenWord)}><Volume2 size={15} />听单词</button>
                  {example && <button type="button" onClick={() => speak(example.sentence)}><Volume2 size={15} />听例句</button>}
                  <Link to={`/lesson/beginner/${lessonId}#words`}><BookOpen size={15} />查看第 {lessonId} 课</Link>
                </div>
              </article>
            )
          })}
        </section>
      )}
    </div>
  )
}
