# 冰河日本语

面向中文初学者的现代日语学习 Web 应用，课程内容源自《标准日本语》学习笔记。

## 技术栈

- React 19 + TypeScript
- Vite
- React Router
- YAML / CSV 内容数据层
- PWA 离线壳与按需媒体缓存
- LocalStorage 学习进度

## 本地运行

```bash
npm install
npm run dev
```

访问 `http://127.0.0.1:5173/`。

## 生产构建与网页分发

```bash
npm run build
npm run preview
```

生产文件输出到 `dist/`，可直接部署到 Cloudflare Pages、Netlify、Vercel 或普通静态服务器。

- 构建已生成 PWA manifest 和 Service Worker。
- `_redirects` 会随构建复制到 `dist/`，解决静态托管时直接刷新课程 URL 的问题。
- 音频不进入首次离线包，播放后按需缓存，避免首屏下载完整音频库。
- 课文插图使用 WebP、懒加载和异步解码。
- 若部署平台不支持 `_redirects`，需把所有未知路由重写到 `/index.html`。

当前音频库较大。正式上线时建议把 `dist/assets/audio/` 放在对象存储或 CDN，并保持 `/assets/audio/...` 的访问路径不变。

## Anki

有生词的课程页提供两种复习方式：

1. “闪卡复习”在网页内直接学习。
2. “导出 Anki”生成 UTF-8、Tab 分隔的 `.txt` 文件。

在 Anki 桌面版中选择“文件 → 导入”，选中导出的文件即可。文件已包含牌组名、标签、正面和背面 HTML。采用文本导入而不是直接生成 `.apkg`，因此纯静态网页也可使用，不需要服务器或 AnkiConnect 权限。

## 课文插图

第 10 课已加入原创京都秋日场景图作为样板。新增图片时：

1. 将优化后的 WebP 放入 `assets/lesson-images/`。
2. 在 `src/lessonMedia.ts` 中登记课程、替代文本和图注。

不建议每课重复使用同一张装饰图；图片应帮助初学者理解场景、地点或对话语境。

## 产品结构

- 学习首页：今日任务、继续学习、初学路线
- 课程地图：48 课初级与 32 课中级
- 课程页面：课文、译文、整句读音、语法、生词、真人录音
- 闪卡学习：网页内复习与 Anki 导出
- 学习进度：无需登录，自动保存在当前设备

原 Jekyll 模板与数据文件暂时保留，便于核对迁移内容；现代应用入口位于 `src/`。

## License

MIT
