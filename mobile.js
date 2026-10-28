(()=>{
const root=document.getElementById('mobile-site'),keys=['overview','courses','schedule','environment','history','feedback','signup'];
const mq=matchMedia('(max-width:767px)');let active='overview';let resetCourseIntros=()=>{};
const map={home:'overview',junior:'courses',ielts:'courses',archive:'history',parents:'feedback'};
function motion(){root.querySelectorAll('.m-motion').forEach(t=>t.classList.toggle('is-paused',document.hidden||!mq.matches||t.closest('[data-mobile-panel]')?.dataset.mobilePanel!==active||modal.open||!!t.closest('[hidden]')));}
function show(key,write=true){if(!keys.includes(key))key='overview';if(key==='courses'&&active!=='courses'){resetCourseIntros();resetHighlights();}active=key;pauseAll();if(modal.open)modal.close();root.querySelectorAll('[data-mobile-panel]').forEach(p=>p.hidden=p.dataset.mobilePanel!==key);root.querySelectorAll('.m-nav button').forEach(b=>{if(b.dataset.mobileGo===key)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});if(write)history.pushState(null,'','#m-'+key);if(mq.matches)window.scrollTo({top:0,behavior:'instant'});motion();}
root.querySelectorAll('[data-mobile-go]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.mobileGo)));
root.querySelectorAll('[data-switch]').forEach(b=>b.addEventListener('click',()=>{const group=b.dataset.switch;root.querySelectorAll('[data-switch="'+group+'"]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));root.querySelectorAll('[data-pane="'+group+'"]').forEach(p=>p.hidden=p.dataset.choice!==b.dataset.choice);pauseAll();motion();}));
root.querySelectorAll('.m-paged').forEach(view=>{
 const track=view.querySelector('.m-picture-grid'),cards=[...track.children];let page=0;
 const back=view.querySelector('[data-page-step="-1"]'),next=view.querySelector('[data-page-step="1"]');
 back.textContent='上一张';next.textContent='下一张';
 track.setAttribute('tabindex','0');track.setAttribute('role','region');track.setAttribute('aria-label','左右滑动查看图片');
 cards.forEach(c=>c.hidden=false);
 function update(){view.querySelector('.m-pager span').textContent=(page+1)+' / '+cards.length+' 张';back.disabled=page===0;next.disabled=page===cards.length-1;}
 function stride(){return cards.length>1?cards[1].offsetLeft-cards[0].offsetLeft:track.clientWidth;}
 function move(delta){page=Math.max(0,Math.min(cards.length-1,page+delta));track.scrollTo({left:page*stride(),behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});update();}
 [back,next].forEach(b=>b.addEventListener('click',()=>move(+b.dataset.pageStep)));
 track.addEventListener('scroll',()=>{const step=stride();if(step>0){page=Math.max(0,Math.min(cards.length-1,Math.round(track.scrollLeft/step)));update();}},{passive:true});
 track.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();move(e.key==='ArrowRight'?1:-1);}});update();
});
// Draw highlights as each heading enters the viewport.
const highlights=[...root.querySelectorAll('.m-course-method h3,.m-ielts-points strong,.m-speech-target strong')];
highlights.forEach(el=>{
 el.classList.add('m-handline');
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
 svg.setAttribute('viewBox','0 0 200 12');svg.setAttribute('preserveAspectRatio','none');svg.setAttribute('aria-hidden','true');
 const path=document.createElementNS('http://www.w3.org/2000/svg','path');
 path.setAttribute('d','M3 8 C45 2 92 10 132 6 S175 4 197 7');path.setAttribute('pathLength','100');
 svg.append(path);el.append(svg);
});
let resetHighlights=()=>{};
if('IntersectionObserver' in window){
 const lineObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting&&mq.matches){entry.target.classList.add('is-line-drawn');lineObserver.unobserve(entry.target);}
 }),{threshold:0.7});
 resetHighlights=()=>highlights.forEach(el=>{el.classList.add('is-line-pending');el.classList.remove('is-line-drawn');lineObserver.observe(el);});
 resetHighlights();
}
// Reveal once per visit to the courses page.
if ('IntersectionObserver' in window) {
 const intros = root.querySelectorAll('.m-course-intro');
 const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
   if (entry.isIntersecting && mq.matches) {
    entry.target.classList.add('m-intro-revealed');
    observer.unobserve(entry.target);
   }
  });
 }, {threshold: 0.1});
 resetCourseIntros=()=>intros.forEach(intro=>{
  intro.classList.add('m-intro-reveal');
  intro.classList.remove('m-intro-revealed');
  observer.observe(intro);
 });
 resetCourseIntros();
}
function fromHash(){const hash=location.hash.slice(1);show(hash.startsWith('m-')?hash.slice(2):(map[hash]||'overview'),false);}
window.addEventListener('popstate',fromHash);window.addEventListener('hashchange',fromHash);mq.addEventListener('change',()=>{pauseAll();motion();if(!mq.matches&&location.hash.startsWith('#m-'))nav({overview:'home',courses:'junior',schedule:'junior',environment:'home',history:'archive',feedback:'parents',signup:'junior'}[active],false);});
document.addEventListener('visibilitychange',motion);new MutationObserver(motion).observe(modal,{attributes:true,attributeFilter:['open']});fromHash();
})();
