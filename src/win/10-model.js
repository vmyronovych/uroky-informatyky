/* ---- Windows на проєктор ----
   Навчальна копія Windows 10 і 11: робочий стіл, «Пуск», панель завдань,
   Провідник. Файлова система вигадана (теки класів, як у школі) і живе лише
   в пам'яті сторінки; «Скинути» повертає початкову. Екран малюється у
   віртуальній роздільності 1366×768 при 100 % і масштабується під проєктор
   цілком, тож усе в тих самих пропорціях, що на шкільному моніторі.

   Файли src/win/*.js склеюються в index.html по порядку імен:
   10 — модель і операції, 20 — значки й шпалери, 30 — розмітка,
   40 — миша, клавіатура, меню і відкриття схеми. */

const WN_BADCH='\\/:*?"<>|';
const WN_TYPES={
  txt:{type:"Текстовий документ", app:"notepad"},
  docx:{type:"Документ Microsoft Word", app:"word"},
  pptx:{type:"Презентація Microsoft PowerPoint", app:"ppt"},
  png:{type:"Файл PNG", app:"photos"},
  bmp:{type:"Точковий рисунок", app:"paint"},
  mp3:{type:"Звук у форматі MP3", app:"media"},
  mp4:{type:"Файл MP4", app:"media"},
  pdf:{type:"Документ PDF Microsoft Edge", app:"edge"}
};
/* kw — за чим програма знаходиться в пошуку «Пуску» */
const WN_APPS={
  explorer:{n:"Провідник файлів", kw:"провідник файлів explorer file"},
  thispc:{n:"Цей ПК", kw:"цей пк this pc комп'ютер"},
  edge:{n:"Microsoft Edge", kw:"edge браузер інтернет"},
  store:{n:"Microsoft Store", kw:"store магазин"},
  word:{n:"Word", kw:"word ворд"},
  excel:{n:"Excel", kw:"excel ексель"},
  ppt:{n:"PowerPoint", kw:"powerpoint презентація"},
  onedrive:{n:"OneDrive", kw:"onedrive"},
  notepad:{n:"Блокнот", kw:"блокнот notepad"},
  paint:{n:"Paint", kw:"paint пейнт малювання"},
  photos:{n:"Фотографії", kw:"фотографії photos фото"},
  media:{n:"Медіапрогравач", kw:"медіапрогравач media player музика відео"},
  calc:{n:"Калькулятор", kw:"калькулятор calculator"},
  camera:{n:"Камера", kw:"камера camera"},
  clock:{n:"Годинник", kw:"годинник clock будильник"},
  mail:{n:"Пошта", kw:"пошта mail outlook"},
  settings:{n:"Параметри", kw:"параметри settings настройки"},
  cmd:{n:"Командний рядок", kw:"командний рядок cmd"},
  ctrl:{n:"Панель керування", kw:"панель керування control panel"},
  snip:{n:"Ножиці", kw:"ножиці snipping"},
  taskmgr:{n:"Диспетчер завдань", kw:"диспетчер завдань task manager"}
};
const WN_NEW={
  dir:{name:"Нова папка", label:"Папку", label11:"Папка"},
  bmp:{name:"Новий точковий рисунок", ext:"bmp", label:"Точковий рисунок"},
  docx:{name:"Новий документ Microsoft Word", ext:"docx", label:"Документ Microsoft Word"},
  txt:{name:"Новий текстовий документ", ext:"txt", label:"Текстовий документ"}
};
/* розкладки схеми: код клавіші → [en, EN, uk, UK]. Друк у полях схеми йде
   за мовою схеми, а не ПК учителя, — тож «ghjdslybr» можна показати будь-коли */
const WN_KEYS=(()=>{
  const m={};
  const row=(en,uk)=>[...en].forEach((c,i)=>{ m["Key"+c]=[c.toLowerCase(), c, uk[i], uk[i].toUpperCase()]; });
  row("QWERTYUIOP","йцукенгшщз"); row("ASDFGHJKL","фівапролд"); row("ZXCVBNM","ячсмить");
  Object.assign(m, {Backquote:["`","~","'","₴"], BracketLeft:["[","{","х","Х"], BracketRight:["]","}","ї","Ї"], Backslash:["\\","|","ґ","Ґ"],
    Semicolon:[";",":","ж","Ж"], Quote:["'",'"',"є","Є"], Comma:[",","<","б","Б"], Period:[".",">","ю","Ю"], Slash:["/","?",".",","],
    Minus:["-","_","-","_"], Equal:["=","+","=","+"]});
  [..."1234567890"].forEach((d,i)=>{ m["Digit"+d]=[d, "!@#$%^&*()"[i], d, '!"№;%:?*()'[i]]; });
  return m;
})();
const WN_VIEWS=[["xl","Величезні значки"],["large","Великі значки"],["medium","Звичайні значки"],["small","Дрібні значки"],
                ["list","Список"],["details","Таблиця"],["tiles","Плитка"],["content","Вміст"]];
const WN_DICO={large:{w:104,h:132,i:96}, medium:{w:76,h:96,i:48}, small:{w:76,h:66,i:32}};

/* Структура як у Провіднику: «Цей ПК» → шість папок користувача і два
   диски. Теки класів — частина на Робочому столі, частина в Документах;
   усередині папки учнів «Прізвище Ім'я». lock — Windows не пропонує ні
   перейменувати, ні видалити; adm — пропонує, але вимагає прав
   адміністратора; real — з чого починається адреса текстом. */
function wnDemo(){
  let id=0;
  const H=s=>{ let h=7; for(const c of s) h=(h*31+c.codePointAt(0))>>>0; return h; };
  const at=(date,s)=>date+"T"+String(8+H(s)%7).padStart(2,"0")+":"+String(H(s+"·")%60).padStart(2,"0");
  const KB={txt:[1,3], docx:[14,40], pptx:[900,3200], png:[180,900], mp3:[2800,5200], mp4:[18000,90000], pdf:[90,700]};
  const d=(name,date,kids,o)=>Object.assign({id:++id, name, kind:"dir", date:at(date,name), made:at(date,name), kids:kids||[]}, o||{});
  const f=(full,date,text)=>{
    const i=full.lastIndexOf("."), ext=full.slice(i+1), r=KB[ext];
    const n={id:++id, name:full.slice(0,i), ext, kind:"file", date:at(date,full), made:at(date,full), size:(r[0]+H(full)%(r[1]-r[0]))*1024+H(full)%1024};
    if(text!=null){ n.text=text; n.size=new Blob([text]).size; }
    return n;
  };
  const sys=(name,emb,real,kids)=>d(name,"2026-08-25",kids,{lock:1, emb, real:"C:\\Users\\Учень\\"+real});
  const adm=(name,kids)=>d(name,"2026-08-25",kids,{adm:1});
  const pupil=(name,files)=>d(name,"2026-09-07",files);
  const cls=(name,pupils)=>d(name,"2026-09-01",pupils);

  const desk=[
    cls("3А",[pupil("Баран Марія",[f("Марія.png","2026-09-07"), f("Баран_кола.png","2026-09-21"),
                f("Баран_введення.txt","2026-09-14","Мене звати Марія Баран.\r\nЯ вчуся в 3-А класі.\r\nМені подобається малювати коні й кола.")]),
              pupil("Гнатюк Олег",[f("Гнатюк_кола.png","2026-09-21")])]),
    cls("4А",[pupil("Бондар Марія",[f("Бондар_про_мене.docx","2026-09-07"), f("Бондар_форми.docx","2026-09-14"),
                f("Бондар_розміри.docx","2026-09-21"), f("Малюнок.png","2026-09-14"), f("Пісня.mp3","2026-09-14")]),
              pupil("Коваль Андрій",[f("Коваль_про_мене.docx","2026-09-07"), f("Коваль_форми.docx","2026-09-14"), f("Малюнок.png","2026-09-14")]),
              pupil("Мельник Іван",[f("Мельник_про_мене.docx","2026-09-07")])]),
    cls("5А",[pupil("Шевчук Анна",[f("Казка.docx","2026-09-09"), f("Планети.pptx","2026-09-16"), f("Пташки.mp3","2026-09-23")])]),
    cls("6А",[pupil("Кравець Богдан",[f("Дроби.pdf","2026-09-10"), f("Екскурсія.mp4","2026-09-17")])]),
    cls("7А",[pupil("Савчук Ірина",[f("Реферат.docx","2026-09-11"), f("Карта_України.png","2026-09-18")])]),
    f("Розклад.png","2026-09-01")
  ];
  const docs=[
    cls("3Б",[pupil("Литвин Софія",[f("Литвин_кола.png","2026-09-21"),
                f("Литвин_введення.txt","2026-09-14","Мене звати Софія Литвин.\r\nУ мене є кіт Барсик.")])]),
    cls("4Б",[pupil("Олійник Дарина",[f("Олійник_про_мене.docx","2026-09-08"), f("Олійник_форми.docx","2026-09-15")]),
              pupil("Ткачук Максим",[f("Ткачук_про_мене.docx","2026-09-08")])]),
    cls("8А",[pupil("Поліщук Денис",[f("Досліди.pptx","2026-09-14"), f("Мелодія.mp3","2026-09-21"), f("Таблиця_Менделєєва.pdf","2026-09-22")])]),
    cls("9А",[pupil("Лисенко Олена",[f("Формули.pdf","2026-09-15"), f("Екологія.pptx","2026-09-22"), f("Фото_класу.png","2026-09-01")])]),
    cls("10А",[pupil("Марченко Артем",[f("Твір.docx","2026-09-16")])]),
    cls("11А",[pupil("Руденко Катерина",[f("Випускний.mp4","2026-09-01"), f("Розклад_НМТ.pdf","2026-09-24")])]),
    f("Лист_бабусі.docx","2026-09-12"),
    f("Рецепт.txt","2026-09-19","Млинці\r\n\r\n2 яйця\r\n1 склянка молока\r\n1 склянка борошна\r\nЩіпка солі\r\n\r\nЗмішати і смажити на гарячій сковороді.")
  ];
  const sp={
    video:sys("Відео","video","Videos",[f("Мультфільм.mp4","2026-09-05")]),
    docs:sys("Документи","docs","Documents",docs),
    down:sys("Завантаження","down","Downloads",[f("Інструкція.pdf","2026-09-03")]),
    pics:sys("Зображення","pics","Pictures",[f("Канікули.png","2026-08-28")]),
    music:sys("Музика","music","Music",[f("Гімн_України.mp3","2026-09-01")]),
    desk:sys("Робочий стіл","desk","Desktop",desk)
  };
  const user=d("Учень","2026-08-25",[],{lock:1, own:1, real:"C:\\Users\\Учень", links:Object.values(sp).map(n=>n.id)});
  const diskC=d("Локальний диск (C:)","2026-08-25",[
    adm("Program Files",[adm("Microsoft Office"), adm("Windows Media Player")]),
    adm("Program Files (x86)"),
    adm("Windows",[adm("Fonts"), adm("System32")]),
    d("Користувачі","2026-08-25",[user],{lock:1, adm:1, real:"C:\\Users"})
  ], {lock:1, drive:"C", real:"C:\\", cap:237, free:128.4});
  const diskD=d("Локальний диск (D:)","2026-08-25",[
    d("Архів 2025–2026","2026-06-06",[f("Звіт_за_рік.pdf","2026-06-05")]),
    d("Фото","2026-09-01",[f("Свято_знань.png","2026-09-01")])
  ], {lock:1, drive:"D", real:"D:\\", cap:465, free:402.7});
  const root=d("Цей ПК","2026-08-25",[...Object.values(sp), diskC, diskD], {lock:1, pc:1});
  const bin=d("Кошик","2026-08-25",[],{lock:1, bin:1});
  const byName=nm=>[...desk,...docs].find(n=>n.name+"."+n.ext===nm);
  return {root, bin, seq:id, sp:Object.fromEntries(Object.entries(sp).map(([k,n])=>[k,n.id])),
          recent:["Розклад.png","Лист_бабусі.docx","Рецепт.txt"].map(x=>byName(x).id)};
}

const wn={el:null, scr:null, open:false, ver:"10", big:false, cast:true,
  root:null, bin:null, desk:null, seq:0, by:{}, up:{}, sp:{},
  pos:{}, dk:{sel:[], anc:null}, dico:"medium",
  wins:[], wseq:0, z:10, act:null, hid:null,
  start:null, sq:"", srail:false, sfold:{},
  menu:null, edit:null, clip:null, pins:[], recent:[], showExt:false, boxes:false, compact:false, views:{}, sorts:{},
  press:null, drag:null, band:null, mv:null, last:null, slow:0, win:null, lang:"УКР", clock:0};

function wnW(){ return wn.big ? 1093 : 1366; }
function wnH(){ return wn.big ? 614 : 768; }
function wnTB(){ return wn.ver==="11" ? 48 : 40; }

function wnIndex(){
  wn.by={}; wn.up={};
  const walk=(n,p)=>{ wn.by[n.id]=n; wn.up[n.id]=p; (n.kids||[]).forEach(k=>walk(k,n.id)); };
  walk(wn.root,null); walk(wn.bin,null);
}
function wnReset(){
  const x=wnDemo();
  wn.root=x.root; wn.bin=x.bin; wn.seq=x.seq; wn.sp=x.sp; wnIndex();
  wn.desk=wn.by[x.sp.desk];
  wn.pos={}; wn.dk={sel:[], anc:null}; wn.dico="medium";
  wn.wins=[]; wn.act=null; wn.hid=null; wn.start=null; wn.sq=""; wn.srail=false; wn.sfold={};
  wn.menu=null; wn.edit=null; wn.clip=null; wn.drag=null; wn.band=null; wn.mv=null;
  wn.pins=["desk","down","docs","pics"].map(k=>wn.sp[k]); wn.recent=x.recent;
  wn.showExt=false; wn.boxes=false; wn.compact=false; wn.views={}; wn.sorts={};
  wnLayoutDesk();
}

/* ---- дерево ---- */
function wnPath(id){ const out=[]; for(let x=id; x!=null; x=wn.up[x]) out.unshift(x); return out; }
function wnInBin(id){ return id!==wn.bin.id && wnPath(id)[0]===wn.bin.id; }
function wnKey(n){ return (n.kind==="file" && n.ext ? n.name+"."+n.ext : n.name).toLowerCase(); }
function wnFull(n, ext){ return n.kind==="file" && n.ext && (ext==null ? wn.showExt : ext) ? n.name+"."+n.ext : n.name; }
function wnType(n){
  if(n.kind==="file") return WN_TYPES[n.ext] ? WN_TYPES[n.ext].type : n.ext ? "Файл "+n.ext.toUpperCase() : "Файл";
  return n.pc ? "Системна папка" : n.drive ? "Локальний диск" : n.bin ? "Системна папка" : "Папка файлів";
}
function wnAppOf(n){ return n.kind==="file" && WN_TYPES[n.ext] ? WN_TYPES[n.ext].app : null; }
/* адреса текстом, як у рядку адреси Windows: C:\Users\Учень\Desktop\4А */
function wnReal(id){
  if(typeof id!=="number" || !wn.by[id]) return "";
  const p=wnPath(id); let i=-1;
  p.forEach((x,k)=>{ if(wn.by[x].real) i=k; });
  if(i<0) return "";
  const rest=p.slice(i+1).map(x=>wnFull(wn.by[x],true)), base=wn.by[p[i]].real;
  return rest.length ? base.replace(/\\$/,"")+"\\"+rest.join("\\") : base;
}
function wnDrive(id){ const r=wnReal(id); return r ? r[0] : null; }
/* права адміністратора: Program Files, Windows, Користувачі — але не власна тека */
function wnAdm(id){
  for(let x=id; x!=null; x=wn.up[x]){ const n=wn.by[x]; if(n.own) return false; if(n.adm) return true; }
  return false;
}
/* 1 — можна класти, 0 — нікуди, -1 — лише з правами адміністратора */
function wnWritable(id){
  const n=typeof id==="number" && wn.by[id];
  if(!n || n.kind!=="dir" || n.pc || n.bin || wnInBin(id)) return 0;
  return wnAdm(id) ? -1 : 1;
}
function wnLocName(loc){
  if(loc==="quick") return wn.ver==="11" ? "Головна" : "Швидкий доступ";
  if(loc==="gallery") return "Галерея";
  if(loc==="net") return "Мережа";
  return wn.by[loc] ? wn.by[loc].name : "";
}
function wnLocOk(loc){ return typeof loc==="string" || (!!wn.by[loc] && wn.by[loc].kind==="dir" && !wnInBin(loc)); }
function wnUnique(dir, base, ext, skip){
  const has=nm=>dir.kids.some(k=>k!==skip && wnKey(k)===(ext ? nm+"."+ext : nm).toLowerCase());
  if(!has(base)) return base;
  let i=2; while(has(base+" ("+i+")")) i++;
  return base+" ("+i+")";
}
function wnNow(){
  const d=new Date(), p=x=>String(x).padStart(2,"0");
  return d.getFullYear()+"-"+p(d.getMonth()+1)+"-"+p(d.getDate())+"T"+p(d.getHours())+":"+p(d.getMinutes());
}
function wnDt(iso){ return iso ? iso.slice(8,10)+"."+iso.slice(5,7)+"."+iso.slice(0,4)+" "+iso.slice(11,16) : ""; }
function wnDtLong(iso){ return iso ? +iso.slice(8,10)+" "+MONTHS[+iso.slice(5,7)-1]+" "+iso.slice(0,4)+" р., "+(+iso.slice(11,13))+":"+iso.slice(14,16)+":00" : ""; }
const wnNum=new Intl.NumberFormat("uk");
function wnKB(b){ return wnNum.format(Math.ceil(b/1024))+" КБ"; }
function wnHuman(b){
  const u=[["ГБ",1073741824],["МБ",1048576],["КБ",1024]].find(x=>b>=x[1]);
  if(!u) return b+" байт";
  const v=b/u[1];
  return new Intl.NumberFormat("uk",{maximumFractionDigits:v<10?2:v<100?1:0}).format(v)+" "+u[0];
}
function wnDirSize(n){ let s=0, f=0, d=0; (function walk(x){ (x.kids||[]).forEach(k=>{ if(k.kind==="dir"){ d++; walk(k); } else { f++; s+=k.size||0; } }); })(n); return {s,f,d}; }

/* ---- робочий стіл: кожен значок стоїть у своїй клітинці, як у Windows без автовпорядкування ---- */
function wnCell(){ return WN_DICO[wn.dico]; }
function wnRows(){ return Math.max(1, Math.floor((wnH()-wnTB()-4)/wnCell().h)); }
function wnCols(){ return Math.max(1, Math.floor((wnW()-4)/wnCell().w)); }
function wnDeskItems(){ return [wn.bin, ...wn.desk.kids]; }
function wnPlace(id, want){
  const taken=new Set(Object.keys(wn.pos).filter(k=>+k!==id).map(k=>wn.pos[k].join(",")));
  const rows=wnRows(), cols=wnCols();
  let c=want ? Math.min(want[0],cols-1) : 0, r=want ? Math.min(want[1],rows-1) : 0;
  for(let k=0; k<rows*cols; k++){
    if(!taken.has(c+","+r)){ wn.pos[id]=[c,r]; return; }
    if(++r>=rows){ r=0; if(++c>=cols) c=0; }
  }
  wn.pos[id]=[0,0];
}
function wnLayoutDesk(){
  const ids=new Set(wnDeskItems().map(n=>n.id)), rows=wnRows(), cols=wnCols();
  Object.keys(wn.pos).forEach(k=>{ const p=wn.pos[k]; if(!ids.has(+k) || p[1]>=rows || p[0]>=cols) delete wn.pos[k]; });
  ids.forEach(id=>{ if(!wn.pos[id]) wnPlace(id); });
}
function wnDeskSort(by){
  const items=wnSorted(wn.desk.kids, {by, dir:1});
  wn.pos={};
  [wn.bin, ...items].forEach(n=>wnPlace(n.id));
}

/* папки завжди перед файлами, диски — після папок */
const wnColl=new Intl.Collator("uk",{numeric:true, sensitivity:"base"});
function wnSorted(arr, s){
  const rk=n=>n.kind==="file" ? 2 : n.drive ? 1 : 0;
  return arr.slice().sort((a,b)=>{
    if(rk(a)!==rk(b)) return rk(a)-rk(b);
    let r = s.by==="date" ? (a.date<b.date ? -1 : a.date>b.date ? 1 : 0)
          : s.by==="type" ? wnColl.compare(wnType(a), wnType(b))
          : s.by==="size" ? (a.size||0)-(b.size||0)
          : s.by==="del" ? (a.del<b.del ? -1 : a.del>b.del ? 1 : 0) : 0;
    if(!r) r=wnColl.compare(wnFull(a,true), wnFull(b,true));
    return r*s.dir;
  });
}
function wnSortOf(loc){ return wn.sorts[loc] || {by:"name", dir:1}; }
function wnViewOf(loc){
  if(wn.views[loc]) return wn.views[loc];
  if(loc==="gallery") return "large";
  return typeof loc==="number" && wnPath(loc).includes(wn.sp.pics) ? "large" : "details";
}

/* ---- виділення ---- */
function wnWin(id){ return wn.wins.find(w=>w.id===id); }
function wnTab(w){ return w.tabs[w.ti]; }
function wnHold(sf){
  if(sf==="desk") return wn.dk;
  const w=wnWin(+String(sf).slice(1));
  return w && w.tabs ? wnTab(w) : null;
}
function wnSelOnly(sf, id){ const h=wnHold(sf); if(h){ h.sel=id==null ? [] : [id]; h.anc=id; } }

/* ---- перейменування ---- */
function wnStartEdit(sf, id, isNew){
  const n=wn.by[id];
  if(!n || n.lock || wnInBin(id)) return;
  if(wnAdm(id)){ wnDeny(); return; }
  wnSelOnly(sf, id);
  wn.edit={sf, id, val:wnFull(n), fresh:true, isNew:!!isNew};
}
function wnCommit(){
  const e=wn.edit; if(!e) return;
  wn.edit=null;
  if(!wn.by[e.id]) return;
  wnRename(e.id, e.val, wn.showExt, ()=>{ wn.edit={sf:e.sf, id:e.id, val:e.val, fresh:true}; });
}
/* ext — чи було видно розширення в полі: якщо ні, набране «Кіт.png» у
   документа Word стане «Кіт.png.docx» — саме так, як у Windows */
function wnRename(id, raw, ext, retry){
  const n=wn.by[id], s=String(raw).replace(/^\s+/,"").replace(/[\s.]+$/,"");
  if(!n || !s) return;
  let name=s, x=n.ext||"";
  if(n.kind==="file" && ext){ const i=s.lastIndexOf("."); if(i>0){ name=s.slice(0,i); x=s.slice(i+1); } else x=""; }
  if(name===n.name && x===(n.ext||"")) return;
  const apply=()=>{
    const par=wn.by[wn.up[id]], full=(n.kind==="file" && x ? name+"."+x : name).toLowerCase();
    if(par.kids.some(k=>k!==n && wnKey(k)===full)){
      const alt=wnUnique(par, name, n.kind==="file" ? x : "", n), dir=n.kind==="dir";
      wnDialog({title:dir?"Перейменування папки":"Перейменування файлу", icon:"warn",
        main:"У цьому розташуванні вже є "+(dir?"папка":"файл")+" з таким самим іменем.",
        text:"Перейменувати «"+esc(name)+"» на «"+esc(alt)+"»?",
        btns:[{t:"Так", def:1, act:()=>{ n.name=alt; if(!dir) n.ext=x; }}, {t:"Ні", act:retry}]});
      return;
    }
    n.name=name; if(n.kind==="file") n.ext=x;
  };
  if(n.kind==="file" && x.toLowerCase()!==(n.ext||"").toLowerCase())
    wnDialog({title:"Перейменування", icon:"warn",
      text:"Якщо змінити розширення імені файлу, файл може стати непридатним для використання.<br><br>Змінити його?",
      btns:[{t:"Так", act:apply}, {t:"Ні", def:1, act:retry}]});
  else apply();
}

/* ---- створення, видалення, кошик ---- */
function wnCreate(dirId, kind, sf, at){
  const ok=wnWritable(dirId);
  if(ok<=0){ if(ok<0) wnDeny(); return; }
  const dir=wn.by[dirId], spec=WN_NEW[kind], ext=spec.ext||"";
  const n={id:++wn.seq, name:wnUnique(dir, spec.name, ext), kind:kind==="dir"?"dir":"file", date:wnNow(), made:wnNow()};
  if(n.kind==="dir") n.kids=[]; else { n.ext=ext; n.size=0; if(ext==="txt") n.text=""; if(ext==="bmp") n.blank=1; }
  dir.kids.push(n); wnIndex();
  if(dir===wn.desk) wnPlace(n.id, at);
  wnStartEdit(sf, n.id, true);
}
function wnDetach(n){
  const p=wn.by[wn.up[n.id]];
  if(p) p.kids=p.kids.filter(k=>k!==n);
  delete wn.pos[n.id];
}
/* після будь-якої зміни дерева: прибрати посилання на те, чого вже немає */
function wnFix(){
  wnIndex();
  const live=id=>!!wn.by[id] && !wnInBin(id);
  wn.dk.sel=wn.dk.sel.filter(id=>wn.up[id]===wn.desk.id || id===wn.bin.id);
  for(const w of wn.wins) if(w.tabs) for(const t of w.tabs){
    while(!wnLocOk(t.loc)){
      const n=wn.by[t.loc];
      t.loc = n && n.orig!=null && wn.by[n.orig] ? n.orig : wn.root.id;
    }
    t.back=t.back.filter(wnLocOk); t.fwd=t.fwd.filter(wnLocOk);
    t.sel=t.sel.filter(id=>!!wn.by[id]);
  }
  if(wn.clip){ wn.clip.ids=wn.clip.ids.filter(live); if(!wn.clip.ids.length) wn.clip=null; }
  wn.pins=wn.pins.filter(live); wn.recent=wn.recent.filter(live);
  if(wn.edit && !wn.by[wn.edit.id]) wn.edit=null;
  wnLayoutDesk();
}
/* у Кошик, як Delete у Windows: без питань */
function wnTrash(ids){
  ids=ids.filter(id=>wn.by[id] && !wn.by[id].lock && !wnInBin(id) && id!==wn.bin.id);
  if(!ids.length) return;
  if(ids.some(wnAdm)){ wnDeny(); return; }
  const now=wnNow();
  ids.forEach(id=>{ const n=wn.by[id], p=wn.up[id]; if(p==null) return; wnDetach(n); n.orig=p; n.del=now; wn.bin.kids.push(n); });
  wnFix();
}
function wnPurge(ids, ask){
  ids=ids.filter(id=>wn.by[id] && !wn.by[id].lock);
  if(!ids.length) return;
  if(ids.some(wnAdm)){ wnDeny(); return; }
  const go=()=>{ ids.forEach(id=>{ if(wn.by[id]) wnDetach(wn.by[id]); }); wnFix(); };
  if(!ask) return go();
  const n=wn.by[ids[0]];
  wnDialog({title:ids.length>1?"Видалення кількох елементів":n.kind==="dir"?"Видалення папки":"Видалення файлу", icon:"del",
    text:ids.length>1 ? "Остаточно видалити ці елементи ("+ids.length+")?" : "Остаточно видалити "+(n.kind==="dir"?"цю папку":"цей файл")+"?",
    about:ids.length>1 ? null : n,
    btns:[{t:"Так", def:1, act:go}, {t:"Ні"}]});
}
function wnEmptyBin(){
  const k=wn.bin.kids;
  if(!k.length) return;
  wnDialog({title:k.length>1?"Видалення кількох елементів":"Видалення "+(k[0].kind==="dir"?"папки":"файлу"), icon:"del",
    text:k.length>1 ? "Остаточно видалити ці елементи ("+k.length+")?" : "Остаточно видалити «"+esc(wnFull(k[0]))+"»?",
    btns:[{t:"Так", def:1, act:()=>{ wn.bin.kids=[]; wnFix(); }}, {t:"Ні"}]});
}
function wnRestore(ids){
  ids.forEach(id=>{
    const n=wn.by[id]; if(!n || wn.up[id]!==wn.bin.id) return;
    let p=wn.by[n.orig]; if(!p || wnInBin(p.id)) p=wn.desk;
    wnDetach(n);
    n.name=wnUnique(p, n.name, n.kind==="file" ? n.ext : "");
    delete n.orig; delete n.del;
    p.kids.push(n);
  });
  wnFix();
}

/* ---- копіювання і переміщення ---- */
function wnClone(n){
  const x={id:++wn.seq, name:n.name, kind:n.kind, date:n.date, made:wnNow()};
  ["ext","size","text","blank"].forEach(k=>{ if(n[k]!=null) x[k]=n[k]; });
  if(n.kind==="dir") x.kids=n.kids.map(wnClone);
  return x;
}
function wnCopyName(dir, n){ return wnUnique(dir, n.name+" — копія", n.kind==="file" ? n.ext : ""); }
/* op: "move" | "copy". Однакове ім'я в папці призначення — діалог «Замінити
   або пропустити», по одному на кожен збіг. done(ids) — що з'явилося там. */
function wnTransfer(ids, destId, op, done, at){
  const dest=wn.by[destId], ok=wnWritable(destId);
  if(ok<=0){ if(ok<0) wnDeny(); return; }
  ids=ids.filter(id=>wn.by[id] && id!==wn.bin.id);
  if(op==="move" && ids.some(id=>wn.by[id].lock)) return;
  if(ids.some(id=>wnPath(destId).includes(id))){
    wnDialog({title:"Переривання дії", icon:"warn", text:"Папка призначення є вкладеною папкою вихідної папки.", btns:[{t:"Скасувати", def:1}]});
    return;
  }
  if(op==="move" && ids.some(wnAdm)){ wnDeny(); return; }
  const queue=ids.slice(), out=[], from=wn.up[ids[0]];
  const put=(n,name)=>{
    const x = op==="copy" ? wnClone(n) : n;
    if(op==="move"){ wnDetach(n); if(wn.up[n.id]===wn.bin.id){ delete n.orig; delete n.del; } }
    x.name=name; dest.kids.push(x); wnIndex();
    if(dest===wn.desk) wnPlace(x.id, at && !out.length ? at : at ? wn.pos[out[out.length-1]] : undefined);
    out.push(x.id);
  };
  const step=()=>{
    while(queue.length){
      const n=wn.by[queue.shift()]; if(!n) continue;
      if(op==="move" && wn.up[n.id]===destId) continue;
      if(op==="copy" && wn.up[n.id]===destId){ put(n, wnCopyName(dest, n)); continue; }
      const clash=dest.kids.find(k=>k!==n && wnKey(k)===wnKey(n));
      if(clash){
        const dir=n.kind==="dir";
        wnDialog({title:"Замінити або пропустити "+(dir?"папки":"файли"), icon:null, wide:1,
          main:(op==="copy"?"Копіювання":"Переміщення")+" з «"+esc(wnLocName(wn.up[n.id]))+"» до «"+esc(dest.name)+"»",
          text:"Місце призначення вже містить "+(dir?"папку":"файл")+" з іменем «"+esc(wnFull(n))+"»",
          opts:[{t:"Замінити "+(dir?"папку":"файл")+" в місці призначення", act:()=>{ wnDetach(clash); put(n, n.name); step(); }},
                {t:"Пропустити "+(dir?"цю папку":"цей файл"), act:step}],
          btns:[{t:"Скасувати", act:()=>{ queue.length=0; step(); }}]});
        return;
      }
      put(n, n.name);
    }
    wnFix();
    if(op==="move" && wn.clip && wn.clip.op==="cut") wn.clip=null;
    if(done) done(out, from);
    wnRender();
  };
  step();
}
function wnPaste(destId, sf){
  if(!wn.clip) return;
  const c=wn.clip;
  wnTransfer(c.ids, destId, c.op==="cut" ? "move" : "copy", ids=>{
    const h=sf && wnHold(sf); if(h && ids.length){ h.sel=ids.slice(); h.anc=ids[0]; }
  });
}
function wnCopyTo(ids, key, op){ wnTransfer(ids, wn.sp[key], op); }

/* ---- вікна ---- */
function wnAdd(w){
  w.id=++wn.wseq; w.z=++wn.z; w.born=Date.now(); w.min=false;
  wn.wins.push(w); wn.act=w.id;
  return w;
}
function wnTop(){
  const v=wn.wins.filter(w=>!w.min).sort((a,b)=>b.z-a.z);
  return v.length ? v[0].id : null;
}
function wnFocus(id){
  const w=wnWin(id); if(!w) return;
  w.min=false;
  if(wn.act!==id || w.z!==wn.z) w.z=++wn.z;
  wn.act=id; wn.hid=null;
}
function wnClose(id){
  const w=wnWin(id); if(!w) return;
  if(w.kind==="app" && w.dirty){ wnNotepadAsk(w, ()=>wnClose(id)); return; }
  wn.wins=wn.wins.filter(x=>x!==w && !((x.kind==="dlg" && x.d.owner===id) || (x.kind==="save" && x.owner===id)));
  if(wn.edit && wn.edit.sf==="w"+id) wn.edit=null;
  if(wn.act===id) wn.act=wnTop();
}
function wnMin(id){ const w=wnWin(id); if(!w) return; w.min=true; if(wn.act===id) wn.act=wnTop(); }
function wnMax(id){ const w=wnWin(id); if(w && w.kind!=="dlg" && w.kind!=="props" && w.kind!=="save") w.max=!w.max; }
function wnNewTab(loc){ return {loc, back:[], fwd:[], sel:[], anc:null, q:"", addr:false}; }
function wnSpot(W,H,n){
  const off=(n%7)*26;
  return {x:Math.max(0,Math.min(wnW()-W, Math.round((wnW()-W)/2)-120+off)), y:Math.max(0,Math.min(wnH()-wnTB()-H, 24+off))};
}
function wnOpenExplorer(loc){
  const n=wn.wins.filter(w=>w.kind==="exp").length;
  const W=Math.min(1040, wnW()-60), H=Math.min(600, wnH()-wnTB()-50), p=wnSpot(W,H,n);
  const w=wnAdd({kind:"exp", x:p.x, y:p.y, w:W, h:H, max:false, tabs:[wnNewTab(loc==null ? "quick" : loc)], ti:0,
    nav:true, pane:null, rtab:"home", open:new Set(["pc","quick"])});
  wnExpand(w, loc);
  wn.start=null;
  return w;
}
function wnOpenApp(app, fileId){
  if(app==="explorer") return wnOpenExplorer();
  if(app==="thispc") return wnOpenExplorer(wn.root.id);
  wn.start=null;
  if(fileId!=null){
    const same=wn.wins.find(w=>w.kind==="app" && w.file===fileId);
    if(same){ wnFocus(same.id); return same; }
    wn.recent=[fileId, ...wn.recent.filter(x=>x!==fileId)].slice(0,12);
  }
  const n=wn.wins.filter(w=>w.kind==="app").length;
  const W=Math.min(820, wnW()-80), H=Math.min(540, wnH()-wnTB()-40), p=wnSpot(W,H,n+2);
  const f=fileId!=null ? wn.by[fileId] : null;
  return wnAdd({kind:"app", app, file:fileId, x:p.x+80, y:p.y, w:W, h:H, max:false, text:f && f.text!=null ? f.text : "", dirty:false});
}
function wnOpenItem(id, sf){
  const n=wn.by[id]; if(!n) return;
  const w=sf && sf!=="desk" ? wnWin(+sf.slice(1)) : null;
  if(w && w.kind==="save" && n.kind==="file"){ w.fname=wnFull(n); wnSaveAs(w); return; }
  if(n.kind==="dir"){
    if(w) wnNav(w, id); else { const x=wnOpenExplorer(id); wnFocus(x.id); }
    return;
  }
  if(wnInBin(id)){ wnProps(id); return; }
  wnOpenApp(wnAppOf(n)||"notepad", id);
}
function wnProps(id){
  const n=wn.by[id]; if(!n || n.pc) return;
  const have=wn.wins.find(w=>w.kind==="props" && w.id2===id);
  if(have){ wnFocus(have.id); return; }
  const p=wnSpot(372,0,wn.wins.length);
  wnAdd({kind:"props", id2:id, x:p.x+200, y:Math.max(0,Math.min(40, wnH()-wnTB()-520)), w:372, h:0, max:false, ptab:0, val:wnFull(n)});
}
/* діалоги — маленькі вікна поверх усього; поки відкритий, решта не клацається */
function wnDialog(d){
  d.owner=wn.act;
  /* фокус — на діалог: Enter має натиснути його кнопку, а не поле позаду; після — повертаємо */
  const a=document.activeElement;
  if(wn.scr && a && wn.scr.contains(a) && a.getAttribute("data-fk")){ d.refocus=a.getAttribute("data-fk"); wn.scr.focus({preventScroll:true}); }
  const W=d.wide ? 520 : 420;
  wnAdd({kind:"dlg", d, x:Math.round((wnW()-W)/2), y:Math.round((wnH()-wnTB())/2)-150, w:W, h:0, max:false});
}
function wnDlgBtn(w, i){
  const b=w.d.btns[i], o=w.d.opts && i<0 ? w.d.opts[-i-1] : null;
  wn.wins=wn.wins.filter(x=>x!==w);
  wn.act=w.d.owner!=null && wnWin(w.d.owner) ? w.d.owner : wnTop();
  if(w.d.refocus && w.d.refocus!=="ren") wn.want=w.d.refocus;
  const f=o ? o.act : b && b.act;
  if(f) f();
}
function wnDeny(){
  wnDialog({title:"Відмовлено в доступі до папки", icon:"shield",
    text:"Щоб виконати цю дію, потрібен дозвіл.", btns:[{t:"Продовжити", shield:1}, {t:"Скасувати", def:1}]});
}
function wnNotepadAsk(w, then){
  const f=wn.by[w.file];
  wnDialog({title:"Блокнот", icon:null, main:"Зберегти зміни у файлі «"+esc(f ? wnReal(f.id) : "Без назви")+"»?",
    btns:[{t:"Зберегти", def:1, act:()=>wnNoteSave(w, false, then)}, {t:"Не зберігати", act:()=>{ w.dirty=false; then(); }}, {t:"Скасувати"}]});
}
function wnSaveNote(w){
  const f=wn.by[w.file]; if(!f) return;
  f.text=w.text; f.size=new Blob([w.text]).size; f.date=wnNow(); w.dirty=false;
}
/* «Зберегти» у файлу з ім'ям — мовчки, як у Windows; «Зберегти як…» і файл
   «Без назви» — через вікно збереження */
function wnNoteSave(w, as, then){
  const f=w.file!=null && wn.by[w.file] && !wnInBin(w.file);
  if(as || !f){ wnSaveDlg(w, then); return; }
  wnSaveNote(w);
  if(then) then();
}
function wnSaveDlg(note, then){
  const f=note.file!=null && wn.by[note.file] && !wnInBin(note.file) ? wn.by[note.file] : null;
  const loc=f ? wn.up[f.id] : wn.sp.docs, W=Math.min(820, wnW()-40), H=Math.min(540, wnH()-wnTB()-24);
  const w=wnAdd({kind:"save", owner:note.id, then, x:Math.round((wnW()-W)/2), y:Math.max(0, Math.round((wnH()-wnTB()-H)/2)), w:W, h:H, max:false,
    tabs:[wnNewTab(loc)], ti:0, nav:true, open:new Set(["pc","quick"]), ftype:"txt", fname:f ? wnFull(f) : wn.ver==="11" ? "Без назви.txt" : "*.txt"});
  wnExpand(w, loc);
  wn.want="sn"+w.id;
}
function wnSaveAs(w){
  const t=wnTab(w), note=wnWin(w.owner);
  let nm=String(w.fname||"").trim().replace(/[\s.]+$/,"");
  if(!nm || !note) return;
  if([...nm].some(c=>WN_BADCH.includes(c))){
    wnDialog({title:"Зберегти як", icon:"err", text:"Ім'я файлу неприпустиме.", btns:[{t:"OK", def:1}]});
    return;
  }
  const ok=t.q ? 0 : wnWritable(t.loc);
  if(ok<=0){ if(ok<0) wnDeny(); return; }
  if(w.ftype==="txt" && !/\.txt$/i.test(nm)) nm+=".txt";
  const dir=wn.by[t.loc], ex=dir.kids.find(k=>wnKey(k)===nm.toLowerCase());
  if(ex && ex.kind==="dir"){ wnNav(w, ex.id); return; }
  const go=()=>{
    let f=ex;
    if(!f){
      const i=nm.lastIndexOf(".");
      f={id:++wn.seq, name:i>0 ? nm.slice(0,i) : nm, ext:i>0 ? nm.slice(i+1) : "", kind:"file", made:wnNow()};
      dir.kids.push(f); wnIndex();
      if(dir===wn.desk) wnPlace(f.id);
    }
    note.file=f.id; wnSaveNote(note);
    wn.recent=[f.id, ...wn.recent.filter(x=>x!==f.id)].slice(0,12);
    wnClose(w.id); wnFocus(note.id);
    if(w.then) w.then();
  };
  if(ex) wnDialog({title:"Підтвердження збереження", icon:"warn", main:"«"+esc(nm)+"» уже існує.", text:"Замінити його?",
    btns:[{t:"Так", act:go}, {t:"Ні", def:1}]});
  else go();
}
/* «Показати робочий стіл» (Win + D і смужка праворуч від годинника): ще раз — повертає вікна */
function wnShowDesk(){
  const vis=wn.wins.filter(w=>!w.min && w.kind!=="dlg");
  if(vis.length){ wn.hid=vis.map(w=>w.id); vis.forEach(w=>{ w.min=true; }); wn.act=null; }
  else if(wn.hid){ wn.hid.forEach(id=>{ const w=wnWin(id); if(w) w.min=false; }); wn.hid=null; wn.act=wnTop(); }
}
/* кнопка програми на панелі завдань */
function wnAppKey(w){ return w.kind==="exp" ? "explorer" : w.kind==="app" ? w.app : null; }
function wnTask(app){
  const ws=wn.wins.filter(w=>wnAppKey(w)===app).sort((a,b)=>b.z-a.z);
  if(!ws.length){ wnOpenApp(app); return; }
  const a=wnWin(wn.act);
  if(a && wnAppKey(a)===app && !a.min){
    if(ws.length===1) wnMin(a.id);
    else wnFocus(ws[ws.length-1].id);
  } else wnFocus(ws[0].id);
}

/* ---- навігація в Провіднику ---- */
function wnExpand(w, loc){
  if(typeof loc!=="number") return;
  wnPath(loc).slice(0,-1).forEach(x=>w.open.add(x===wn.root.id ? "pc" : String(x)));
}
function wnNav(w, loc, how){
  const t=wnTab(w);
  if(!wnLocOk(loc)) return;
  if(loc===t.loc && !t.q && !how){ t.sel=[]; return; }
  if(how!=="hist"){ t.back.push(t.loc); t.fwd=[]; }
  t.loc=loc; t.sel=[]; t.anc=null; t.q=""; t.addr=false;
  if(wn.edit && wn.edit.sf==="w"+w.id) wn.edit=null;
  wnExpand(w, loc);
}
function wnBack(w){ const t=wnTab(w); if(!t.back.length) return; const from=t.loc; t.fwd.push(from); wnNav(w, t.back.pop(), "hist"); wnTab(w).sel=typeof from==="number" && wn.up[from]===wnTab(w).loc ? [from] : []; }
function wnFwd(w){ const t=wnTab(w); if(!t.fwd.length) return; t.back.push(t.loc); wnNav(w, t.fwd.pop(), "hist"); }
function wnUpLoc(loc){ return typeof loc==="number" && wn.up[loc]!=null ? wn.up[loc] : null; }
function wnUp(w){ const t=wnTab(w), p=wnUpLoc(t.loc); if(p==null) return; const from=t.loc; wnNav(w, p); wnTab(w).sel=[from]; wnTab(w).anc=from; }
/* введене в рядок адреси: C:\Users\Учень\Desktop, D:\Фото, «Документи», «Цей ПК» */
function wnResolve(s){
  const v=s.trim().replace(/[\\\/]+$/,"").replace(/\//g,"\\").toLowerCase();
  if(!v) return null;
  const named={"цей пк":wn.root.id, "this pc":wn.root.id, "кошик":wn.bin.id, "recycle bin":wn.bin.id,
    "швидкий доступ":"quick", "quick access":"quick", "головна":"quick", "home":"quick", "мережа":"net", "галерея":"gallery"};
  if(named[v]!=null) return named[v];
  for(const id in wn.by){
    const n=wn.by[id];
    if(n.kind!=="dir" || wnInBin(+id)) continue;
    if(wnReal(+id).toLowerCase().replace(/\\$/,"")===v.replace(/^([a-z]):$/,"$1:")) return +id;
  }
  const byName=Object.keys(wn.sp).map(k=>wn.by[wn.sp[k]]).find(n=>n.name.toLowerCase()===v);
  if(byName) return byName.id;
  if(/^[a-z]:$/.test(v)){ const d=wn.root.kids.find(n=>n.drive && n.drive.toLowerCase()===v[0]); if(d) return d.id; }
  return null;
}
