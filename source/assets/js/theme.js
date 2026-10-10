/* 明暗主题切换：localStorage 记忆，无记录时跟随系统偏好 */
(function () {
  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (e) { /* 隐私模式忽略 */ }
  }

  function current() {
    return document.documentElement.getAttribute('data-theme') || 'light';
  }

  function init() {
    if (!localStorage.getItem('theme')) {
      var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
    var btns = document.querySelectorAll('.theme-toggle');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function () {
        apply(current() === 'dark' ? 'light' : 'dark');
      });
    }
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
