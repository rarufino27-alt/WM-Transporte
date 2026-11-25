/* WM TRANSPORTE — alternância de tema
   Primeiro acesso: modo escuro. A preferência escolhida é salva localmente.
*/
(function () {
  'use strict';

  var root = document.documentElement;
  var button = document.getElementById('themeToggle');
  var metaTheme = document.querySelector('meta[name="theme-color"]');

  if (!button) return;

  var savedTheme = null;
  try {
    savedTheme = localStorage.getItem('wm-theme');
  } catch (error) {
    // Se o armazenamento estiver indisponível, o site continua usando o modo escuro.
  }

  var initialTheme = savedTheme === 'light' ? 'light' : 'dark';

  function applyTheme(theme) {
    var isLight = theme === 'light';
    root.setAttribute('data-theme', isLight ? 'light' : 'dark');
    button.setAttribute('aria-label', isLight ? 'Ativar modo escuro' : 'Ativar modo claro');
    button.setAttribute('title', isLight ? 'Ativar modo escuro' : 'Ativar modo claro');
    button.innerHTML = isLight
      ? '<i class="fa-solid fa-moon" aria-hidden="true"></i><span class="theme-toggle-label">Modo escuro</span>'
      : '<i class="fa-solid fa-sun" aria-hidden="true"></i><span class="theme-toggle-label">Modo claro</span>';

    if (metaTheme) {
      metaTheme.setAttribute('content', isLight ? '#173858' : '#090C12');
    }
  }

  applyTheme(initialTheme);

  button.addEventListener('click', function () {
    var nextTheme = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(nextTheme);
    try {
      localStorage.setItem('wm-theme', nextTheme);
    } catch (error) {
      // A alternância continua funcionando mesmo sem persistência.
    }
  });
}());
