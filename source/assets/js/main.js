/* =========================================================
   主页渲染 + 中英切换 + 滚动动效 + 导航高亮
   ========================================================= */
(function () {
  var D = window.SITE_DATA || {};
  var LANG_KEY = 'lang';

  function getLang() {
    try {
      var saved = localStorage.getItem(LANG_KEY);
      if (saved === 'zh' || saved === 'en') return saved;
    } catch (e) { /* ignore */ }
    return 'zh';
  }

  var lang = getLang();

  function t(v) {
    if (v == null) return '';
    if (typeof v === 'string') return v;
    return v[lang] != null ? v[lang] : v.zh;
  }
  function ui(path) {
    var dict = (window.UI_TEXT || {})[lang] || {};
    var v = path.split('.').reduce(function (o, k) { return o && o[k] != null ? o[k] : ''; }, dict);
    if (v && typeof v === 'object') v = v[lang] != null ? v[lang] : v.zh;
    return typeof v === 'string' ? v : '';
  }
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- 导航 ---------- */
  function renderNav() {
    var wrap = document.getElementById('navLinks');
    if (!wrap) return;
    var order = ['projects', 'repos', 'timeline', 'skills', 'knowledge'];
    wrap.innerHTML = '';
    order.forEach(function (k) {
      var a = el('a', null, esc(ui('nav.' + k)));
      a.href = '#' + k;
      a.setAttribute('data-nav', k);
      wrap.appendChild(a);
    });
  }

  /* ---------- Intro ---------- */
  function renderIntro() {
    var p = D.profile || {};
    var ttl = document.getElementById('introTitle');
    var sub = document.getElementById('introSubtitle');
    if (ttl) ttl.textContent = t(p.title);
    if (sub) sub.textContent = t(p.desc);

    var links = document.getElementById('introLinks');
    if (links && p.contacts) {
      links.innerHTML = '';
      p.contacts.forEach(function (c) {
        var a = el('a', 'intro-contact-link', '<i class="' + c.icon + '"></i><span>' + esc(c.text) + '</span>');
        a.href = c.url;
        if (/^https?:/.test(c.url)) { a.target = '_blank'; a.rel = 'noopener'; }
        links.appendChild(a);
      });
    }
  }

  /* ---------- 区块标题 ---------- */
  function renderSectionHeads() {
    ['projects', 'repos', 'timeline', 'skills', 'knowledge'].forEach(function (k) {
      var h = document.querySelector('[data-head="' + k + '"]');
      if (!h) return;
      h.textContent = ui('sections.' + k + '.title');
      var s = document.querySelector('[data-sub="' + k + '"]');
      if (s) s.textContent = ui('sections.' + k + '.sub');
    });
  }

  function emptyState(icon) {
    return '<div class="empty-state"><i class="' + icon + '"></i><p>' + esc(ui('empty')) + '</p></div>';
  }

  /* ---------- 个人项目 ---------- */
  function renderProjects() {
    var wrap = document.getElementById('projectsGrid');
    if (!wrap) return;
    if (!D.projects || !D.projects.length) {
      wrap.innerHTML = emptyState('fas fa-folder-open');
      wrap.classList.add('is-empty');
      return;
    }
    wrap.classList.remove('is-empty');
    wrap.innerHTML = '';
    D.projects.forEach(function (p, i) {
      var card = el('div', 'card project-card reveal');
      card.style.setProperty('--reveal-delay', i * 70 + 'ms');

      var thumb = el('div', 'project-thumbnail-wrapper',
        '<span class="project-thumb-initial">' + esc(p.initial) + '</span>');
      if (p.thumb) {
        var img = el('img', 'project-thumb');
        img.src = p.thumb;
        img.alt = t(p.title);
        thumb.appendChild(img);
      }

      var tags = (p.tags || []).map(function (x) { return '<span class="project-tag">' + esc(x) + '</span>'; }).join('');
      var actions = (p.links || []).map(function (l) {
        var a = el('a', 'project-action', '<i class="' + l.icon + '"></i>' + esc(t(l)));
        a.href = l.url;
        if (/^https?:/.test(l.url)) { a.target = '_blank'; a.rel = 'noopener'; }
        return a.outerHTML;
      }).join('');
      if (!actions) actions = '<span class="project-tag">进行中</span>';

      var info = el('div', 'project-info',
        '<h3>' + esc(t(p.title)) + '</h3>' +
        '<p>' + esc(t(p.desc)) + '</p>' +
        '<div class="project-tags">' + tags + '</div>' +
        '<div class="project-actions">' + actions + '</div>');

      card.appendChild(thumb);
      card.appendChild(info);
      wrap.appendChild(card);
    });
  }

  /* ---------- 开源贡献 ---------- */
  function renderRepos() {
    var wrap = document.getElementById('reposGrid');
    if (!wrap) return;
    if (!D.repos || !D.repos.length) {
      wrap.innerHTML = emptyState('fab fa-github');
      wrap.classList.add('is-empty');
      return;
    }
    wrap.classList.remove('is-empty');
    wrap.innerHTML = '';
    D.repos.forEach(function (r, i) {
      var card = el('a', 'card repo-card reveal');
      card.href = r.url;
      card.target = '_blank';
      card.rel = 'noopener';
      card.style.setProperty('--reveal-delay', i * 60 + 'ms');
      card.innerHTML =
        '<div class="repo-name"><i class="fab fa-github"></i>' + esc(r.name) + '</div>' +
        '<div class="repo-desc">' + esc(t(r.desc)) + '</div>' +
        '<div class="repo-meta"><span><i class="repo-dot" style="background:' + r.color + '"></i>' + esc(r.lang) + '</span></div>';
      wrap.appendChild(card);
    });

    var more = document.getElementById('reposMore');
    if (more) more.innerHTML = '<i class="fab fa-github"></i>' + esc(ui('actions.github'));
  }

  /* ---------- 时间轴 ---------- */
  function renderTimeline() {
    var wrap = document.getElementById('timelineList');
    if (!wrap) return;
    if (!D.timeline || !D.timeline.length) {
      wrap.innerHTML = emptyState('fas fa-clock');
      wrap.classList.add('is-empty');
      return;
    }
    wrap.classList.remove('is-empty');
    wrap.innerHTML = '';
    D.timeline.forEach(function (it, i) {
      var tags = (it.tags || []).map(function (x) { return '<span class="project-tag">' + esc(x) + '</span>'; }).join('');
      var item = el('div', 'timeline-item reveal');
      item.style.setProperty('--reveal-delay', i * 60 + 'ms');
      item.innerHTML =
        '<span class="timeline-dot"></span>' +
        '<span class="timeline-date">' + esc(it.date) + '</span>' +
        '<div class="timeline-content">' +
        '<h3>' + esc(t(it.title)) + '</h3>' +
        '<p>' + esc(t(it.desc)) + '</p>' +
        (tags ? '<div class="timeline-tags">' + tags + '</div>' : '') +
        '</div>';
      wrap.appendChild(item);
    });
  }

  /* ---------- 技术栈 ---------- */
  function renderSkills() {
    var wrap = document.getElementById('skillsGrid');
    if (!wrap || !D.skills) return;
    wrap.innerHTML = '';
    D.skills.forEach(function (g, i) {
      var box = el('div', 'skill-category reveal');
      box.style.setProperty('--reveal-delay', i * 60 + 'ms');
      var items = (g.items || []).map(function (s) {
        return '<span class="skill-badge">' + (s.icon ? '<i class="' + s.icon + '"></i>' : '') + esc(s.name) + '</span>';
      }).join('');
      box.innerHTML = '<h3>' + esc(t(g.cat)) + '</h3><div class="skill-list">' + items + '</div>';
      wrap.appendChild(box);
    });
  }

  /* ---------- 个人知识库 ---------- */
  function renderKnowledge() {
    var wrap = document.getElementById('knowledgeGrid');
    if (!wrap || !D.knowledge) return;
    var tocMap = window.KB_TOC || {};
    wrap.innerHTML = '';
    D.knowledge.forEach(function (k, i) {
      var meta = tocMap[k.key];
      var url = meta ? meta.url : '#';
      var chapters = '';
      if (meta && meta.toc) {
        var tops = meta.toc.filter(function (x) { return x.level === 1; });
        var subs = meta.toc.filter(function (x) { return x.level === 2; });
        var list = (tops.length ? tops : subs).slice(0, 7);
        chapters = list.map(function (c) {
          return '<a class="kb-chapter" href="' + url + '#' + c.id + '"><i class="fas fa-caret-right"></i>' + esc(c.text) + '</a>';
        }).join('');
      }

      var card = el('div', 'card kb-card reveal');
      card.style.setProperty('--reveal-delay', i * 70 + 'ms');
      card.innerHTML =
        '<div class="kb-icon"><i class="' + k.icon + '"></i></div>' +
        '<h3>' + esc(t(k.title)) + '</h3>' +
        '<p style="font-size:.92rem;color:var(--text-muted);margin-bottom:14px">' + esc(t(k.desc)) + '</p>' +
        '<div class="kb-chapters">' + chapters + '</div>' +
        '<div class="kb-foot">' +
        '<span class="kb-meta">' + esc(k.meta || '') + '</span>' +
        '<a class="project-action" href="' + url + '"><i class="fas fa-book-open"></i>' + esc(ui('actions.open')) + '</a>' +
        '</div>';
      wrap.appendChild(card);
    });
  }

  /* ---------- 语言切换 ---------- */
  function applyLang(next) {
    lang = next;
    try { localStorage.setItem(LANG_KEY, next); } catch (e) { /* ignore */ }
    document.documentElement.setAttribute('lang', next === 'zh' ? 'zh-CN' : 'en');
    var btn = document.getElementById('langToggle');
    if (btn) btn.textContent = next === 'zh' ? 'English' : '中文';
    renderAll();
    initReveal();
  }

  function renderAll() {
    renderNav();
    renderIntro();
    renderSectionHeads();
    renderProjects();
    renderRepos();
    renderTimeline();
    renderSkills();
    renderKnowledge();
  }

  /* ---------- 滚动淡入 ---------- */
  var observer = null;
  function initReveal() {
    var items = document.querySelectorAll('.reveal:not(.is-visible)');
    if (!('IntersectionObserver' in window)) {
      for (var j = 0; j < items.length; j++) items[j].classList.add('is-visible');
      return;
    }
    if (observer) observer.disconnect();
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    items.forEach(function (n) { observer.observe(n); });
  }

  /* ---------- 导航高亮 ---------- */
  function initScrollSpy() {
    var ids = ['projects', 'repos', 'timeline', 'skills', 'knowledge'];
    var sections = ids.map(function (id) { return document.getElementById(id); }).filter(Boolean);
    if (!sections.length || !('IntersectionObserver' in window)) return;
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.id;
        document.querySelectorAll('#navLinks a').forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('data-nav') === id);
        });
      });
    }, { rootMargin: '-88px 0px -60% 0px', threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- 头像兜底 ---------- */
  function initAvatar() {
    var box = document.getElementById('avatarBox');
    var img = document.getElementById('avatarImg');
    var p = D.profile || {};
    if (!box || !img) return;
    if (!p.avatar) { box.classList.add('no-photo'); return; }
    img.src = p.avatar;
    img.alt = p.name || '';
    var fallback = document.getElementById('avatarFallback');
    if (fallback) fallback.textContent = (p.name || '?').charAt(0).toUpperCase();
    img.addEventListener('error', function () { box.classList.add('no-photo'); });
    img.addEventListener('load', function () {
      if (img.naturalWidth > 0) box.classList.remove('no-photo');
    });
  }

  /* ---------- 启动 ---------- */
  function boot() {
    var btn = document.getElementById('langToggle');
    if (btn) btn.addEventListener('click', function () { applyLang(lang === 'zh' ? 'en' : 'zh'); });
    initAvatar();
    applyLang(lang);
    initScrollSpy();
  }

  if (document.readyState !== 'loading') boot();
  else document.addEventListener('DOMContentLoaded', boot);
})();
