const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')}),{threshold:.13});document.querySelectorAll('.reveal').forEach(e=>io.observe(e));
const btn=document.getElementById('audioBtn'),audio=document.getElementById('heidelbergAudio');let on=false;btn.addEventListener('click',async()=>{try{if(!on){await audio.play();on=true;btn.textContent='■ Detener Heidelberg'}else{audio.pause();on=false;btn.textContent='◉ Sonido Heidelberg'}}catch(e){alert('Toca nuevamente para permitir la reproducción del audio.')}});


// Catálogo integrado tipo flipbook
(() => {
  const total = 28;
  let left = 1;
  const leftImg = document.getElementById('leftPage');
  const rightImg = document.getElementById('rightPage');
  const status = document.getElementById('pageStatus');
  const slider = document.getElementById('pageSlider');
  const book = document.getElementById('book');
  const stage = document.getElementById('bookStage');
  const shell = document.querySelector('.flipbookShell');
  const pad = n => String(n).padStart(2,'0');
  const mobile = () => matchMedia('(max-width:760px)').matches;
  function render(direction='next') {
    left = Math.max(1, Math.min(27, left % 2 ? left : left - 1));
    const right = Math.min(total, left + 1);
    leftImg.src = `assets/catalogo-pages/page-${pad(left)}.png`;
    rightImg.src = `assets/catalogo-pages/page-${pad(right)}.png`;
    leftImg.alt = `Página ${left} del catálogo`;
    rightImg.alt = `Página ${right} del catálogo`;
    status.textContent = left === 1 ? `Portada · páginas ${left}–${right} de ${total}` : `Páginas ${left}–${right} de ${total}`;
    slider.value = left;
    document.querySelectorAll('#prevPage,#prevPageBottom,#firstPage').forEach(b=>b.disabled=left===1);
    document.querySelectorAll('#nextPage,#nextPageBottom,#lastPage').forEach(b=>b.disabled=left>=27);
    book.classList.remove('turning','turningBack'); void book.offsetWidth;
    book.classList.add(direction==='back'?'turningBack':'turning');
    setTimeout(()=>book.classList.remove('turning','turningBack'),380);
  }
  const next=()=>{if(left<27){left+=2;render('next')}};
  const prev=()=>{if(left>1){left-=2;render('back')}};
  ['nextPage','nextPageBottom'].forEach(id=>document.getElementById(id)?.addEventListener('click',next));
  ['prevPage','prevPageBottom'].forEach(id=>document.getElementById(id)?.addEventListener('click',prev));
  document.getElementById('firstPage')?.addEventListener('click',()=>{left=1;render('back')});
  document.getElementById('lastPage')?.addEventListener('click',()=>{left=27;render('next')});
  slider?.addEventListener('input',e=>{left=Number(e.target.value);render(left>Number(slider.dataset.old||1)?'next':'back');slider.dataset.old=left});
  document.getElementById('fullscreenBook')?.addEventListener('click',async()=>{try{if(!document.fullscreenElement)await shell.requestFullscreen();else await document.exitFullscreen()}catch(e){}});
  let x0=null;
  stage?.addEventListener('pointerdown',e=>x0=e.clientX);
  stage?.addEventListener('pointerup',e=>{if(x0===null)return;const d=e.clientX-x0;x0=null;if(Math.abs(d)>45)(d<0?next:prev)()});
  document.addEventListener('keydown',e=>{if(location.hash==='#catalogo'||document.fullscreenElement){if(e.key==='ArrowRight')next();if(e.key==='ArrowLeft')prev();}});
  render();
})();


// Personalización por asesor comercial
(() => {
  const advisors = {
    antonio: {
      name: 'Antonio Caballero',
      short: 'Antonio',
      phone: '4775587226',
      email: 'disenoalfacolor@gmail.com'
    },
    carlos: {
      name: 'Carlos Castañeda',
      short: 'Carlos',
      phone: '4792166442',
      email: 'digitalalfacolor@gmail.com'
    },
    daniel: {
      name: 'Daniel Guerrero',
      short: 'Daniel',
      phone: '4772947011',
      email: 'alfacolor.ventas12@gmail.com'
    },
    martha: {
      name: 'Martha Martínez',
      short: 'Martha',
      phone: '4777923580',
      email: 'alfacoloradmon@gmail.com'
    },
    maluisa: {
      name: 'Ma. Luisa Hernández',
      short: 'Ma. Luisa',
      phone: '4777532227',
      email: 'maluisaalfa@hotmail.com'
    },
  };
  const params = new URLSearchParams(location.search);
  const key = (params.get('asesor') || 'antonio').toLowerCase();
  const advisor = advisors[key] || advisors.antonio;
  const internationalPhone = `52${advisor.phone}`;
  const message = encodeURIComponent(`Hola ${advisor.short}, vi Alfacolor Experience y me gustaría solicitar una cotización.`);
  const whatsappUrl = `https://wa.me/${internationalPhone}?text=${message}`;

  const setText = (id, value) => { const el=document.getElementById(id); if(el) el.textContent=value; };
  setText('advisorTopName', advisor.name);
  setText('advisorHeroName', advisor.name);
  setText('advisorName', advisor.name);
  setText('floatingAdvisorName', advisor.short);
  const wa=document.getElementById('advisorWhatsApp'); if(wa) wa.href=whatsappUrl;
  const floating=document.getElementById('floatingAdvisor'); if(floating) floating.href=whatsappUrl;
  const email=document.getElementById('advisorEmail');
  if(email){ email.href=`mailto:${advisor.email}`; email.textContent=advisor.email; }
  document.title=`Alfacolor Experience · ${advisor.name}`;
})();


// Sincroniza exactamente la altura de los tres videos con la foto principal.
(() => {
  const grid = document.querySelector('.pressMediaGrid');
  const main = document.querySelector('.pressMediaGrid .pressMain');
  const videos = document.querySelector('.pressVideos');
  if (!grid || !main || !videos) return;

  const syncHeight = () => {
    if (window.matchMedia('(max-width: 950px)').matches) {
      videos.style.height = '';
      return;
    }
    const height = Math.round(main.getBoundingClientRect().height);
    if (height > 0) videos.style.height = `${height}px`;
  };

  if (main.complete) syncHeight();
  else main.addEventListener('load', syncHeight, { once: true });

  window.addEventListener('resize', syncHeight);
  if ('ResizeObserver' in window) {
    new ResizeObserver(syncHeight).observe(main);
  }
  requestAnimationFrame(syncHeight);
})();
