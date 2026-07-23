import { marked } from 'marked'

marked.setOptions({ breaks: true, gfm: true })

export const japaneseMarkup = (source = '') =>
  source
    .replace(/!(.*?)\((.*?)\)/g, '<ruby>$1<rt>$2</rt></ruby>')
    .replace(/([\u3040-\u30ff]+)@\d{0,2}/g, '$1')

export const renderContent = (source = '') =>
  marked.parse(japaneseMarkup(source)) as string

export const plainJapanese = (source = '') =>
  source
    .replace(/!(.*?)\((.*?)\)/g, '$1')
    .replace(/@[\d]{0,2}/g, '')
    .replace(/[>*#\n]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
