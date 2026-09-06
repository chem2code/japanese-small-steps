import { allGrammar } from './lessonDetails'
import type { Grammar } from './lessonDetails'
import { beginnerLessons, intermediateLessons } from './data'

export interface GrammarNote {
  title: string
  level: 'N5' | 'N4' | 'N3' | 'N2'
  topic: string
  meaning: string
  connection: string[]
  tip: string
  contrast: string
  related: string[]
  example: string
  translation: string
  question: string
  choices: string[]
  answer: string
  reason: string
}

// Original learning notes and practice sentences, not official JLPT questions.
export const grammarNotes: Record<string, GrammarNote> = {
  '588': { title: '～わけだ', level: 'N3', topic: '条件与逻辑', meaning: '原来如此；怪不得……。根据已知事实得出合理的结论。', connection: ['动词／い形容词普通形 ＋ わけだ', 'な形容词词干 ＋ な ＋ わけだ', '名词 ＋ な／である ＋ わけだ'], tip: '重点是“由前面的事实，可以理解为什么会这样”。阅读时要找推理依据。', contrast: '「わけだ」表示自然得出的结论；「はずだ」表示根据依据作出的预期，两者有时可互换但侧重点不同。', related: ['158', '595'], example: '田中さんは十年も日本に住んでいたんですね。日本語が上手なわけです。', translation: '原来田中先生在日本住了十年啊，难怪日语这么好。', question: '十年も日本に住んでいたんですね。日本語が上手（　）わけです。', choices: ['だ', 'な', 'に'], answer: 'な', reason: '「上手」是な形容词，修饰「わけ」时用「上手な」。' },
  '595': { title: '～をはじめ', level: 'N2', topic: '列举与依据', meaning: '以……为代表；……以及其他。列举最有代表性的一项。', connection: ['名词 ＋ をはじめ（として）', '名词 ＋ をはじめとする ＋ 名词'], tip: '前面列举代表，后面通常说同类的整体。不是单纯“开始做”的意思。', contrast: '「など」举例即可；「をはじめ」突出其中有代表性的一项。', related: ['598'], example: '東京をはじめ、多くの都市を訪れました。', translation: '走访了东京等许多城市。', question: '東京（　）、多くの都市を訪れました。', choices: ['をはじめ', 'をもって', 'に限って'], answer: 'をはじめ', reason: '东京是许多城市中的代表，因此用「をはじめ」。' },
  '597': { title: '～をもって', level: 'N2', topic: '时间与顺序', meaning: '以……为界；于……结束或开始。常用于正式通知。', connection: ['时间名词 ＋ をもって', '更郑重：时间名词 ＋ をもちまして'], tip: '适合说明截止、结束等界限。“以某种手段”也是它的用法，需结合上下文。', contrast: '普通叙述用「で」较自然；「をもって」语气更正式。', related: ['107', '1'], example: '本日をもって、受付を終了いたします。', translation: '报名受理于今日结束。', question: '本日（　）、受付を終了いたします。', choices: ['をはじめ', 'をもって', 'をもとに'], answer: 'をもって', reason: '这里把今天作为受理结束的时间界限，用「をもって」。' },
  '598': { title: '～をもとに', level: 'N2', topic: '列举与依据', meaning: '以……为基础或素材。利用已有资料进行创作、判断等。', connection: ['名词 ＋ をもとに（して）', '名词 ＋ をもとにした ＋ 名词'], tip: '前面的名词常是经验、资料、真实事件等。', contrast: '「をもとに」强调基础、素材；「によって」常表示手段、原因或因情况而异。', related: ['595'], example: 'この映画は実際の出来事をもとに作られました。', translation: '这部电影根据真实事件改编而成。', question: 'この映画は実際の出来事（　）作られました。', choices: ['をもって', 'をもとに', 'をはじめ'], answer: 'をもとに', reason: '真实事件是创作素材，使用「をもとに」。' },
  '92': { title: 'A は B です', level: 'N5', topic: '基础句型', meaning: 'A 是 B。用来介绍身份或说明事物。', connection: ['名词 A ＋ は ＋ 名词 B ＋ です'], tip: '助词「は」读作 wa；「です」使表达更礼貌。', contrast: '肯定用「です」；否定用「ではありません」。', related: ['97', '96'], example: '田中さんは大学の先生です。', translation: '田中先生是大学老师。', question: '田中さん（　）大学の先生です。', choices: ['を', 'は', 'に'], answer: 'は', reason: '这里介绍田中先生的身份，用「は」提示话题。' },
  '97': { title: '～ではありません', level: 'N5', topic: '基础句型', meaning: '不是……。名词句的礼貌否定。', connection: ['名词 ＋ ではありません', '口语：名词 ＋ じゃありません'], tip: '名词后不能直接接「ないです」。', contrast: '「学生ではありません」是否定身份；「寒くないです」是否定い形容词。', related: ['92', '100'], example: 'わたしは学生ではありません。', translation: '我不是学生。', question: 'わたしは学生（　）。', choices: ['くないです', 'ではありません', 'ません'], answer: 'ではありません', reason: '「学生」是名词，否定要接「ではありません」。' },
  '3': { title: '～に～があります／います', level: 'N5', topic: '助词与存在', meaning: '某个地方有某物或某人。', connection: ['场所 ＋ に ＋ 物 ＋ が ＋ あります', '场所 ＋ に ＋ 人／动物 ＋ が ＋ います'], tip: '人、猫等有生命且能活动的对象通常用「います」。植物用「あります」。', contrast: '「に」标存在地点；「で」标动作发生的地点。', related: ['4', '120'], example: '教室に学生がいます。', translation: '教室里有学生。', question: '教室に学生が（　）。', choices: ['あります', 'います', 'です'], answer: 'います', reason: '「学生」是人，存在动词用「います」。' },
  '120': { title: '～を～ます', level: 'N5', topic: '助词与存在', meaning: '用「を」标出动作作用的对象。', connection: ['对象名词 ＋ を ＋ 动词'], tip: '这里的「を」读作 o。例如吃饭、读书，都有明确的动作对象。', contrast: '「本を読みます」的本是对象；「図書館で読みます」的图书馆是动作地点。', related: ['3', '72'], example: '毎朝、新聞を読みます。', translation: '每天早上读报纸。', question: '毎朝、新聞（　）読みます。', choices: ['に', 'が', 'を'], answer: 'を', reason: '报纸是「读」的对象，因此用「を」。' },
  '100': { title: 'い形容词 → ～くないです', level: 'N5', topic: '词形变化', meaning: '不……。否定一种性质或状态。', connection: ['い形容词去掉末尾い ＋ くないです', 'いい → よくないです'], tip: '「きれい」虽然以い结尾，却是な形容词：きれいではありません。', contrast: '寒い → 寒くない；静か → 静かではありません。', related: ['97', '106'], example: '今日は寒くないです。', translation: '今天不冷。', question: '今日は（　）。', choices: ['寒いないです', '寒くないです', '寒いではありません'], answer: '寒くないです', reason: 'い形容词否定：去い再加「くないです」。' },
  '106': { title: 'A は B ほど～ない', level: 'N5', topic: '比较与程度', meaning: 'A 没有 B 那么……。B 是比较的标准。', connection: ['A は B ほど ＋ い形容词去い ＋ くないです', 'A は B ほど ＋ な形容词词干 ＋ ではありません'], tip: '这个比较句型的谓语要用否定形式。先找出谁没有谁那么……，再选助词。', contrast: '「A は B より高い」：A 更高；「A は B ほど高くない」：A 没有 B 高。', related: ['117', '118', '100'], example: 'この町は東京ほどにぎやかではありません。', translation: '这个城镇没有东京那么热闹。', question: 'この町は東京（　）にぎやかではありません。', choices: ['ほど', 'まで', 'だけ'], answer: 'ほど', reason: '表达“没有东京那么热闹”，使用「ほど＋否定」。' },
  '117': { title: 'A は B より～です', level: 'N5', topic: '比较与程度', meaning: 'A 比 B 更……。描述 A 的程度较高。', connection: ['A は B より ＋ 形容词 ＋ です'], tip: '「より」前面的 B 是比较基准。', contrast: '「A より B のほうが～」则强调 B 更……，不要把方向记反。', related: ['106', '118'], example: 'この本はあの本より安いです。', translation: '这本书比那本书便宜。', question: '这本书比那本便宜：この本はあの本（　）安いです。', choices: ['より', 'ほど', 'まで'], answer: 'より', reason: '“比……更……”用「より」标出比较基准。' },
  '69': { title: '～なくてもいいです', level: 'N5', topic: '请求与义务', meaning: '不必……；不做也可以。表示没有义务。', connection: ['动词ない形：ない → なくてもいいです'], tip: '表示“可以不做”，不是禁止做。', contrast: '「なければなりません」是必须做；「なくてもいいです」是不必做。', related: ['70', '68'], example: '明日は来なくてもいいです。', translation: '明天不来也可以。', question: '明天不来也可以：明日は（　）いいです。', choices: ['来ないで', '来なくても', '来なければ'], answer: '来なくても', reason: '来ない → 来なくてもいい，表示不必来。' },
  '70': { title: '～なければなりません', level: 'N5', topic: '请求与义务', meaning: '必须……；不得不……。表示必要或义务。', connection: ['动词ない形：ない → なければなりません'], tip: '整体表示肯定的义务。不要看到「ません」就理解成“不做”。', contrast: '「なくてもいい」允许不做；「ないでください」请求对方不要做。', related: ['69', '68'], example: '明日、早く起きなければなりません。', translation: '明天必须早起。', question: '明日、早く起きなければ（　）。', choices: ['いいです', 'なりません', 'ください'], answer: 'なりません', reason: '「なければなりません」是表示“必须”的固定组合。' },
  '107': { title: '～前に', level: 'N5', topic: '时间与顺序', meaning: '在……之前。', connection: ['动词辞书形 ＋ 前に', '名词 ＋ の ＋ 前に'], tip: '即使整句话说的是过去的事，「前に」前面的动词仍用辞书形。', contrast: '「前に」前用辞书形；「後で」前用た形。', related: ['1'], example: '寝る前に、歯を磨きます。', translation: '睡觉前刷牙。', question: '（　）前に、歯を磨きます。', choices: ['寝た', '寝る', '寝て'], answer: '寝る', reason: '「前に」前面接动词辞书形，所以是「寝る」。' },
  '1': { title: '～た後で', level: 'N5', topic: '时间与顺序', meaning: '做完……之后，再……。', connection: ['动词た形 ＋ 後で', '名词 ＋ の ＋ 後で'], tip: '先做的动作放在「後で」前面。', contrast: '「食べる前に」是吃之前；「食べた後で」是吃之后。', related: ['107'], example: 'ご飯を食べた後で、勉強します。', translation: '吃完饭后学习。', question: 'ご飯を（　）後で、勉強します。', choices: ['食べる', '食べて', '食べた'], answer: '食べた', reason: '「後で」前接た形，表达先完成的动作。' },
  '151': { title: '～ことにします', level: 'N4', topic: '意志与决定', meaning: '决定……。强调自己作出的决定。', connection: ['动词辞书形／ない形 ＋ ことにします'], tip: '决定不做时，把前面的动词改成ない形。', contrast: '「ことになります」侧重客观安排、规则或外部决定。', related: ['152', '168'], example: '毎日、日本語を勉強することにしました。', translation: '我决定每天学习日语。', question: '自分で決めました。毎日勉強すること（　）しました。', choices: ['を', 'に', 'が'], answer: 'に', reason: '自己作出的决定，用「ことにしました」。' },
  '152': { title: '～ことになりました', level: 'N4', topic: '意志与决定', meaning: '定下来要……。侧重安排或决定的结果。', connection: ['动词辞书形／ない形 ＋ ことになりました'], tip: '也可用于淡化个人意志，委婉地告诉别人自己的决定。', contrast: '自己主动决定用「ことにする」；转述安排常用「ことになる」。', related: ['151'], example: '来月、大阪へ出張することになりました。', translation: '定下来下个月去大阪出差。', question: '会社の決定で、大阪へ出張することに（　）。', choices: ['しました', 'なりました', 'ありました'], answer: 'なりました', reason: '这里说明公司的安排，使用「ことになりました」。' },
  '158': { title: '～そうです〈传闻〉', level: 'N4', topic: '推测与传闻', meaning: '听说……。转述听到或读到的信息。', connection: ['普通形 ＋ そうです', '名词／な形容词：保留だ ＋ そうです'], tip: '信息有来源，如朋友说、天气预报说。', contrast: '「雨が降るそうです」听说会下雨；「雨が降りそうです」看起来快下雨。', related: ['159', '149'], example: '天気予報によると、明日は雨が降るそうです。', translation: '据天气预报说，明天会下雨。', question: '天気予報によると、明日は雨が（　）そうです。', choices: ['降り', '降る', '降って'], answer: '降る', reason: '转述预报是传闻，动词普通形「降る」接「そうです」。' },
  '159': { title: '～そうです〈样态〉', level: 'N4', topic: '推测与传闻', meaning: '看起来……；眼看要……。根据眼前的情况推测。', connection: ['动词ます形去ます ＋ そうです', 'い形容词去い／な形容词词干 ＋ そうです', '特殊：いい → よさそう；ない → なさそう'], tip: '根据外观作判断；传闻则是转述消息。', contrast: '「おいしそう」看起来好吃；「おいしいそう」听说好吃。', related: ['158'], example: 'このケーキはおいしそうです。', translation: '这个蛋糕看起来很好吃。', question: '看着蛋糕说：このケーキは（　）そうです。', choices: ['おいしい', 'おいしく', 'おいし'], answer: 'おいし', reason: '样态接续：い形容词去い，再加「そうです」。' },
  '156': { title: '～しか～ない', level: 'N4', topic: '比较与程度', meaning: '只有……。常带有觉得少、不够的语气。', connection: ['名词／数量 ＋ しか ＋ 否定谓语'], tip: '「しか」后面一定与否定形式搭配。', contrast: '「だけ」可用于肯定句，较客观地限定范围；「しか～ない」常强调少。', related: ['160'], example: '財布に千円しかありません。', translation: '钱包里只有一千日元。', question: '財布に千円しか（　）。', choices: ['あります', 'ありません', 'です'], answer: 'ありません', reason: '「しか」必须与否定搭配，整体意思是“只有”。' },
}

export const grammarTitle = (g: Grammar) => grammarNotes[g.idx]?.title || g.expression
export const grammarMeaning = (g: Grammar) => grammarNotes[g.idx]?.meaning || g.shortexplain || g.explanation.replace(/\\n/g, '\n') || '结合本课上下文理解这一表达。'
export const grammarTopic = (g: Grammar) => grammarNotes[g.idx]?.topic || (/形|活用/.test(g.expression) ? '词形变化' : /条件|たら|ば，|なら|と，/.test(g.expression) ? '条件与逻辑' : '其他表达')
export const grammarLessonKeys = (g: Grammar) => g.lesson.split('|').map((key) => key.startsWith('m') ? `m${String(Number(key.slice(1))).padStart(2, '0')}` : key)
export const grammarLesson = (g: Grammar, preferred?: string) => {
  const key = preferred && grammarLessonKeys(g).includes(preferred) ? preferred : grammarLessonKeys(g)[0]
  return (key.startsWith('m') ? intermediateLessons : beginnerLessons).find((l) => l.id === Number(key.replace(/^m/, '')))
}
export const grammarLessonLabel = (g: Grammar) => `${g.lesson.startsWith('m') ? '中级' : '初级'} · 第 ${grammarLessonKeys(g).map((key) => Number(key.replace(/^m/, ''))).join(' / ')} 课`
export const grammarCatalog = [...allGrammar].filter((g) => grammarLesson(g)).sort((a, b) => Number(a.lesson.startsWith('m')) - Number(b.lesson.startsWith('m')) || grammarLesson(a)!.id - grammarLesson(b)!.id || Number(a.idx) - Number(b.idx))
export const grammarTopics = Array.from(new Set(grammarCatalog.map(grammarTopic)))
