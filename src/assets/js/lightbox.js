(function () {
  const lb      = document.getElementById('lightbox');
  const lbImg   = document.getElementById('lightbox-img');
  const lbCap   = document.getElementById('lightbox-caption');
  const lbClose = document.getElementById('lightbox-close');

  if (!lb) return;

  function open(src, alt, caption) {
    lbImg.src = src;
    lbImg.alt = alt;
    lbCap.textContent = caption || alt;
    lb.classList.add('open');
    // One frame delay so the browser paints display:flex before transitioning opacity
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        lb.classList.add('visible');
      });
    });
    document.body.style.overflow = 'hidden';
  }

  function close() {
    lb.classList.remove('visible');
    lb.addEventListener('transitionend', function onEnd() {
      lb.classList.remove('open');
      lbImg.src = '';
      lb.removeEventListener('transitionend', onEnd);
    });
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.menu-dish-img').forEach(function (img) {
    img.addEventListener('click', function () {
      if (!img.hasAttribute('data-hidden')) {
        open(img.src, img.alt, img.dataset.caption);
      }
    });
  });

  lbClose.addEventListener('click', close);
  lb.addEventListener('click', function (e) {
    if (e.target === lb) close();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lb.classList.contains('open')) close();
  });
})();
