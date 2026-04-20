// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
  }

  // Lightbox for screenshot galleries and trailer
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxVideo = document.getElementById('lightbox-video');

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    if (lightboxImg) { lightboxImg.src = ''; lightboxImg.style.display = ''; }
    if (lightboxVideo) { lightboxVideo.src = ''; lightboxVideo.style.display = 'none'; }
  }

  if (lightbox) {
    document.querySelectorAll('.gallery-item[data-full]').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        if (lightboxVideo) lightboxVideo.style.display = 'none';
        if (lightboxImg) { lightboxImg.style.display = ''; lightboxImg.src = item.dataset.full; }
        lightbox.classList.add('active');
      });
    });

    document.querySelectorAll('[data-video]').forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        if (lightboxImg) lightboxImg.style.display = 'none';
        if (lightboxVideo) {
          lightboxVideo.src = trigger.dataset.video + '?autoplay=1';
          lightboxVideo.style.display = 'block';
        }
        lightbox.classList.add('active');
      });
    });

    lightbox.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
  }
});
