/* Load only media near the visible panel. Full-size images load on lightbox open. */
(()=>{
 const pending=new Set(document.querySelectorAll('img[data-lazy-src]'));
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>{
  if(!e.isIntersecting)return;
  const img=e.target;img.src=img.dataset.lazySrc;delete img.dataset.lazySrc;
  observer.unobserve(img);pending.delete(img);
 }),{rootMargin:'180px 120px',threshold:0});
 pending.forEach(img=>observer.observe(img));
})();
