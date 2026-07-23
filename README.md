# 氷河日本語

面向中文初学者的现代日语学习应用，课程内容源自《标准日本语》学习笔记。

## 技术栈

- React 19
- TypeScript
- Vite
- React Router
- YAML / CSV 内容数据层
- LocalStorage 学习进度
- Web Speech API 日语朗读

## 本地运行

```bash
npm install
npm run dev
```

访问 `http://127.0.0.1:5173/`。

## 构建

```bash
npm run build
npm run preview
```

生产文件输出至 `dist/`。

## 产品结构

- 学习首页：今日任务、继续学习、初学路线
- 课程地图：48 课初级与 32 课中级
- 课程页面：课文、译文、语法、生词与语音朗读
- 学习进度：无需登录，自动保存在当前设备

原 Jekyll 模板与数据文件暂时保留，便于核对迁移内容；现代应用入口位于 `src/`。

## License

MIT
