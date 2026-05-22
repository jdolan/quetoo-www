// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
  }

  // Tagline carousel
  const slides = document.querySelectorAll('#tagline-carousel .tagline-slide');
  if (slides.length > 1) {
    let current = 0;
    setInterval(() => {
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    }, 5000);
  }

  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxVideo = document.getElementById('lightbox-video');

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    if (lightboxImg) { lightboxImg.src = ''; lightboxImg.style.display = ''; }
    if (lightboxVideo) { lightboxVideo.src = ''; lightboxVideo.style.display = 'none'; }
  }

  // Image lightbox (screenshots)
  if (lightbox) {
    document.querySelectorAll('.gallery-item[data-full]').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        if (lightboxVideo) lightboxVideo.style.display = 'none';
        if (lightboxImg) { lightboxImg.style.display = ''; lightboxImg.src = item.dataset.full; }
        lightbox.classList.add('active');
      });
    });
    lightbox.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
  }

  // Video lightbox — wired independently so it works on any page
  document.querySelectorAll('[data-video]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      if (!lightbox || !lightboxVideo) return;
      if (lightboxImg) lightboxImg.style.display = 'none';
      lightboxVideo.src = trigger.dataset.video + '?autoplay=1';
      lightboxVideo.style.display = 'block';
      lightbox.classList.add('active');
    });
  });
});

// ── A/B Before-After Comparison Sliders ──
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-ab]').forEach(slider => {
    const clip = slider.querySelector('.ab-clip');
    const handle = slider.querySelector('.ab-handle');
    let dragging = false;

    function setPosition(x) {
      const rect = slider.getBoundingClientRect();
      let pct = Math.min(Math.max((x - rect.left) / rect.width, 0.02), 0.98);
      const pctPx = (pct * 100).toFixed(2);
      clip.style.clipPath = `inset(0 0 0 ${(pct * 100).toFixed(2)}%)`;
      handle.style.left = pctPx + '%';
    }

    slider.addEventListener('mousedown', e => {
      dragging = true;
      setPosition(e.clientX);
      e.preventDefault();
    });

    slider.addEventListener('touchstart', e => {
      dragging = true;
      setPosition(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('mousemove', e => {
      if (dragging) setPosition(e.clientX);
    });

    window.addEventListener('touchmove', e => {
      if (dragging) setPosition(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('mouseup', () => { dragging = false; });
    window.addEventListener('touchend', () => { dragging = false; });
  });
});
