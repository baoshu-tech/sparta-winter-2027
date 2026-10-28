(()=>{
const root=document.getElementById('mobile-site'),keys=['overview','courses','schedule','environment','history','feedback','signup'];
const mq=matchMedia('(max-width:767px)');let active='overview';
const map={home:'overview',junior:'courses',ielts:'courses',archive:'history',parents:'feedback'};
function motion(){root.querySelectorAll('.m-motion').forEach(t=>t.classList.toggle('is-paused',document.hidden||!mq.matches||t.closest('[data-mobile-panel]')?.dataset.mobilePanel!==active||modal.open||!!t.closest('[hidden]')));}
function show(key,write=true){if(!keys.includes(key))key='overview';active=key;pauseAll();if(modal.open)modal.close();root.querySelectorAll('[data-mobile-panel]').forEach(p=>p.hidden=p.dataset.mobilePanel!==key);root.querySelectorAll('.m-nav button').forEach(b=>{if(b.dataset.mobileGo===key)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});if(write)history.pushState(null,'','#m-'+key);if(mq.matches)window.scrollTo({top:0,behavior:'instant'});motion();}
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
function fromHash(){const hash=location.hash.slice(1);show(hash.startsWith('m-')?hash.slice(2):(map[hash]||'overview'),false);}
window.addEventListener('popstate',fromHash);window.addEventListener('hashchange',fromHash);mq.addEventListener('change',()=>{pauseAll();motion();if(!mq.matches&&location.hash.startsWith('#m-'))nav({overview:'home',courses:'junior',schedule:'junior',environment:'home',history:'archive',feedback:'parents',signup:'junior'}[active],false);});
document.addEventListener('visibilitychange',motion);new MutationObserver(motion).observe(modal,{attributes:true,attributeFilter:['open']});fromHash();
})();
