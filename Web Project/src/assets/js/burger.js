(function () {
  var toggle = document.getElementById('nav-toggle');
  var nav    = document.getElementById('nav');
  if (!toggle || !nav) return;

  function open() {
    nav.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close navigation menu');
  }

  function close() {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation menu');
  }

  toggle.addEventListener('click', function () {
    nav.classList.contains('is-open') ? close() : open();
  });

  // Close when a nav link is clicked (handles same-page anchors)
  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', close);
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      close();
      toggle.focus();
    }
  });

  // Close on click outside nav and toggle
  document.addEventListener('click', function (e) {
    if (nav.classList.contains('is-open') &&
        !nav.contains(e.target) &&
        !toggle.contains(e.target)) {
      close();
    }
  });
})();
