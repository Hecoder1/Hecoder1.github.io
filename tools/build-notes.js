/**
 * 把 Markdown 笔记离线渲染成带侧边目录 + 代码高亮的静态阅读页。
 * 用法: node tools/build-notes.js <源文件.md> <输出.html> <文档标题> < tocKey >
 *
 * 同时会把目录结构写入 source/assets/js/kb-toc.js，
 * 供首页「个人知识库」板块自动生成章节链接。
 */
const fs = require('fs');
const path = require('path');

const markedLib = require('marked');
const marked = markedLib.marked || markedLib;
const hljs = require('highlight.js');

const ROOT = path.resolve(__dirname, '..');
const KB_TOC_FILE = path.join(ROOT, 'source', 'assets', 'js', 'kb-toc.js');

function slugify(text) {
  return String(text)
    .trim()
    .toLowerCase()
    .replace(/[`*_~\[\]()#.,!?:;'"]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fa5-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function renderFile({ src, out, title, subtitle, tocKey }) {
  const md = fs.readFileSync(src, 'utf8');
  const toc = [];

  const renderer = new marked.Renderer();
  renderer.heading = function (text, level) {
    const raw = String(text).replace(/<[^>]+>/g, '');
    const id = slugify(raw) || 'sec-' + toc.length;
    if (level <= 2) toc.push({ id, text: raw, level });
    return `<h${level} id="${id}">${text}</h${level}>\n`;
  };

  marked.setOptions({
    renderer,
    headerIds: false,
    mangle: false,
    gfm: true,
    breaks: false,
    highlight(code, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(code, { language: lang, ignoreIllegals: true }).value;
        } catch (e) { /* fall through */ }
      }
      try {
        return hljs.highlightAuto(code).value;
      } catch (e) {
        return code;
      }
    },
  });

  const bodyHtml = marked.parse(md);

  const tocHtml = toc
    .map((t) => `<a class="lv${t.level}" href="#${t.id}" data-toc="${t.id}">${t.text}</a>`)
    .join('\n        ');

  const firstLevel1 = toc.find((t) => t.level === 1);

  const html = `<!DOCTYPE html>
<html lang="zh-CN" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${title} — ${subtitle}">
  <title>${title} · Hecoder1</title>
  <script>
    (function () {
      var t = localStorage.getItem('theme');
      if (!t) { t = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light'; }
      document.documentElement.setAttribute('data-theme', t);
    })();
  </script>
  <link rel="stylesheet" href="../assets/css/style.css">
  <link rel="stylesheet" href="https://cdn.bootcdn.net/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
  <header class="docs-nav">
    <div class="container nav-container">
      <a href="../#knowledge" class="docs-back"><i class="fas fa-arrow-left"></i> 返回主页</a>
      <span class="docs-title">${title}</span>
      <div class="nav-controls">
        <button class="control-btn docs-toc-toggle" id="tocToggle" aria-label="目录"><i class="fas fa-bars"></i> 目录</button>
        <button class="control-btn theme-toggle" aria-label="切换主题">
          <i class="fas fa-sun sun-icon"></i>
          <i class="fas fa-moon moon-icon"></i>
        </button>
      </div>
    </div>
  </header>

  <div class="container docs-layout">
    <aside class="docs-sidebar" id="docsSidebar">
      <h4>目录</h4>
      <nav class="docs-toc">
        ${tocHtml}
      </nav>
    </aside>

    <main>
      <article class="prose">
${bodyHtml}
      </article>
      <div class="docs-footer-nav">
        <a href="../#knowledge"><i class="fas fa-arrow-left"></i> 返回个人知识库</a>
        <a href="#${firstLevel1 ? firstLevel1.id : 'top'}"><i class="fas fa-arrow-up"></i> 回到顶部</a>
      </div>
    </main>
  </div>

  <script src="../assets/js/theme.js"></script>
  <script src="../assets/js/docs.js"></script>
</body>
</html>
`;

  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html, 'utf8');

  // 首页知识库章节目录
  let kb = {};
  if (fs.existsSync(KB_TOC_FILE)) {
    const raw = fs.readFileSync(KB_TOC_FILE, 'utf8');
    const m = raw.match(/window\.KB_TOC\s*=\s*(\{[\s\S]*\});?/);
    if (m) kb = JSON.parse(m[1]);
  }
  kb[tocKey] = { url: '/' + path.relative(path.join(ROOT, 'source'), out).replace(/\\/g, '/'), toc };
  fs.mkdirSync(path.dirname(KB_TOC_FILE), { recursive: true });
  fs.writeFileSync(KB_TOC_FILE, 'window.KB_TOC = ' + JSON.stringify(kb, null, 2) + ';\n', 'utf8');

  console.log(`[ok] ${out}  (${toc.length} 个目录条目)`);
}

module.exports = { renderFile, slugify };

if (require.main === module) {
  const notes = [
    {
      src: path.join(ROOT, 'notes-src', 'java-basics.md'),
      out: path.join(ROOT, 'source', 'notes', 'java-basics.html'),
      title: 'Java 基础知识笔记',
      subtitle: '函数式编程 / Stream / 常用 API / 泛型 / 注解 / 反射',
      tocKey: 'java-basics',
    },
  ];
  for (const n of notes) {
    if (fs.existsSync(n.src)) renderFile(n);
    else console.warn('[skip] 缺少源文件: ' + n.src);
  }
}
