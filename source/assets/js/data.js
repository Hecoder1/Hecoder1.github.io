/* =========================================================
   站点内容数据 —— 改这里就能改主页
   每个文案字段用 { zh, en } 双语言；数组类字段（tags / 技术名）不翻译
   ========================================================= */
window.SITE_DATA = {
  profile: {
    name: 'Hecoder1',
    terminal: 'hecoder1@home:~$',
    /* ↓↓↓ 主页介绍占位，待替换 ↓↓↓ */
    title: { zh: 'Hello, I\'m Hecoder1', en: 'Hello, I\'m Hecoder1' },
    desc: {
      zh: 'Java 后端开发学习者 · 大二在读 · 目前在学习后端知识和 AI 应用，后续会发布项目踩坑日记',
      en: 'Java backend learner · sophomore · currently exploring backend development and AI applications',
    },
    avatar: 'assets/images/avatar.jpg',
    contacts: [
      { icon: 'fab fa-github', text: 'GitHub', url: 'https://github.com/Hecoder1' },
      { icon: 'fas fa-envelope', text: 'Email', url: 'mailto:Hecoder1@users.noreply.github.com' },
    ],
  },

  /* ---------- 个人项目（待补充：往数组里加对象即可） ----------
     单条结构：
     {
       initial: '足安',                      // 左侧缩略图位置的文字（无图时显示）
       thumb: 'assets/images/xxx.jpg',       // 可选，有封面图时填
       title: { zh: '项目名', en: 'Project' },
       desc:  { zh: '中文简介', en: 'EN desc' },
       tags:  ['Spring Boot', 'Redis'],
       links: [{ zh: '源码', en: 'Source', url: 'https://...', icon: 'fab fa-github' }]
     }
  */
  projects: [],

  /* ---------- 开源贡献（待补充）
     单条结构：{ name, lang, color, desc: {zh,en}, url }
  */
  repos: [],

  /* ---------- 时间轴（待补充）
     单条结构：{ date: '2026.03', title: {zh,en}, desc: {zh,en}, tags: ['xxx'] }
  */
  timeline: [],

  /* ---------- 技术栈 ---------- */
  skills: [
    {
      cat: { zh: '后端 · Backend', en: 'Backend' },
      items: [
        { name: 'Java' }, { name: 'Spring Boot' }, { name: 'Spring MVC' }, { name: 'MyBatis' },
        { name: 'MySQL' }, { name: 'Redis' }, { name: 'Maven' }, { name: 'Nacos' },
      ],
    },
    {
      cat: { zh: '语言 · Languages', en: 'Languages' },
      items: [
        { name: 'Java', icon: 'fab fa-java' }, { name: 'Python', icon: 'fab fa-python' },
        { name: 'C' }, { name: 'SQL' },
      ],
    },
    {
      cat: { zh: '工具链 · Tooling', en: 'Tooling' },
      items: [
        { name: 'Git', icon: 'fab fa-git-alt' }, { name: 'GitHub Actions' },
        { name: 'Docker', icon: 'fab fa-docker' }, { name: 'Linux', icon: 'fab fa-linux' },
        { name: 'Node.js', icon: 'fab fa-node-js' }, { name: 'VS Code' },
      ],
    },
    {
      cat: { zh: 'AI 应用 · AI', en: 'AI' },
      items: [
        { name: 'LLM 应用开发' }, { name: 'Prompt 工程' }, { name: '计算机视觉' }, { name: 'Agent 方向' },
      ],
    },
  ],

  /* ---------- 个人知识库 ---------- */
  knowledge: [
    {
      key: 'java-basics',
      icon: 'fab fa-java',
      title: { zh: 'Java 基础知识笔记', en: 'Java Fundamentals Notes' },
      desc: {
        zh: '函数式编程与 Stream、常用 API、Arrays、泛型、注解、Class 与类加载、反射——课程与刷题期间的完整手写笔记。',
        en: 'Functional programming, Stream, generics, annotations, reflection — full handwritten notes.',
      },
      meta: '~2200 行 · 7 章',
    },
  ],
};

/* ---------- 界面文案 ---------- */
window.UI_TEXT = {
  zh: {
    nav: { projects: '个人项目', repos: '开源贡献', timeline: '时间轴', skills: '技术栈', knowledge: '个人知识库' },
    blog: '博客',
    sections: {
      projects: { title: '个人项目', sub: '自己牵头或深度参与的项目' },
      repos: { title: '开源贡献', sub: '公开在 GitHub 上的仓库与学习记录' },
      timeline: { title: '时间轴', sub: '从入学到现在的关键节点' },
      skills: { title: '技术栈', sub: '日常在用的工具与语言' },
      knowledge: { title: '个人知识库', sub: '整理成体系的学习笔记' },
    },
    actions: { open: '查看', github: 'GitHub 主页', chapters: '章' },
    empty: { zh: '内容整理中，稍后补充', en: 'Coming soon' },
    footer: '© 2026 Hecoder1 · 个人主页',
  },
  en: {
    nav: { projects: 'Projects', repos: 'Open Source', timeline: 'Timeline', skills: 'Stack', knowledge: 'Knowledge' },
    blog: 'Blog',
    sections: {
      projects: { title: 'My Projects', sub: 'Projects I led or deeply worked on' },
      repos: { title: 'Open Source', sub: 'Public repositories and study records' },
      timeline: { title: 'Timeline', sub: 'Key milestones so far' },
      skills: { title: 'Tech Stack', sub: 'Languages and tools I use daily' },
      knowledge: { title: 'Knowledge Base', sub: 'Structured study notes' },
    },
    actions: { open: 'Open', github: 'GitHub Profile', chapters: 'chapters' },
    empty: { zh: '内容整理中，稍后补充', en: 'Coming soon' },
    footer: '© 2026 Hecoder1 · Homepage',
  },
};
