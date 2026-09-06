import { useState } from 'react'
import { BookOpen, Bookmark, MessageSquareQuote, Volume2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { japaneseMarkup } from '../content'
import { playGrammarAudio, stopGrammarAudio } from '../components/GrammarDetail'
import { useEffect } from 'react'
import { exampleForWord } from '../wordExamples'
import type { SentenceBookmarkInput, StudyController } from '../study'

export function BookmarksPage({ study }: { study: StudyController }) {
  const [tab, setTab] = useState<'words' | 'sentences'>('words')
  const [audioError, setAudioError] = useState(false)
  useEffect(() => () => stopGrammarAudio(), [])
  const speak = (text: string) => {
    setAudioError(false)
    void playGrammarAudio(text).catch(() => setAudioError(true))
  }
  const playSentence = (sentence: SentenceBookmarkInput) => {
    setAudioError(false)
    void playGrammarAudio(sentence.sentence, sentence.audioPath).catch(() => setAudioError(true))
  }

  const empty = tab === 'words' ? study.bookmarkedWords.length === 0 : study.bookmarkedSentences.length === 0
  return (
    <div className="page bookmarks-page">
      <header className="product-page-head compact">
        <div><span className="eyebrow">MY COLLECTIONS</span><h1>我的收藏</h1><p>把重点单词和有用的课文例句放在一起，随时回到原课复习。</p></div>
        <div className="review-count"><Bookmark size={22} /><strong>{study.bookmarkedWords.length + study.bookmarkedSentences.length + study.bookmarkedGrammarIds.length}</strong><span>项收藏</span></div>
      </header>
      <Link className="grammar-collection-link quiet-button" to="/grammar?saved=1"><Bookmark size={17} />语法收藏 · {study.bookmarkedGrammarIds.length} 条 <span>查看 →</span></Link>
      {audioError && <p role="status">暂时无法播放，请再试一次。</p>}
      <div className="collection-tabs" role="tablist" aria-label="收藏类型">
        <button className={tab === 'words' ? 'active' : ''} onClick={() => setTab('words')}><Bookmark size={16} />重点单词 <span>{study.bookmarkedWords.length}</span></button>
        <button className={tab === 'sentences' ? 'active' : ''} onClick={() => setTab('sentences')}><MessageSquareQuote size={16} />收藏例句 <span>{study.bookmarkedSentences.length}</span></button>
      </div>

      {empty ? (
        <section className="bookmarks-empty"><span>{tab === 'words' ? <Bookmark size={30} /> : <MessageSquareQuote size={30} />}</span><h2>{tab === 'words' ? '还没有重点单词' : '还没有收藏例句'}</h2><p>{tab === 'words' ? '在课程生词表或复习卡片上点击书签图标。' : '在课程的语法例句或重点单词下点击“收藏例句”。'}</p><Link className="button primary" to="/courses">打开课程目录</Link></section>
      ) : tab === 'words' ? (
        <section className="bookmarked-grid">
          {study.bookmarkedWords.map((word) => {
            const example = exampleForWord(word)
            const lessonId = Number(word.lesson.match(/\d+/)?.[0]) || 1
            const spokenWord = (word.word || word.kanji || word.kana).replace(/!|\([^)]*\)/g, '')
            const sentence = example ? { sentence: example.sentence, lessonId: example.lessonId, section: example.section } : null
            const sentenceSaved = sentence ? study.isSentenceBookmarked(sentence) : false
            return (
              <article className="bookmarked-card" key={`${word.lesson}-${word.word}-${word.desc}`}>
                <div className="bookmarked-word-head"><div><strong dangerouslySetInnerHTML={{ __html: japaneseMarkup(word.word || word.kanji || word.kana) }} /><span>{word.kana.replace(/@\d*/g, '')}</span></div><button type="button" onClick={() => study.toggleBookmark(word)} aria-label="取消重点标记"><Bookmark size={18} fill="currentColor" /></button></div>
                <p className="bookmarked-meaning"><small>{word.pos}</small>{word.desc}</p>
                {example ? <blockquote><span>课文原句</span><p>{example.sentence}</p><cite>第 {example.lessonId} 课 · {example.section}</cite></blockquote> : <div className="example-missing">本课课文中暂未找到包含该词的原句。</div>}
                <div className="bookmarked-actions"><button type="button" onClick={() => speak(spokenWord)}><Volume2 size={15} />听单词</button>{example && <><button type="button" onClick={() => speak(example.sentence)}><Volume2 size={15} />听例句</button><button className={sentenceSaved ? 'saved' : ''} type="button" onClick={() => sentence && study.toggleSentenceBookmark(sentence)}><Bookmark size={15} fill={sentenceSaved ? 'currentColor' : 'none'} />{sentenceSaved ? '已收藏例句' : '收藏例句'}</button></>}<Link to={`/lesson/beginner/${lessonId}#words`}><BookOpen size={15} />第 {lessonId} 课</Link></div>
              </article>
            )
          })}
        </section>
      ) : (
        <section className="bookmarked-grid sentence-grid">
          {study.bookmarkedSentences.map((sentence) => <article className="bookmarked-card sentence-card" key={sentence.id}><div className="sentence-card-head"><span>{sentence.grammarExpression ? '语法例句' : '课文原句'}</span><button type="button" onClick={() => study.toggleSentenceBookmark(sentence)} aria-label="取消收藏例句"><Bookmark size={18} fill="currentColor" /></button></div>{sentence.grammarExpression && <strong className="sentence-grammar">{sentence.grammarExpression}</strong>}<p className="saved-sentence">{sentence.sentence}</p><cite>{sentence.level === 'intermediate' ? '中级' : '初级'}第 {sentence.lessonId} 课 · {sentence.section}</cite><div className="bookmarked-actions"><button type="button" onClick={() => playSentence(sentence)}><Volume2 size={15} />听例句</button><Link to={`/lesson/${sentence.level || 'beginner'}/${sentence.lessonId}#${sentence.grammarExpression ? 'grammar' : 'text'}`}><BookOpen size={15} />回到原课</Link></div></article>)}
        </section>
      )}
    </div>
  )
}
