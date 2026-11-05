/* TeotssiNote prototype UI. No real account login or sharing yet.
   Data access is exclusively through TeotStorage.load/save (storage.js).
   Future Supabase adapter can use the same data shapes. */
(function () {
'use strict';
const icons = {
 sprout:'<path d="M12 22v-9"/><path d="M8 9c-3 0-5-2-5-6 6 0 9 2 9 7"/><path d="M12 14c0-5 3-8 9-8 0 6-3 9-9 9"/>',
 home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10Z"/><path d="M9 21v-7h6v7"/>',
 trees:'<path d="m12 3-5 8h3l-5 7h14l-5-7h3l-5-8Z"/><path d="M12 18v4"/><path d="m3 14-2 4h5"/>',
 users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
 book:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>',
 settings:'<path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.86l.07.07-1.88 1.88-.07-.07A1.7 1.7 0 0 0 16 18.4a1.7 1.7 0 0 0-1 1.56V20h-6v-.04A1.7 1.7 0 0 0 8 18.4a1.7 1.7 0 0 0-1.86.34l-.07.07-1.88-1.88.07-.07A1.7 1.7 0 0 0 4.6 15 1.7 1.7 0 0 0 3.04 14H3v-4h.04A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.86l-.07-.07L6.07 5.2l.07.07A1.7 1.7 0 0 0 8 5.6 1.7 1.7 0 0 0 9 4.04V4h6v.04A1.7 1.7 0 0 0 16 5.6a1.7 1.7 0 0 0 1.86-.34l.07-.07 1.88 1.88-.07.07A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 1.56 1H21v4h-.04A1.7 1.7 0 0 0 19.4 15Z"/>',
 camera:'<path d="M14.5 4h-5L7 7H3a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-4l-2.5-3Z"/><circle cx="12" cy="13.5" r="3.5"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
 back:'<path d="m15 18-6-6 6-6"/>',
 edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
 trash:'<path d="M3 6h18M8 6V4h8v2M5 6l1 15h12l1-15M10 10v7m4-7v7"/>',
 calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
 image:'<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
 compare:'<rect x="2" y="4" width="9" height="16" rx="1"/><rect x="13" y="4" width="9" height="16" rx="1"/><path d="M12 2v20"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.5l-1-1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.7a5.5 5.5 0 0 0 0-7.7Z"/>',
 leaf:'<path d="M20 4C8 4 3 9 3 16a5 5 0 0 0 5 5c7 0 12-5 12-17ZM4 20l11-11"/>',
 shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
 upload:'<path d="M12 16V3m-5 5 5-5 5 5"/><path d="M4 16v4h16v-4"/>',
 download:'<path d="M12 3v13m-5-5 5 5 5-5"/><path d="M4 17v4h16v-4"/>',
 external:'<path d="M14 3h7v7m0-7-9 9"/><path d="M21 14v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h6"/>',
 close:'<path d="M18 6 6 18M6 6l12 12"/>',
 check:'<path d="m5 12 4 4L19 6"/>',
 info:'<circle cx="12" cy="12" r="10"/><path d="M12 11v6M12 7h.01"/>',
 notebook:'<rect x="5" y="3" width="16" height="18" rx="2"/><path d="M9 3v18M12 8h5M12 12h5"/>',
 globe:'<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2c5 5 5 15 0 20M12 2c-5 5-5 15 0 20"/>',
 help:'<circle cx="12" cy="12" r="10"/><path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 5M12 17h.01"/>',
 file:'<path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z"/><path d="M13 2v7h7M8 14h8M8 18h8"/>',
 sparkle:'<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3ZM19 17v4M17 19h4"/>',
 link:'<path d="M10 13a5 5 0 0 0 7.5.6l2-2a5 5 0 0 0-7-7l-1.2 1.2"/><path d="M14 11a5 5 0 0 0-7.5-.6l-2 2a5 5 0 0 0 7 7l1.2-1.2"/>'
};
const I = (n, size=20) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[n]||icons.leaf}</svg>`;
const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const attr = esc;
const uid = () => (window.crypto && crypto.randomUUID ? crypto.randomUUID() : 't'+Date.now()+'_'+Math.random().toString(36).slice(2));
const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
const fmt = d => d ? String(d).replace(/^(\d{4})-(\d{2})-(\d{2})$/, (_,y,m,day)=>`${y}.${m}.${day}`) : '기록 없음';
const validPhoto = s => typeof s === 'string' && (/^data:image\/(jpeg|png|webp|svg\+xml)/i.test(s) || /^https:\/\//i.test(s));
const img = (s, cls='plant-photo', alt='관찰 사진') => validPhoto(s) ? `<img class="${cls}" src="${attr(s)}" alt="${attr(alt)}" loading="lazy" />` : `<div class="placeholder-photo" role="img" aria-label="사진 없음">${I('sprout',48)}</div>`;
function landscape(level) { // IMPORTANT: illustrative fictional photographs, no real site is implied.
  const bush = level===1?'#6f7858':level===2?'#7c9b67':'#5e9861';
  const grasses = level===1?3:level===2?7:12;
  let plants='';
  for(let j=0;j<grasses;j++) { const x=45+(j*89)%630, y=226+(j*13)%55;
    plants+=`<path d="M${x} ${y+20}q-8-12-7-22m7 22q7-15 10-24" stroke="${bush}" stroke-width="${level===1?2:3}" fill="none"/>`;
  }
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 350"><defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#dbe7e2"/><stop offset="1" stop-color="#f0e4d2"/></linearGradient></defs><rect width="720" height="350" fill="url(#sky)"/><path d="M0 195L125 111 240 178 338 107 450 190 580 127 720 198v155H0" fill="#96a69b"/><path d="M0 223L170 166 300 213 463 168 600 214 720 185v167H0" fill="#6e8273"/><path d="M0 257Q165 229 340 256T720 244V350H0" fill="#847965"/><path d="M0 292Q320 250 720 295V350H0" fill="#ad9978"/>${plants}<path d="M213 295V132m0 42-39-50m39 30 33-42M537 280V115m0 40 32-43m-32 69-49-56" stroke="#4f5148" stroke-width="8" fill="none"/><path d="M213 131q-25-19-50 12M539 112q27-16 55 11" stroke="#5d5f53" fill="none" stroke-width="3"/>${level>1?`<circle cx="160" cy="245" r="10" fill="#759d68" opacity=".82"/><circle cx="460" cy="260" r="14" fill="#638c60" opacity=".8"/>`:''}${level>2?`<ellipse cx="275" cy="268" rx="55" ry="17" fill="#769867" opacity=".8"/><ellipse cx="630" cy="275" rx="45" ry="14" fill="#6e9c65" opacity=".8"/>`:''}</svg>`;
  return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
}
const officialDemo = [
 {id:'official-1',date:'2026-03-10',photo:landscape(1),note:'가상 관찰지 첫 시점 · 시연용 삽화'},
 {id:'official-2',date:'2026-07-12',photo:landscape(2),note:'가상 관찰지 두 번째 시점 · 시연용 삽화'},
 {id:'official-3',date:'2026-10-18',photo:landscape(3),note:'가상 관찰지 세 번째 시점 · 시연용 삽화'}
];
const lessonData = [
 {id:'natural',title:'산불 이후, 숲의 회복은 어디에서 시작될까요?',tag:'숲의 회복',icon:'trees',text:'산불 이후에도 살아남은 식물의 뿌리와 그루터기, 토양 속 씨앗, 주변에서 들어오는 종자 등 여러 경로를 통해 식생이 다시 나타날 수 있습니다. 피해 정도와 환경 조건에 따라 회복 경로와 속도가 달라집니다.',question:'한 그루의 식물 성장과 여러 종이 함께 회복하는 숲은 어떤 차이가 있을까요?'},
 {id:'sprouts',title:'맹아(움싹)는 무엇일까요?',tag:'식물의 재생',icon:'sprout',text:'일부 수목은 지상의 줄기가 손상된 뒤에도 살아 있는 뿌리나 그루터기에서 새 줄기를 내어 자랍니다. 이를 맹아 재생이라고 합니다. 모든 수종이 같은 방식으로 회복되는 것은 아닙니다.',question:'씨앗에서 발아하는 식물과 남은 뿌리에서 재생하는 나무를 비교해 보세요.'},
 {id:'seedbank',title:'토양 종자은행을 아시나요?',tag:'땅속의 가능성',icon:'leaf',text:'땅에는 이전에 떨어져 남아 있는 씨앗이 있을 수 있습니다. 그중 일부는 살아남아 적절한 조건에서 발아하고, 식생의 회복에 기여할 수 있습니다. 산불 강도와 토양 상태에 따라 남아 있는 씨앗의 상태는 달라집니다.',question:'씨앗이 발아하지 않았을 때 어떤 환경 조건을 살펴볼 수 있을까요?'},
 {id:'succession',title:'숲은 오랜 시간에 걸쳐 변합니다',tag:'식생 천이',icon:'clock',text:'산불 이후 새로 나타나는 식물과 살아남은 식물은 시간이 흐르면서 서로 영향을 주고받습니다. 식물 군집의 구성과 구조가 장기간 변화하는 과정을 살펴볼 수 있습니다. 계절에 따른 잎의 변화와 수년간 이어지는 천이는 구분해서 관찰해야 합니다.',question:'봄과 가을의 색 변화만으로 산림이 복원되었다고 판단할 수 있을까요?'},
 {id:'decision',title:'어떤 복원 방식이 적절할까요?',tag:'생태와 지역사회',icon:'heart',text:'산불 피해지의 복원 방향을 정할 때는 숲의 자체 회복력, 피해 정도, 토양·지형, 생태적 가치, 재난 안전과 주민의 요구 등을 고려합니다. 자연회복을 돕거나 인위적으로 조림하는 방식은 해당 지역의 상황에 따라 검토합니다.',question:'산불 피해지역의 복원 방식을 정할 때 누구의 의견이 필요할까요?'}
];
let data = {version:1, plants:[], plantLogs:[], forests:[], forestLogs:[], reflections:[], demoFriend:false, nickname:''};
const ui = {tab:'home',plant:null,forest:null,forestView:'overview',lesson:null,learnView:'index',modal:null,photo:null,selection:{},toastTimer:null};
const root = document.getElementById('app');
const nav = [{id:'home',label:'홈',icon:'home'},{id:'plants',label:'나의 텃씨',icon:'sprout'},{id:'forest',label:'숲의 시간',icon:'trees'},{id:'friends',label:'친구',icon:'users'},{id:'learn',label:'배움터',icon:'book'}];
const P = (title,description,eyebrow='텃씨노트') => `<div class="page-head"><p class="eyebrow">${esc(eyebrow)}</p><h1 class="page-title">${esc(title)}</h1><p class="page-desc">${esc(description)}</p></div>`;
const B = (text,act,klass='btn-primary',more='') => `<button type="button" class="btn ${klass}" data-act="${act}" ${more}>${text}</button>`;
const badge = (label,kind='') => `<span class="badge ${kind}">${esc(label)}</span>`;
function appShell(content) {
  const current = nav.find(x=>x.id===ui.tab) || nav[0];
  return `<div class="app-shell"><aside class="sidebar"><div class="brand"><div class="brandmark">${I('sprout',26)}</div><div><strong>텃씨노트</strong><small>TeotssiNote · 프로토타입</small></div></div><nav class="side-nav" aria-label="주요 메뉴">${nav.map(n=>`<button class="nav-item ${ui.tab===n.id?'active':''}" data-nav="${n.id}">${I(n.icon)}<span>${n.label}</span></button>`).join('')}</nav><div class="side-bottom"><button class="nav-item ${ui.tab==='settings'?'active':''}" data-nav="settings">${I('settings')}<span>설정 및 안내</span></button><div class="mode-notice"><strong>체험판 · 이 기기 저장</strong>현재 Google 로그인과 기기 간 공유는 연결 전입니다. 입력한 기록은 이 브라우저에 저장됩니다.</div></div></aside><div class="workarea"><header class="topbar"><div class="topbar-left">${I('sprout',15)} <span style="vertical-align:2px">나의 작은 관찰이 숲의 시간과 만나다</span></div><div class="topbar-right"><span class="pill">시범 웹앱</span><button class="btn btn-outline btn-sm" data-nav="settings" title="설정">${I('settings',15)}</button></div></header><main class="content" id="main-content">${content}<div class="footer-note">텃씨노트 시범 웹앱 · 실제 기관 사진·친구 공유 및 클라우드 동기화는 연동 전입니다. 생태교육 콘텐츠는 전문가 자문을 바탕으로 구성한 학습용 초안입니다.</div></main></div><nav class="mobile-bottom" aria-label="모바일 주요 메뉴">${nav.map(n=>`<button class="mobile-nav ${ui.tab===n.id?'active':''}" data-nav="${n.id}">${I(n.icon)}<span>${n.id==='plants'?'나의 텃씨':n.id==='forest'?'숲의 시간':n.label}</span></button>`).join('')}</nav></div>${ui.modal?modalView():''}`;
}
function render() {
 let content;
 if(ui.tab==='home') content=home();
 else if(ui.tab==='plants') content=plants();
 else if(ui.tab==='forest') content=forest();
 else if(ui.tab==='friends') content=friends();
 else if(ui.tab==='learn') content=learn();
 else content=settings();
 root.innerHTML=appShell(content);
}
function navigate(page) { ui.tab=page;ui.modal=null; ui.photo=null;if(page==='forest' && !ui.forestView) ui.forestView='overview'; render();window.scrollTo(0,0); }
function home() {
  const recent = [...data.plantLogs].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,3);
  return `${P('오늘도 작은 변화를 발견해 볼까요?','나의 식물과 숲의 기록을 남기고, 그 변화가 말해 주는 이야기를 찾아보세요.','WELCOME TO TEOTSSINOTE')}
  <div class="card hero"><div class="hero-content"><div class="eyebrow">MY GROWTH JOURNAL</div><h2>씨앗 한 알에서 시작하는<br>오래 이어지는 관찰</h2><p>텃씨노트의 식물을 기르고, 주변 숲과 산불 피해지역의 시간도 함께 살펴보세요.</p>${B(`${I('plus',17)} 새 관찰 시작하기`,'create-plant','btn btn-primary','style="background:#fff;color:#31583f"')}</div><div class="hero-art">${I('sprout',120)}</div></div>
  <div class="section row between"><h2>내 관찰 현황</h2><small>현재 브라우저 기준</small></div>
  <div class="stats"><div class="stat"><b>${data.plants.length}</b><span>등록한 식물</span></div><div class="stat"><b>${data.plantLogs.length}</b><span>식물 관찰 기록</span></div><div class="stat"><b>${data.forestLogs.length}</b><span>숲 관찰 기록</span></div></div>
  <div class="section"><h2>바로 시작하기</h2></div><div class="grid cols-3">${feature('sprout','나의 텃씨','사진 한 장과 한 줄의 기록으로 식물의 변화를 남겨요.','plants')}${feature('trees','숲의 시간','공식 시연 자료와 직접 찍은 숲을 비교해요.','forest')}${feature('book','오늘의 배움','숲이 회복되는 다양한 경로를 알아봐요.','learn')}</div>
  <div class="section row between"><h2>최근 성장일지</h2>${B('모든 기록 보기','go-plants','btn-text btn-sm')}</div>
  ${recent.length ? `<div class="stack">${recent.map(l=>{const pl=data.plants.find(p=>p.id===l.plantId);return `<button class="list-card" data-act="open-plant" data-id="${attr(l.plantId)}">${validPhoto(l.photo)?img(l.photo,'list-photo','식물 사진'):`<div class="list-photo" style="display:grid;place-items:center">${I('sprout',28)}</div>`}<div class="grow"><div class="list-title">${esc(pl?.nickname||pl?.species||'식물')}</div><div class="list-sub">${fmt(l.date)} · ${esc(l.status)}<br>${esc(l.note||'사진과 관찰 메모를 남겼어요.')}</div></div>${I('arrow',17)}</button>`}).join('')}</div>` : empty('아직 식물 관찰 기록이 없어요.','첫 식물을 등록하고 오늘의 기록을 남겨 보세요.','새 식물 등록','create-plant')}
  <div class="section"><h2>오늘의 생각거리</h2></div><div class="card photo-banner"><div><span class="badge">산림생태복원 학습</span><h3 style="font-size:18px;margin:12px 0 5px">숲은 씨앗만으로 다시 자랄까요?</h3><p class="card-desc" style="margin:0 0 12px">맹아, 토양 종자은행, 식생 천이의 역할을 살펴보세요.</p>${B('학습 카드 보기 →','go-learn','btn-outline btn-sm')}</div>${I('trees',86)}</div>`;
}
function feature(icon,title,desc,to) {return `<button class="card feature-card" style="text-align:left" data-nav="${to}"><span class="icon-circle">${I(icon,23)}</span><h3>${title}</h3><p>${desc}</p></button>`;}
function empty(title,desc,button,action) {return `<div class="empty">${I('sprout',40)}<h3>${title}</h3><p>${desc}</p>${button?B(`${I('plus',15)} ${button}`,action,'btn-primary'):''}</div>`;}
function plants(){
 if(ui.plant){const p=data.plants.find(x=>x.id===ui.plant);if(p)return plantDetail(p);ui.plant=null;}
 return `${P('나의 텃씨','내가 직접 기르는 식물의 작은 변화를 기록해 보세요.')}
 <div class="row between section"><h2>등록한 식물</h2>${B(`${I('plus',16)} 식물 등록`,'create-plant')}</div>
 ${data.plants.length?`<div class="grid cols-2">${data.plants.map(p=>{const logs=data.plantLogs.filter(l=>l.plantId===p.id).sort((a,b)=>b.date.localeCompare(a.date));return `<button class="card feature-card" data-act="open-plant" data-id="${attr(p.id)}" style="text-align:left">${img(logs[0]?.photo,'plant-photo','최근 성장 사진')}<div class="row between" style="margin-top:14px"><h3 style="margin:0">${esc(p.nickname||p.species)}</h3>${badge(`${logs.length}개 기록`,'muted')}</div><p class="card-desc" style="margin:6px 0">${esc(p.species)} · ${esc(p.place||'재배 장소 미정')}</p><div class="date-row">${I('calendar',13)} 파종일 ${fmt(p.sown)}</div></button>`}).join('')}</div>`:empty('아직 등록한 식물이 없어요.','텃씨노트의 씨앗을 심었다면 식물 이름과 파종일을 등록해 보세요.','첫 식물 등록','create-plant')}
 <div class="section"><h2>안전한 식물 재배를 위해</h2></div><div class="callout">텃씨노트에서 키운 식물이나 남은 씨앗을 산이나 자연환경에 임의로 옮겨 심거나 버리지 마세요. 야외 식재에는 해당 장소의 관리 주체와 전문가의 검토가 필요할 수 있습니다.</div>`;
}
function plantDetail(p){const logs=data.plantLogs.filter(l=>l.plantId===p.id).sort((a,b)=>b.date.localeCompare(a.date));
 return `<div class="row between" style="margin-bottom:18px">${B(`${I('back',16)} 나의 텃씨`,'plant-back','btn-text btn-sm')}<div class="button-row">${B(`${I('edit',15)} 수정`,'edit-plant','btn-outline btn-sm')}${B(`${I('trash',15)} 삭제`,'delete-plant','btn-danger btn-sm')}</div></div>
 ${P(p.nickname||p.species,`${p.species} · ${p.place||'재배 장소 미정'} · ${fmt(p.sown)} 파종`,'MY PLANT')}
 <div class="card"><div class="row between" style="gap:15px;align-items:flex-start"><div class="grow"><div class="badge">${logs.length}개 성장 기록</div><h3 style="font-size:21px;letter-spacing:-.5px;margin:13px 0 5px">${esc(p.nickname||p.species)}</h3><p class="card-desc" style="margin:0 0 15px">${esc(p.species)}의 변화를 기록하고 있어요.</p>${B(`${I('plus',16)} 새 관찰 기록`,'create-plant-log')}</div><div style="width:120px;flex:none">${logs[0]?.photo?img(logs[0].photo,'plant-photo'): `<div class="placeholder-photo" style="min-height:105px">${I('sprout',36)}</div>`}</div></div></div>
 <div class="section row between"><h2>성장일지</h2>${B(`${I('compare',15)} 사진 비교`,'plant-compare','btn-outline btn-sm')}</div>
 ${logs.length?`<div class="timeline">${logs.map(l=>`<div class="timeline-item"><div class="timeline-rail"><div class="timeline-dot"></div><div class="timeline-line"></div></div><div class="timeline-body"><div class="log-card"><div class="row between"><div><div class="date-row">${I('calendar',13)} ${fmt(l.date)}</div><div style="font-weight:800;font-size:14px;margin-top:5px">${esc(l.status)}</div></div>${B(I('trash',15),'delete-plant-log','btn-text btn-sm',`data-id="${attr(l.id)}" aria-label="관찰 기록 삭제"`)}</div>${l.photo?img(l.photo,'detail-photo','관찰 날짜 '+fmt(l.date)) : ''}${l.note?`<p>${esc(l.note)}</p>`:''}</div></div></div>`).join('')}</div>`:empty('아직 관찰 일지가 없어요.','변화가 없더라도 기록할 수 있어요. 발아 전 상태도 중요한 관찰 결과입니다.','관찰 추가','create-plant-log')}
 <div class="section"><h2>재배와 보관 안내</h2></div><div class="card"><p class="card-desc">종별 파종 시기와 보관 조건은 실제 종자가 확정된 뒤 출처를 확인해 등록해야 합니다. 식물의 발아 실패나 고사도 관찰 자료로 남겨 보세요.</p><div class="callout">이 앱은 교육용 프로토타입입니다. 지역 자생종 여부와 종자 출처, 해당 장소에서의 식재 가능성을 개별 확인해야 합니다.</div></div>`;
}
function forest() {
 const view=ui.forestView||'overview';
 const tabs=[['overview','둘러보기'],['official','기관 관찰 시연'],['personal','나의 현장 기록'],['compare','사진 비교·탐구']];
 return `${P('숲의 시간','한 장소의 변화와 내가 찍은 사진을 나란히 살펴보세요. 산불 피해지 회복 사진의 정기 제공은 향후 기관 협력을 통해 추진할 계획입니다.')}
 <div class="demo-strip">${I('info',16)} 고정 카메라는 설치되지 않았습니다. 아래 기관 관찰 기록은 기능 시연을 위한 <b>가상 숲 삽화</b>이며 실제 산불 피해지 사진이 아닙니다.</div>
 <div class="tabbar">${tabs.map(t=>`<button class="tab ${view===t[0]?'active':''}" data-act="forest-tab" data-value="${t[0]}">${t[1]}</button>`).join('')}</div>
 ${view==='overview'?forestOverview():view==='official'?official():view==='personal'?personalForest():forestCompare()}`;
}
function forestOverview(){
 return `<div class="forest-banner"><button class="card flat" data-act="forest-tab" data-value="official" style="text-align:left">${I('camera',26)}<strong>기관 관찰 기록</strong><p>같은 시점·같은 장소의 정기 사진을 제공하는 장기 운영 구상</p></button><button class="card flat" data-act="forest-tab" data-value="personal" style="text-align:left">${I('image',26)}<strong>나의 현장 기록</strong><p>집 근처나 거주 지역의 숲·녹지 공간을 직접 촬영해 기록</p></button></div>
 <div class="section"><h2>기관 관찰 기록 · 시연</h2></div>
 <div class="card"><div class="row between" style="margin-bottom:12px">${badge('가상 시연 관찰지','demo')}<span class="caption">가상 삽화 3개 시점</span></div>${img(officialDemo[2].photo,'forest-photo','가상 숲의 마지막 시점 삽화')}<div class="row between" style="margin-top:15px;gap:12px"><div><h3 class="card-title">한 장소의 변화를 기록하는 방식</h3><p class="card-sub">향후 기관의 고정 촬영 자료로 교체 예정</p></div>${B('기록 보기 →','forest-tab','btn-outline btn-sm','data-value="official"')}</div></div>
 <div class="section row between"><h2>나의 관찰 장소</h2>${B(`${I('plus',16)} 장소 등록`,'create-forest','btn-outline btn-sm')}</div>
 ${data.forests.length?`<div class="grid cols-2">${data.forests.slice(0,4).map(f=>forestSiteCard(f)).join('')}</div>`:empty('아직 등록한 숲이 없어요.','집 근처 숲이나 거주 지역의 공원 등 안전하게 접근할 수 있는 장소를 선택해 보세요.','관찰 장소 등록','create-forest')}
 <div class="section"><h2>숲 관찰은 선택 활동입니다</h2></div><div class="callout">정기적으로 숲을 방문하지 않아도 텃씨노트의 식물 성장일지와 생태복원 학습 기능을 이용할 수 있어요. 산불 피해지에 직접 들어가거나 자연에 종자를 임의로 뿌리지 마세요.</div>`;
}
function official(){
 const id=ui.selection.official || officialDemo[2].id;
 const item=officialDemo.find(x=>x.id===id)||officialDemo[2];
 return `<div class="card"><div class="row between" style="margin-bottom:15px"><div><h2 class="card-title">가상 고정 관찰 카메라 기록</h2><div class="card-sub">실제 기관 연계 전 · 시연용 삽화</div></div>${badge('가상 데이터','demo')}</div>
 ${img(item.photo,'forest-photo',fmt(item.date)+' 가상 숲 삽화')}
 <div class="row between" style="margin-top:14px"><div class="date-row">${I('calendar',16)} ${fmt(item.date)}</div><span class="caption">출처: 자체 제작 예시 삽화</span></div>
 <p class="card-desc">${esc(item.note)}</p>
 <div class="field"><label for="official-date">관찰 날짜 선택</label><select id="official-date" data-select="official">${officialDemo.map(x=>`<option value="${x.id}" ${x.id===id?'selected':''}>${fmt(x.date)}</option>`).join('')}</select></div>
 <div class="button-row" style="margin-top:17px">${B(`${I('compare',15)} 개인 기록과 비교`,'forest-tab','btn-primary','data-value="compare"')}${B('변화 타임라인 보기','official-timeline','btn-outline')}</div></div>
 <div class="section"><h2>향후 실제 연계 방식</h2></div><div class="card flat"><div class="stack"><div class="row">${I('image')}<div class="grow"><b>1단계</b><p class="card-desc" style="margin:0">사용 허락을 받은 기관 사진을 관리자가 등록</p></div></div><div class="divider"></div><div class="row">${I('calendar')}<div class="grow"><b>2단계</b><p class="card-desc" style="margin:0">정기적인 동일 장소 사진 제공 협력</p></div></div><div class="divider"></div><div class="row">${I('camera')}<div class="grow"><b>3단계</b><p class="card-desc" style="margin:0">설치·운영 주체 협의 후 고정 카메라 자료 연계</p></div></div></div></div>`;
}
function forestSiteCard(f){const logs=data.forestLogs.filter(l=>l.forestId===f.id).sort((a,b)=>b.date.localeCompare(a.date));return `<button class="card feature-card" style="text-align:left" data-act="open-forest" data-id="${attr(f.id)}">${logs[0]?.photo?img(logs[0].photo,'plant-photo','숲 사진'):`<div class="placeholder-photo" style="min-height:145px">${I('trees',42)}</div>`}<div class="row between" style="margin-top:12px"><b>${esc(f.name)}</b>${badge(`${logs.length}개 기록`,'muted')}</div><p class="card-desc" style="margin:5px 0">${esc(f.type||'관찰 장소')} · ${fmt(f.start||'')}</p></button>`;}
function personalForest(){
 if(ui.forest){const f=data.forests.find(x=>x.id===ui.forest); if(f)return forestDetail(f);ui.forest=null;}
 return `<div class="row between section" style="margin-top:0"><h2>내 관찰 장소</h2>${B(`${I('plus',16)} 장소 등록`,'create-forest')}</div>
 ${data.forests.length?`<div class="grid cols-2">${data.forests.map(f=>forestSiteCard(f)).join('')}</div>`:empty('아직 숲 관찰 장소가 없어요.','자택 인근 숲, 거주 지역의 공원·녹지 등 안전하게 접근할 수 있는 장소를 선택해 등록할 수 있어요.','관찰 장소 등록','create-forest')}
 <div class="section"><h2>같은 장소를 같은 구도로</h2></div><div class="card flat"><p class="card-desc">지난번 촬영한 큰 나무나 고정된 시설물을 기준으로 삼으면 변화를 비교하기 쉬워요. 거주 지역에서 안전하게 방문할 수 있는 곳을 선택하고, 정확한 위치정보는 기록하지 않아도 됩니다.</p></div>`;
}
function forestDetail(f){ const logs=data.forestLogs.filter(l=>l.forestId===f.id).sort((a,b)=>b.date.localeCompare(a.date));
 return `<div class="row between" style="margin-bottom:15px">${B(`${I('back',15)} 관찰 장소 목록`,'forest-back','btn-text btn-sm')}${B(`${I('trash',15)} 장소 삭제`,'delete-forest','btn-danger btn-sm')}</div>
 <div class="row between" style="margin-bottom:18px;gap:12px"><div><h2 style="margin:0 0 7px">${esc(f.name)}</h2><p class="card-desc" style="margin:0">${esc(f.type||'관찰 장소')} · ${fmt(f.start)}</p></div>${B(`${I('plus',15)} 사진 기록`,'create-forest-log')}</div>
 <div class="callout">가능하면 같은 장소, 같은 높이와 방향으로 촬영해 보세요. 매번 촬영하지 못해도 괜찮습니다.</div>
 <div class="section"><h2>현장 관찰 기록</h2></div>
 ${logs.length?`<div class="timeline">${logs.map(l=>`<div class="timeline-item"><div class="timeline-rail"><div class="timeline-dot"></div><div class="timeline-line"></div></div><div class="timeline-body"><div class="log-card"><div class="row between"><div class="date-row">${I('calendar',14)} ${fmt(l.date)}</div>${B(I('trash',15),'delete-forest-log','btn-text btn-sm',`data-id="${attr(l.id)}" aria-label="숲 관찰 기록 삭제"`)}</div>${l.photo?img(l.photo,'detail-photo','개인 숲 사진'):''}<p>${esc(l.note||'관찰 메모가 없습니다.')}</p></div></div></div>`).join('')}</div>`:empty('첫 번째 숲 사진을 올려 보세요.','사진을 한 장 올리면 다음 관찰 때 이전 사진을 기준으로 비교할 수 있어요.','사진 추가','create-forest-log')}
 <div class="button-row" style="margin-top:10px">${B('공식 자료와 비교하기','forest-tab','btn-outline','data-value="compare"')}</div>`;
}
function forestCompare(){
 const mine=[...data.forestLogs].filter(x=>validPhoto(x.photo)).sort((a,b)=>b.date.localeCompare(a.date));
 const officialID=ui.selection.compareOfficial||officialDemo[2].id;
 const officialRec=officialDemo.find(x=>x.id===officialID)||officialDemo[2];
 const mineID=ui.selection.compareMine||mine[0]?.id;
 const myRec=mine.find(x=>x.id===mineID);
 const site=myRec?data.forests.find(f=>f.id===myRec.forestId):null;
 return `<div class="card"><div class="row between" style="margin-bottom:14px"><div><h2 class="card-title">공식 시연 기록 × 나의 현장 기록</h2><div class="card-sub">촬영일과 관찰 장소가 다를 수 있음을 확인하세요.</div></div>${badge('비교 탐구')}</div>
 <div class="compare-columns">
 <div class="compare-column"><h4>기관 관찰 기록 · 시연</h4><select class="select-inline" aria-label="기관 기록 날짜 선택" data-select="compareOfficial">${officialDemo.map(x=>`<option value="${x.id}" ${x.id===officialID?'selected':''}>${fmt(x.date)}</option>`).join('')}</select>${img(officialRec.photo,'forest-photo','가상 관찰 숲 삽화')}<small>가상 관찰숲 · 자체 제작 삽화</small></div>
 <div class="compare-column"><h4>나의 현장 사진</h4>${mine.length?`<select class="select-inline" aria-label="내 관찰 사진 선택" data-select="compareMine">${mine.map(x=>{const f=data.forests.find(y=>y.id===x.forestId);return `<option value="${attr(x.id)}" ${x.id===mineID?'selected':''}>${fmt(x.date)} · ${esc(f?.name||'관찰 장소')}</option>`;}).join('')}</select>${img(myRec?.photo,'forest-photo','내가 촬영한 사진')}<small>${esc(site?.name||'')} · ${fmt(myRec?.date)}</small>`:`<div class="placeholder-photo" style="min-height:135px">${I('camera',39)}</div><small>사진을 업로드하면 여기에 표시돼요.</small>`}</div>
 </div><div class="callout warn" style="margin-top:14px">현재 비교: <b>서로 다른 장소 비교</b>. 왼쪽은 가상 삽화이므로 생태 변화에 대한 실제 연구자료로 사용하지 마세요. 기관 관찰 사진이 확보되면 실제 장소·촬영일·출처를 표시합니다.</div>
 <div class="section" style="margin-top:21px"><h2>탐구 질문</h2></div><p class="card-desc">두 기록에서 관찰할 수 있는 식생과 환경의 특징은 무엇인가요? 계절 변화와 장기간의 숲 회복은 어떻게 구분할 수 있을까요?</p>
 ${B(`${I('edit',15)} 탐구 메모 작성`,'create-reflection','btn-outline')}
 </div>
 <div class="section"><h2>나의 탐구 메모</h2></div>
 ${data.reflections.length?`<div class="stack">${[...data.reflections].reverse().slice(0,6).map(r=>`<div class="card flat"><div class="row between"><span class="date-row">${fmt(r.date)}</span>${B(I('trash',14),'delete-reflection','btn-text btn-sm',`data-id="${attr(r.id)}"`)}</div><p style="line-height:1.8;font-size:13px">${esc(r.text)}</p></div>`).join('')}</div>`:empty('아직 작성한 탐구 메모가 없어요.','다른 숲의 사진을 비교할 때 장소와 촬영 시점의 차이도 생각해 보세요.')}`;
}
function friends(){
 return `${P('친구의 텃씨','내가 허용한 성장 기록을 친구와 공유하는 기능을 준비하고 있어요.')}
 <div class="demo-strip">${I('info',16)} 친구 코드 기반 실제 공유는 <b>Supabase 계정·데이터베이스 연결 후</b> 활성화됩니다. 현재는 가상 친구 데이터로 이용 흐름만 체험할 수 있습니다.</div>
 <div class="grid cols-2"><div class="card"><h2 class="card-title">내 친구 코드</h2><div class="photo-banner" style="margin:13px 0;min-height:105px"><div><b style="font-size:21px;letter-spacing:.6px">발급 준비 중</b><p class="caption" style="margin:7px 0 0">실제 계정 생성 후 고유 코드가 발급돼요.</p></div>${I('users',50)}</div>${B('친구 공유 방식 알아보기','friend-info','btn-outline btn-sm')}</div><div class="card"><h2 class="card-title">친구 등록 시연</h2><p class="card-desc">아래 시연 코드를 입력하면 가상의 친구 성장일지를 열람하는 과정을 체험할 수 있어요.</p><form id="demo-friend-form" class="stack"><div class="field"><label for="friend-code">시연 코드</label><input id="friend-code" name="code" placeholder="TSS-DEMO" autocomplete="off" /></div><button type="submit" class="btn btn-primary">시연 코드 확인</button></form></div></div>
 <div class="section"><h2>연결된 친구</h2></div>
 ${data.demoFriend?`<div class="card"><div class="row between" style="margin-bottom:14px"><div class="row">${I('users',25)}<div><b>샘플 친구</b><div class="caption">가상의 시연용 계정</div></div></div>${badge('시연','demo')}</div>${img(landscape(2),'forest-photo','시연용 친구 식물 기록이 아닌 삽화')}<p class="card-desc">예시 관찰일지: “오늘은 새싹의 잎이 조금 커진 것 같아요.”</p>${B('시연 친구 해제','remove-demo-friend','btn-outline btn-sm')}</div>`:empty('아직 연결된 친구가 없어요.','실제 친구 관계는 계정 인증과 공유 권한 기능이 완성되면 이용할 수 있어요.')}
 <div class="section"><h2>친구 공유 원칙</h2></div><div class="card flat"><div class="stack"><div class="row">${I('shield',21)}<span class="card-desc">실명과 정확한 위치정보는 공유하지 않아요.</span></div><div class="row">${I('check',21)}<span class="card-desc">친구 요청을 수락한 경우에만 허용한 기록을 볼 수 있어요.</span></div><div class="row">${I('trash',21)}<span class="card-desc">언제든 공유를 중단하거나 친구를 삭제할 수 있어요.</span></div></div></div>`;
}
function learn(){
 if(ui.learnView==='people')return people();
 if(ui.learnView==='quiz')return quiz();
 if(ui.lesson){const x=lessonData.find(l=>l.id===ui.lesson);if(x)return lesson(x);ui.lesson=null;}
 return `${P('배움터','화분에서 시작한 질문을 숲의 자연회복과 지역사회로 이어 가 보세요.')}
 <div class="section" style="margin-top:0"><h2>산림생태복원 알아보기</h2></div><div class="stack">${lessonData.map((l,i)=>`<button class="study-card" data-act="lesson" data-id="${l.id}"><span class="number">${String(i+1).padStart(2,'0')}</span><div class="grow"><b>${esc(l.title)}</b><p>${esc(l.tag)}</p></div>${I('arrow',17)}</button>`).join('')}</div>
 <div class="section"><h2>관찰을 더 깊게</h2></div><div class="grid cols-2"><button class="card feature-card" style="text-align:left" data-act="go-quiz"><span class="icon-circle">${I('compare',23)}</span><h3>비교·탐구 미션</h3><p>화분의 성장과 산림의 회복을 구분해 생각해요.</p></button><button class="card feature-card" style="text-align:left" data-act="go-people"><span class="icon-circle">${I('heart',23)}</span><h3>숲과 사람</h3><p>산불 피해지역 주민과 지역사회의 회복을 살펴봐요.</p></button></div>
 <div class="button-row" style="margin-top:14px">${B('탐구 미션 시작','go-quiz','btn-outline')}${B('안부숲 이야기 보기','go-people','btn-outline')}</div>`;
}
function lesson(l){return `<div class="row" style="margin-bottom:17px">${B(`${I('back',15)} 학습 카드 목록`,'learn-back','btn-text btn-sm')}</div>${P(l.title,'산림생태복원 학습 카드 · 전문가 자문 반영 초안',l.tag)}
 <div class="card"><div class="lesson-illustration">${I(l.icon,70)}</div><h2 class="section" style="font-size:18px">함께 알아봐요</h2><p style="font-size:15px;line-height:2">${esc(l.text)}</p><div class="callout"><b>생각해 보기</b><br>${esc(l.question)}</div><div class="button-row" style="margin-top:17px">${B('다른 학습 카드','learn-back','btn-outline')}${B('탐구 미션','go-quiz','btn-primary')}</div><div class="divider"></div><p class="caption">자료 근거: 2026.11.5. 한새롬 백년숲사회적협동조합 이사장의 자문 의견. 학습용으로 재구성한 초안이며, 실제 산림 자료 활용 시 추가 확인이 필요합니다.</p></div>`;}
function quiz(){return `<div class="row" style="margin-bottom:15px">${B(`${I('back',15)} 배움터`,'learn-back','btn-text btn-sm')}</div>${P('비교·탐구 미션','나의 식물과 실제 숲이 회복되는 과정을 함께 생각해 보세요.','LEARNING ACTIVITY')}
 <div class="card"><h2 class="card-title">Q. 산불 이후 숲의 회복을 이해하려면 무엇을 함께 살펴봐야 할까요?</h2><form id="quiz-form" class="stack" style="margin-top:18px"><label class="option"><input type="radio" name="answer" value="a" required/> 씨앗이 발아하는 모습만 살펴본다.</label><label class="option"><input type="radio" name="answer" value="b"/> 여러 식물과 환경 조건의 장기 변화를 살펴본다.</label><label class="option"><input type="radio" name="answer" value="c"/> 사람이 심은 나무의 개수만 확인한다.</label><button class="btn btn-primary" type="submit">답변 확인</button></form><div id="quiz-feedback" class="callout" style="margin-top:15px" hidden></div></div>
 <div class="section"><h2>한 문장으로 정리해 보세요</h2></div><div class="card"><p class="card-desc">개별 식물의 성장과 산림생태계 회복의 공통점·차이점은 무엇일까요?</p>${B('탐구 메모 기록','create-reflection','btn-outline')}</div>`;}
function people(){return `<div class="row" style="margin-bottom:15px">${B(`${I('back',15)} 배움터`,'learn-back','btn-text btn-sm')}</div>${P('숲과 사람','산불 피해지역의 회복에는 그곳에서 살아가는 사람들의 경험도 중요한 부분을 차지합니다.','COMMUNITY & FOREST')}
 <div class="card"><div class="photo-banner" style="margin-bottom:20px"><div><span class="badge">지역사회 학습</span><h3 style="font-size:20px;margin:11px 0 0">숲이 회복되는 동안,<br>사람들은 어떻게 지낼까요?</h3></div>${I('heart',90)}</div><p class="card-desc">산불 피해는 숲뿐 아니라 주민의 생활과 안전에도 영향을 미칩니다. 백년숲사회적협동조합은 산불 이후 이웃의 안부와 지역의 회복을 함께 생각하는 '안부숲' 활동을 소개하고 있습니다.</p><div class="callout">생각해 보기: 산불 피해지역에서 어떤 숲을 회복할지 결정할 때 주민의 의견은 왜 중요할까요?</div><div class="button-row" style="margin-top:17px"><a class="btn btn-primary" href="https://anbu-forest100.netlify.app/" target="_blank" rel="noopener noreferrer">안부숲 사이트 열기 ${I('external',15)}</a></div><p class="caption" style="margin-top:15px">외부 사이트로 이동합니다. 백년숲과 텃씨노트의 공식 협력 사업이 확정된 것은 아닙니다. 소개 내용은 제공받은 자문에 근거합니다.</p></div>`;}
function settings(){return `${P('설정 및 안내','기록은 현재 사용 중인 브라우저에 저장됩니다. 실제 Google 로그인·동기화는 후속 연동 예정입니다.')}
 <div class="card"><div class="card-head"><h2 class="card-title">저장 방식</h2>${badge('기기 저장','warn')}</div><p class="card-desc">현재 프로토타입은 브라우저 저장소(IndexedDB, 지원되지 않으면 localStorage)를 사용합니다. 기기 간 자동 동기화와 실제 친구 공유는 아직 지원하지 않습니다. Supabase를 연결하면 같은 웹앱에서 계정 기반 클라우드 저장으로 전환할 계획입니다.</p><div class="stats"><div class="stat"><b>${data.plants.length}</b><span>식물</span></div><div class="stat"><b>${data.plantLogs.length+data.forestLogs.length}</b><span>관찰 기록</span></div><div class="stat"><b>${data.reflections.length}</b><span>탐구 메모</span></div></div></div>
 <div class="section"><h2>데이터 관리</h2></div><div class="card"><p class="card-desc">다른 기기로 수동 이동하려면 기록 파일을 내보낸 뒤 새 기기에서 불러올 수 있습니다. 사진 데이터가 포함되면 파일이 커질 수 있어요.</p><div class="button-row">${B(`${I('download',15)} 기록 내보내기`,'export-data','btn-outline')}${B(`${I('upload',15)} 기록 가져오기`,'import-data','btn-outline')}${B(`${I('trash',15)} 모든 기록 삭제`,'clear-data','btn-danger')}</div><input type="file" id="import-file" accept="application/json,.json" hidden /></div>
 <div class="section"><h2>개발 예정 기능</h2></div><div class="card flat"><div class="stack">${[['shield','Google 계정 로그인'],['globe','기기 간 사진·기록 동기화'],['users','친구 코드·승인 기반 공유'],['camera','협력기관 고정 관찰 카메라 자료 연계']].map(x=>`<div class="row">${I(x[0],19)}<span class="grow" style="font-size:13px">${x[1]}</span>${badge('예정','muted')}</div>`).join('')}</div></div>
 <div class="section"><h2>프로젝트 정보 및 출처</h2></div><div class="card flat"><p class="card-desc"><b>텃씨노트(TeotssiNote)</b>는 청소년들이 식물 관찰과 산림생태복원 학습을 지속할 수 있도록 구상한 환경교육 프로젝트입니다.</p><div class="link-list"><a href="https://www.forest.go.kr/" target="_blank" rel="noopener noreferrer">산림청 공식 홈페이지 ${I('external',16)}</a><a href="https://www.forest100.org/" target="_blank" rel="noopener noreferrer">백년숲사회적협동조합 ${I('external',16)}</a><a href="https://anbu-forest100.netlify.app/" target="_blank" rel="noopener noreferrer">안부숲 캠페인 ${I('external',16)}</a></div><p class="caption">교육 내용은 2026년 11월 5일 한새롬 이사장의 자문 의견을 참고하여 정리한 초안입니다. 공식 관찰 기록은 현재 실제 데이터가 아닌 가상 시연 자료입니다.</p></div>`;}
function modalView(){const m=ui.modal;if(!m)return '';
 const plant = ui.plant ? data.plants.find(p=>p.id===ui.plant) : null;
 const forestPlace=ui.forest?data.forests.find(f=>f.id===ui.forest):null;
 let title='',desc='',content='';
 const photoField=`<div class="field"><label for="photo-file">사진 (선택)</label><input id="photo-file" type="file" accept="image/*"/><div class="help">이미지는 브라우저에서 크기를 줄여 이 기기에 저장합니다.</div><div id="photo-preview-area">${ui.photo?img(ui.photo,'image-preview','추가할 사진'):''}</div></div>`;
 if(m.type==='plant') {const p=m.edit ? data.plants.find(x=>x.id===m.edit) : null;title=p?'식물 정보 수정':'새로운 텃씨 등록';desc='파종 후 나의 식물을 기록해 보세요.';content=`<form id="plant-form" class="stack"><div class="form-grid"><div class="field"><label for="species">식물 종류 *</label><input id="species" name="species" required maxlength="80" placeholder="예: 종자 포장에 적힌 종명" value="${attr(p?.species||'')}" /></div><div class="field"><label for="nickname">식물 별명</label><input id="nickname" name="nickname" maxlength="50" placeholder="예: 초록이" value="${attr(p?.nickname||'')}" /></div><div class="field"><label for="sown">파종일 *</label><input id="sown" type="date" name="sown" required value="${attr(p?.sown||today())}" /></div><div class="field"><label for="place">재배 장소 유형 *</label><select name="place" id="place" required>${['집 안(실내)','집 베란다·마당','거주 지역의 텃밭·정원','기타 허용된 재배 장소',...(p?.place && !['집 안(실내)','집 베란다·마당','거주 지역의 텃밭·정원','기타 허용된 재배 장소'].includes(p.place) ? [p.place] : [])].map(x=>`<option ${p?.place===x?'selected':''}>${x}</option>`).join('')}</select></div></div><div class="form-actions"><button class="btn btn-outline" data-act="close-modal" type="button">취소</button><button class="btn btn-primary" type="submit">${p?'변경 저장':'식물 등록'}</button></div></form>`;}
 else if(m.type==='plant-log') {title='오늘의 성장관찰';desc=`${plant?.nickname||plant?.species||'식물'} · 변화가 보이지 않아도 기록해 보세요.`;content=`<form id="plant-log-form" class="stack"><div class="form-grid"><div class="field"><label for="logdate">관찰 날짜 *</label><input id="logdate" type="date" name="date" required value="${today()}" /></div><div class="field"><label for="status">식물 상태 *</label><select id="status" name="status" required>${['발아 전','새싹 발견','성장 중','시듦·고사','관찰 종료'].map(x=>`<option>${x}</option>`).join('')}</select></div></div>${photoField}<div class="field"><label for="lognote">한 줄 관찰 메모</label><textarea id="lognote" name="note" maxlength="800" placeholder="예: 아직 싹이 나오지 않아 흙과 빛의 조건을 살펴보았다."></textarea></div><div class="callout">발아하지 않거나 시드는 모습도 중요한 관찰 자료예요. 생태 환경과 조건을 생각해 보세요.</div><div class="form-actions"><button type="button" class="btn btn-outline" data-act="close-modal">취소</button><button type="submit" class="btn btn-primary">관찰 기록 저장</button></div></form>`;}
 else if(m.type==='forest') {title='숲 관찰 장소 등록';desc='집 근처나 거주 지역에서 안전하게 방문할 수 있는 숲·녹지 공간을 등록해 보세요.';content=`<form id="forest-form" class="stack"><div class="field"><label for="forestname">관찰 장소 별명 *</label><input id="forestname" name="name" maxlength="70" required placeholder="예: 집 근처 산책로의 작은 숲" /></div><div class="form-grid"><div class="field"><label for="foresttype">장소 유형</label><select id="foresttype" name="type">${['자택 인근 숲','거주 지역의 공원·녹지','거주 지역의 산책로·하천변','기타 안전한 관찰 장소'].map(x=>`<option>${x}</option>`).join('')}</select></div><div class="field"><label for="foreststart">관찰 시작일</label><input id="foreststart" type="date" name="start" value="${today()}" /></div></div><div class="field"><label for="forestguide">같은 구도 촬영을 위한 기준 메모</label><textarea id="forestguide" name="guide" placeholder="예: 산책로 입구의 큰 나무를 중심으로 촬영" maxlength="350"></textarea></div><div class="help">정확한 주소나 좌표는 수집하지 않아요. 산불 피해지 등 출입 제한 장소에는 들어가지 마세요.</div><div class="form-actions"><button class="btn btn-outline" type="button" data-act="close-modal">취소</button><button class="btn btn-primary" type="submit">관찰 장소 저장</button></div></form>`;}
 else if(m.type==='forest-log') {title='숲의 새 사진 기록';desc=`${forestPlace?.name||'관찰 장소'} · 이전 사진과 비슷한 구도에서 촬영해 보세요.`;content=`<form id="forest-log-form" class="stack"><div class="field"><label for="forestlogdate">촬영 날짜 *</label><input id="forestlogdate" type="date" name="date" required value="${today()}" /></div>${photoField}<div class="field"><label for="forestlognote">한 줄 관찰 메모</label><textarea id="forestlognote" name="note" maxlength="800" placeholder="예: 지난번보다 낙엽이 많아졌다."></textarea></div><div class="callout">같은 장소에서 반복 촬영한 사진이 가장 비교하기 쉬워요. 숲의 계절 변화와 산불 피해지의 복원 과정은 서로 구분해야 합니다.</div><div class="form-actions"><button class="btn btn-outline" type="button" data-act="close-modal">취소</button><button class="btn btn-primary" type="submit">사진 기록 저장</button></div></form>`;}
 else if(m.type==='reflection') {title='비교·탐구 메모';desc='관찰 대상과 촬영 시점의 차이를 생각하면서 기록해 보세요.';content=`<form id="reflection-form" class="stack"><div class="field"><label for="reflection-text">탐구 내용 *</label><textarea id="reflection-text" name="text" minlength="5" maxlength="1200" required placeholder="예: 개인 화분의 발아와 여러 종이 함께 회복하는 산림의 차이를 발견했다."></textarea></div><div class="form-actions"><button class="btn btn-outline" type="button" data-act="close-modal">취소</button><button class="btn btn-primary" type="submit">탐구 메모 저장</button></div></form>`;}
 else if(m.type==='plant-compare') {title='식물 성장 사진 비교';desc=`${plant?.nickname||plant?.species||'식물'}의 두 시점을 비교합니다.`;
  const photos=data.plantLogs.filter(x=>x.plantId===plant?.id&&validPhoto(x.photo)).sort((a,b)=>a.date.localeCompare(b.date));
  const a=photos.find(x=>x.id===ui.selection.plantCompareA)||photos[0]; const b=photos.find(x=>x.id===ui.selection.plantCompareB)||photos[photos.length-1];
  content=photos.length<2?`<div class="callout warn">서로 다른 날짜의 사진 기록이 두 건 이상 있어야 비교할 수 있습니다.</div>`:`<div class="compare-columns"><div class="compare-column"><h4>첫 번째 시점</h4><select class="select-inline" data-select="plantCompareA">${photos.map(x=>`<option value="${attr(x.id)}" ${x.id===a.id?'selected':''}>${fmt(x.date)}</option>`).join('')}</select>${img(a.photo,'plant-photo','첫 사진')}</div><div class="compare-column"><h4>두 번째 시점</h4><select class="select-inline" data-select="plantCompareB">${photos.map(x=>`<option value="${attr(x.id)}" ${x.id===b.id?'selected':''}>${fmt(x.date)}</option>`).join('')}</select>${img(b.photo,'plant-photo','두 번째 사진')}</div></div><div class="callout" style="margin-top:15px">두 사진에서 어떤 차이가 보이나요? 환경 조건과 관찰 기간을 함께 생각해 보세요.</div>`;
 }
 else if(m.type==='official-timeline') {title='가상 관찰 타임라인';desc='고정 카메라 연계 후 같은 장소에서 찍은 사진을 날짜별로 비교하는 화면을 시연합니다.';content=`<div class="demo-strip">모든 이미지는 자체 제작한 가상 풍경 삽화이며 실제 산림의 회복 데이터를 나타내지 않습니다.</div><div class="stack">${officialDemo.map(x=>`<div class="log-card"><b>${fmt(x.date)}</b>${img(x.photo,'forest-photo','가상 풍경 삽화')}<p class="caption">${esc(x.note)}</p></div>`).join('')}</div>`;}
 else if(m.type==='friend-info') {title='친구 공유 기능 설명';desc='실제 공유는 인증·데이터베이스 연동 후 지원합니다.';content=`<div class="stack"><div class="callout">1. 내 계정에서 추측하기 어려운 친구 코드를 발급합니다.</div><div class="callout">2. 친구가 코드를 입력하면 내가 요청을 확인하고 수락합니다.</div><div class="callout">3. 승인된 친구에게만 공개를 허용한 기록을 보여 줍니다.</div><div class="callout">4. 언제든 친구를 해제하고 공유를 중단할 수 있습니다.</div></div>`;}
 return `<div class="modal-backdrop" id="modal-backdrop"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="dialog-title"><div class="row between" style="align-items:flex-start;margin-bottom:12px"><div><h2 id="dialog-title" class="modal-title">${esc(title)}</h2><p class="modal-desc">${esc(desc)}</p></div><button type="button" class="close-btn" data-act="close-modal" aria-label="닫기">${I('close',17)}</button></div>${content}</div></div>`;
}
function openModal(type,edit){ui.modal={type,edit};ui.photo=null;render();}
function toast(s){document.querySelector('.toast')?.remove();const t=document.createElement('div');t.className='toast';t.textContent=s;document.body.appendChild(t);clearTimeout(ui.toastTimer);ui.toastTimer=setTimeout(()=>t.remove(),3400);}
async function save(){try {await TeotStorage.save(data);}catch(err){console.error(err);toast('저장에 실패했습니다. 저장 공간을 확인해 주세요.');}}
async function saveRender(message){await save();ui.modal=null;ui.photo=null;render();if(message)toast(message);}
function changeSelect(el){const id=el.getAttribute('data-select');if(!id)return;ui.selection[id]=el.value;render();}
async function resizeImage(file) {
 if(!file || !file.type.startsWith('image/'))throw new Error('이미지 파일을 선택해 주세요.');
 if(file.size>14*1024*1024)throw new Error('이미지 크기는 14MB 이하로 제한됩니다.');
 const url=URL.createObjectURL(file);
 try {
   const im=new Image(); im.src=url; await new Promise((res,rej)=>{im.onload=res;im.onerror=()=>rej(new Error('사진을 읽을 수 없습니다.'));});
   const max=1200, scale=Math.min(1,max/Math.max(im.naturalWidth,im.naturalHeight));
   const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(im.naturalWidth*scale));canvas.height=Math.max(1,Math.round(im.naturalHeight*scale));
   canvas.getContext('2d').drawImage(im,0,0,canvas.width,canvas.height);
   return canvas.toDataURL('image/jpeg',.74);
 } finally {URL.revokeObjectURL(url);}
}
function exportData(){const blob=new Blob([JSON.stringify({...data,exportedAt:new Date().toISOString()},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`teotssinote-backup-${today()}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);toast('기록 파일을 내보냈어요.');}
async function importData(file){if(!file)return;try{if(file.size>35*1024*1024)throw new Error('35MB 이하의 백업 파일만 불러올 수 있습니다.');const obj=JSON.parse(await file.text());for(const k of ['plants','plantLogs','forests','forestLogs','reflections'])if(!Array.isArray(obj[k]))throw new Error('텃씨노트 백업 파일 형식이 아닙니다.');if(!confirm('현재 이 기기의 기록이 백업 파일 내용으로 교체됩니다. 계속하시겠어요?'))return;data={version:1,plants:obj.plants,plantLogs:obj.plantLogs,forests:obj.forests,forestLogs:obj.forestLogs,reflections:obj.reflections,demoFriend:!!obj.demoFriend,nickname:String(obj.nickname||'')};ui.plant=null;ui.forest=null;await saveRender('기록을 불러왔어요.');}catch(err){toast('불러오기 실패: '+err.message);}}
async function handleAct(el){const act=el.dataset.act;const id=el.dataset.id;switch(act){
 case 'go-plants':navigate('plants');return;
 case 'go-learn':navigate('learn');return;
 case 'create-plant':openModal('plant');return;
 case 'edit-plant':openModal('plant',ui.plant);return;
 case 'open-plant':ui.plant=id;navigate('plants');return;
 case 'plant-back':ui.plant=null;render();return;
 case 'delete-plant':if(!confirm('식물과 해당 성장일지를 모두 삭제할까요?'))return;data.plants=data.plants.filter(x=>x.id!==ui.plant);data.plantLogs=data.plantLogs.filter(x=>x.plantId!==ui.plant);ui.plant=null;await saveRender('식물과 기록을 삭제했어요.');return;
 case 'create-plant-log':openModal('plant-log');return;
 case 'delete-plant-log':if(!confirm('이 성장일지를 삭제할까요?'))return;data.plantLogs=data.plantLogs.filter(x=>x.id!==id);await saveRender('관찰 기록을 삭제했어요.');return;
 case 'plant-compare':openModal('plant-compare');return;
 case 'forest-tab':ui.forestView=el.dataset.value;ui.forest=null;render();return;
 case 'create-forest':openModal('forest');return;
 case 'open-forest':ui.forest=id;ui.forestView='personal';navigate('forest');return;
 case 'forest-back':ui.forest=null;render();return;
 case 'delete-forest':if(!confirm('이 장소와 사진 기록을 모두 삭제할까요?'))return;data.forests=data.forests.filter(x=>x.id!==ui.forest);data.forestLogs=data.forestLogs.filter(x=>x.forestId!==ui.forest);ui.forest=null;await saveRender('숲 관찰 장소를 삭제했어요.');return;
 case 'create-forest-log':openModal('forest-log');return;
 case 'delete-forest-log':if(!confirm('이 숲 관찰 기록을 삭제할까요?'))return;data.forestLogs=data.forestLogs.filter(x=>x.id!==id);await saveRender('사진 기록을 삭제했어요.');return;
 case 'official-timeline':openModal('official-timeline');return;
 case 'create-reflection':openModal('reflection');return;
 case 'delete-reflection':if(!confirm('탐구 메모를 삭제할까요?'))return;data.reflections=data.reflections.filter(x=>x.id!==id);await saveRender('탐구 메모를 삭제했어요.');return;
 case 'friend-info':openModal('friend-info');return;
 case 'remove-demo-friend':data.demoFriend=false;await saveRender('시연 친구를 해제했어요.');return;
 case 'lesson':ui.lesson=id;ui.learnView='index';render();return;
 case 'go-quiz':ui.lesson=null;ui.learnView='quiz';render();return;
 case 'go-people':ui.lesson=null;ui.learnView='people';render();return;
 case 'learn-back':ui.lesson=null;ui.learnView='index';render();return;
 case 'close-modal':ui.modal=null;ui.photo=null;render();return;
 case 'export-data':exportData();return;
 case 'import-data':document.getElementById('import-file')?.click();return;
 case 'clear-data':if(!confirm('이 브라우저의 모든 식물·숲 기록이 삭제됩니다. 이 작업은 되돌릴 수 없습니다. 삭제할까요?'))return;data={version:1,plants:[],plantLogs:[],forests:[],forestLogs:[],reflections:[],demoFriend:false,nickname:''};ui.plant=null;ui.forest=null;await saveRender('모든 기록을 삭제했어요.');return;
 }
}
document.addEventListener('click',e=>{const link=e.target.closest('[data-nav]');if(link){navigate(link.dataset.nav);return;}const act=e.target.closest('[data-act]');if(act){handleAct(act).catch(err=>{console.error(err);toast('기능 실행 중 오류가 발생했어요.');});return;}if(e.target.id==='modal-backdrop'){ui.modal=null;ui.photo=null;render();}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&ui.modal){ui.modal=null;ui.photo=null;render();}});
document.addEventListener('change',async e=>{
 if(e.target.dataset.select){changeSelect(e.target);return;}
 if(e.target.id==='photo-file'){const f=e.target.files?.[0];if(!f)return;try {ui.photo=await resizeImage(f);document.getElementById('photo-preview-area').innerHTML=img(ui.photo,'image-preview','업로드할 사진 미리보기');}catch(err){ui.photo=null;toast(err.message);}return;}
 if(e.target.id==='import-file'){await importData(e.target.files?.[0]);return;}
});
document.addEventListener('submit',async e=>{
 const form=e.target;if(!form.id)return;e.preventDefault();
 const fd=new FormData(form);const val=n=>String(fd.get(n)||'').trim();
 try{
 if(form.id==='plant-form'){
   if(!val('species')||!val('sown'))return toast('식물 종류와 파종일을 입력해 주세요.');
   const id=ui.modal?.edit; const plant={id:id||uid(),species:val('species'),nickname:val('nickname'),sown:val('sown'),place:val('place')};
   if(id)data.plants=data.plants.map(x=>x.id===id?plant:x);else data.plants.push(plant);
   ui.plant=plant.id;ui.tab='plants';await saveRender(id?'식물 정보를 수정했어요.':'식물을 등록했어요.');return;
 }
 if(form.id==='plant-log-form'){
   if(!ui.plant||!data.plants.some(x=>x.id===ui.plant))return toast('먼저 식물을 등록해 주세요.');
   data.plantLogs.push({id:uid(),plantId:ui.plant,date:val('date'),status:val('status'),note:val('note'),photo:ui.photo||null});await saveRender('오늘의 관찰을 저장했어요.');return;
 }
 if(form.id==='forest-form'){
   if(!val('name'))return toast('관찰 장소를 입력해 주세요.');
   const site={id:uid(),name:val('name'),type:val('type'),start:val('start'),guide:val('guide')};data.forests.push(site);ui.forest=site.id;ui.tab='forest';ui.forestView='personal';await saveRender('숲 관찰 장소를 등록했어요.');return;
 }
 if(form.id==='forest-log-form'){
   if(!ui.forest||!data.forests.some(x=>x.id===ui.forest))return toast('먼저 관찰 장소를 등록해 주세요.');
   if(!ui.photo)return toast('숲 관찰 사진을 선택해 주세요.');
   data.forestLogs.push({id:uid(),forestId:ui.forest,date:val('date'),photo:ui.photo,note:val('note')});await saveRender('숲 관찰 사진을 저장했어요.');return;
 }
 if(form.id==='reflection-form'){
   if(val('text').length<5)return toast('탐구 내용을 다섯 글자 이상 적어 주세요.');
   data.reflections.push({id:uid(),date:today(),text:val('text')});await saveRender('탐구 메모를 저장했어요.');return;
 }
 if(form.id==='demo-friend-form'){
   if(val('code').toUpperCase()!=='TSS-DEMO')return toast('시연 코드는 TSS-DEMO 입니다.');
   data.demoFriend=true;await saveRender('시연용 가상 친구가 추가되었어요.');return;
 }
 if(form.id==='quiz-form'){
   const correct=val('answer')==='b';const feedback=document.getElementById('quiz-feedback');feedback.hidden=false;feedback.className='callout'+(correct?'':' warn');feedback.textContent=correct?'적절한 관점이에요. 실제 숲에서는 다양한 식물과 환경 조건이 함께 작용하고, 회복 과정도 오래 걸릴 수 있어요.':'다른 경로도 살펴보세요. 산불 뒤에는 맹아·토양 종자은행·주변 종자 유입 등 여러 과정이 관여할 수 있어요.';return;
 }
 }catch(err){console.error(err);toast('저장 중 오류가 발생했어요. 다시 시도해 주세요.');}
});
(async()=>{try{const saved=await TeotStorage.load();if(saved&&Array.isArray(saved.plants)&&Array.isArray(saved.plantLogs)){data={...data,...saved};}}catch(err){console.error(err);}render();})();
})();
