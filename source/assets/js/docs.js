/* 文档阅读页：目录高亮 + 移动端目录展开 */
(function () {
  var links = Array.prototype.slice.call(document.querySelectorAll('.docs-toc a'));
  var headings = links
    .map(function (a) { return document.getElementById(a.getAttribute('data-toc')); })
    .filter(Boolean);

  var sidebar = document.getElementById('docsSidebar');
  var toggle = document.getElementById('tocToggle');
  if (toggle && sidebar) {
    toggle.addEventListener('click', function () { sidebar.classList.toggle('open'); });
  }
  links.forEach(function (a) {
    a.addEventListener('click', function () {
      if (sidebar && window.matchMedia('(max-width: 900px)').matches) sidebar.classList.remove('open');
    });
  });

  if (!headings.length || !('IntersectionObserver' in window)) return;

  var visible = {};
  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        visible[entry.target.id] = entry.isIntersecting;
      });
      var activeId = null;
      for (var i = 0; i < headings.length; i++) {
        if (visible[headings[i].id]) { activeId = headings[i].id; break; }
      }
      if (!activeId) return;
      links.forEach(function (a) {
        a.classList.toggle('active', a.getAttribute('data-toc') === activeId);
      });
    },
    { rootMargin: '-88px 0px -70% 0px', threshold: 0 }
  );

  headings.forEach(function (h) { observer.observe(h); });
})();
