const dialog = document.querySelector('#video-dialog');
const video = dialog.querySelector('video');
let previousFocus = null;
document.querySelectorAll('[data-video]').forEach(button => button.addEventListener('click', () => {
  previousFocus = button;
  const id = button.dataset.video;
  video.src = `assets/${id}.mp4`;
  video.poster = `assets/${id}.jpg`;
  dialog.querySelector('#video-title').textContent = button.dataset.title;
  dialog.showModal();
  video.play().catch(() => {});
}));
dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener('close', () => {
  video.pause();
  video.removeAttribute('src');
  video.load();
  previousFocus?.focus();
});
