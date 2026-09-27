/* ---- розмітка ----
   Усе малюється рядками HTML із поточного стану. Кожне вікно має свій
   постійний корінь, а вміст перемальовується, лише коли рядок змінився, —
   тож прокрутка, фокус і анімації не скидаються на кожен клік. */
const WN_COLS={
  name:{h:"Ім'я", w:250},
  date:{h:"Дата змінення", w:136, v:n=>wnDt(n.date)},
  type:{h:"Тип", w:196, v:n=>wnType(n)},
  size:{h:"Розмір", w:90, r:1, v:n=>n.kind==="file" ? wnKB(n.size) : ""},
  orig:{h:"Вихідне розташування", w:230, v:n=>wnReal(n.orig)},
  del:{h:"Дата видалення", w:136, v:n=>wnDt(n.del)},
  where:{h:"Папка", w:250, v:n=>wnReal(wn.up[n.id])}
};
const WN_VPX={xl:160, large:96, medium:48, small:16, list:16, tiles:48, content:32};

function wnSet(el, h){ if(el._h!==h){ el.innerHTML=h; el._h=h; } }
function wnCaps(w, dlg){
  if(dlg) return '<span class="caps"><button class="cap x" data-a="close">'+wnG("x",10)+'</button></span>';
  return '<span class="caps"><button class="cap" data-a="min">'+wnG("min",10)+'</button>'+
    '<button class="cap" data-a="max">'+wnG(w.max?"rest":"max",10)+'</button>'+
    '<button class="cap x" data-a="close">'+wnG("x",10)+'</button></span>';
}
function wnRsz(w){ return w.max ? "" : ["n","s","e","w","ne","nw","se","sw"].map(d=>'<i class="rs rs-'+d+'" data-rs="'+d+'"></i>').join(""); }
function wnName(sf, n, line){
  const e=wn.edit;
  if(e && e.sf===sf && e.id===n.id)
    return '<textarea class="ren'+(line?" line":"")+'" data-fk="ren" rows="1" spellcheck="false" autocomplete="off">'+esc(e.val)+'</textarea>';
  return '<span class="nm">'+esc(wnFull(n))+'</span>';
}
function wnItCls(h, n, extra){
  const cut=wn.clip && wn.clip.op==="cut" && wn.clip.ids.includes(n.id);
  return "it"+(h.sel.includes(n.id)?" sel":"")+(cut?" cut":"")+(h.anc===n.id?" foc":"")+(n.kind==="dir"||n.bin?" fold":"")+(extra?" "+extra:"");
}
function wnBox(h, n){ return wn.boxes ? '<span class="cbx'+(h.sel.includes(n.id)?" on":"")+'" data-a="chk" data-v="'+n.id+'">'+wnG("check",10)+'</span>' : ""; }

/* ---- робочий стіл ---- */
function wnDeskHtml(){
  const c=wnCell(), p=id=>wn.pos[id]||[0,0];
  const items=wnDeskItems().slice().sort((a,b)=>p(a.id)[0]-p(b.id)[0] || p(a.id)[1]-p(b.id)[1]);
  return items.map(n=>'<div class="'+wnItCls(wn.dk,n,"di")+'" data-it="'+n.id+'" style="left:'+(4+p(n.id)[0]*c.w)+'px;top:'+(4+p(n.id)[1]*c.h)+'px;width:'+c.w+'px">'+
    '<span class="ic" style="height:'+c.i+'px">'+wnIco(n,c.i,true)+'</span>'+wnName("desk",n,0)+'</div>').join("");
}

/* ---- панель завдань ---- */
const WN_PINNED=["explorer","edge","store"];
function wnClock(){
  const d=new Date(), p=x=>String(x).padStart(2,"0");
  return d.getHours()+":"+p(d.getMinutes())+"<br>"+p(d.getDate())+"."+p(d.getMonth()+1)+"."+d.getFullYear();
}
function wnLogo(px){
  if(wn.ver==="11") return wnSvg(px,"0 0 16 16",'<g fill="url(#wnLogo11)">'+WN_WINLOGO+'</g>');
  return wnSvg(px,"0 0 16 16",'<g fill="currentColor">'+WN_WINLOGO+'</g>');
}
function wnBarHtml(){
  const act=wnWin(wn.act), ak=act && !act.min ? wnAppKey(act) : null;
  const apps=[...WN_PINNED, ...new Set(wn.wins.map(wnAppKey).filter(k=>k && !WN_PINNED.includes(k)))];
  const btn=app=>{
    const r=wn.wins.filter(w=>wnAppKey(w)===app).length;
    return '<button class="tbi'+(r?" run":"")+(r>1?" multi":"")+(ak===app?" act":"")+'" data-a="task" data-v="'+app+'" data-app="'+app+'">'+wnAppIco(app,24)+'</button>';
  };
  const tray=(v11)=>'<div class="tray"><button class="tri">'+wnG("chu",12)+'</button>'+
    (v11 ? '<button class="lng" data-a="lang" id="wnLang">'+wn.lang+'</button><span class="tri qs">'+wnG("wifi")+wnG("vol")+'</span>'
         : '<span class="tri">'+wnG("net")+'</span><span class="tri">'+wnG("vol")+'</span><button class="lng" data-a="lang" id="wnLang">'+wn.lang+'</button>')+
    '<span class="clk" id="wnClk">'+wnClock()+'</span><span class="tri">'+wnG(v11?"bell":"note")+'</span><button class="sdk" data-a="showdesk"></button></div>';
  if(wn.ver==="11")
    return '<div class="tbc"><button class="tbi st'+(wn.start && wn.start!=="search"?" act":"")+'" data-a="start">'+wnLogo(22)+'</button>'+
      '<button class="tsb'+(wn.start==="search"?" act":"")+'" data-a="tsearch">'+wnG("search",16)+'<span>Пошук</span></button>'+
      '<button class="tbi tv">'+wnG("taskv",20)+'</button>'+apps.map(btn).join("")+'</div>'+tray(1);
  return '<button class="tbs st'+(wn.start==="menu"?" act":"")+'" data-a="start">'+wnLogo(16)+'</button>'+
    '<label class="tsb" data-a="tsearch">'+wnG("search",16)+'<input data-fk="tsearch" value="'+esc(wn.sq)+'" placeholder="Введіть тут текст для пошуку" spellcheck="false" autocomplete="off"></label>'+
    '<button class="tbi tv">'+wnG("taskv",20)+'</button>'+apps.map(btn).join("")+tray(0);
}

/* ---- «Пуск» ---- */
const WN_S10=[["E",["excel"]],["M",["edge","store"]],["O",["onedrive"]],["P",["ppt"]],["W",["word"]],["К",["calc","camera"]],["П",["settings","mail"]],
  ["С",[{f:"Службові — Windows", k:["taskmgr","cmd","ctrl","explorer","thispc"]},{f:"Стандартні — Windows", k:["paint","notepad","snip"]}]],["Ф",["photos"]]];
const WN_T10=[["Продуктивність",[["word"],["excel"],["ppt"],["edge",2],["mail"],["photos"]]],["Огляд",[["store",2],["calc"],["camera"],["clock"]]]];
const WN_P11=["edge","word","excel","ppt","mail","store","photos","settings","calc","clock","notepad","paint","explorer","media","camera","snip","cmd","onedrive"];
const WN_A11=[["E",["excel"]],["M",["edge","store"]],["O",["onedrive"]],["P",["paint","ppt"]],["W",["word"]],["Б",["notepad"]],["Г",["clock"]],
  ["К",["calc","camera","cmd"]],["М",["media"]],["Н",["snip"]],["П",["settings","mail","explorer"]],["Ф",["photos"]]];
function wnStartHtml(){
  if(wn.ver==="11") return wnStart11();
  if(wn.start==="search") return wnSearchPanel();
  const it=(k,deep)=>'<button class="sa'+(deep?" deep":"")+'" data-a="app" data-v="'+k+'"><span class="sai">'+wnAppIco(k,24)+'</span>'+esc(WN_APPS[k].n)+'</button>';
  const list=WN_S10.map(g=>'<div class="sl">'+g[0]+'</div>'+g[1].map(x=>{
    if(typeof x==="string") return it(x);
    const o=!!wn.sfold[x.f];
    return '<button class="sa fo" data-a="sfold" data-v="'+esc(x.f)+'"><span class="sai fold">'+wnFolder(24,false)+'</span>'+esc(x.f)+'<span class="sch">'+wnG(o?"chu":"chd",10)+'</span></button>'+
      (o ? x.k.map(k=>it(k,1)).join("") : "");
  }).join("")).join("");
  const tiles=WN_T10.map(g=>'<div class="tgh">'+g[0]+'</div><div class="tg">'+g[1].map(t=>
    '<button class="tl'+(t[1]?" w2":"")+'" data-a="app" data-v="'+t[0]+'">'+wnAppIco(t[0],t[1]?40:36)+'<span>'+esc(WN_APPS[t[0]].n)+'</span></button>').join("")+'</div>').join("");
  const rb=(a,v,ic,t)=>'<button class="rl" data-a="'+a+'" data-v="'+v+'">'+ic+'<span>'+t+'</span></button>';
  return '<div class="s10'+(wn.srail?" rail":"")+'"><div class="rail">'+
      '<button class="rl" data-a="srail">'+wnG("ham")+'<span><b>ПУСК</b></span></button><span class="sp"></span>'+
      rb("","",wnSvg(20,"0 0 32 32",WN_APPI.user),"Учень")+rb("sloc","docs",wnG("note"),"Документи")+rb("sloc","pics",wnG("pic"),"Зображення")+
      rb("app","settings",wnG("gear"),"Параметри")+rb("power","",wnG("power"),"Живлення")+'</div>'+
    '<div class="sl-list" data-sk="s10l">'+list+'</div><div class="tiles" data-sk="s10t">'+tiles+'</div></div>';
}
function wnStart11(){
  const q='<div class="s11q'+(wn.start==="search"?" on":"")+'">'+wnG("search",16)+'<input data-fk="ssearch" value="'+esc(wn.sq)+'" placeholder="Пошук програм, параметрів і документів" spellcheck="false" autocomplete="off"></div>';
  const foot='<div class="s11f"><button class="usr">'+wnSvg(28,"0 0 32 32",WN_APPI.user)+'<span>Учень</span></button><button class="pw" data-a="power">'+wnG("power",16)+'</button></div>';
  if(wn.start==="search") return '<div class="s11">'+q+wnSearchPanel()+'</div>';
  if(wn.start==="all"){
    const list=WN_A11.map(g=>'<div class="sl">'+g[0]+'</div>'+g[1].map(k=>'<button class="sa" data-a="app" data-v="'+k+'">'+wnAppIco(k,24)+esc(WN_APPS[k].n)+'</button>').join("")).join("");
    return '<div class="s11">'+q+'<div class="s11h"><b>Усі програми</b><button class="sm" data-a="sback">'+wnG("chl",10)+' Назад</button></div>'+
      '<div class="s11all" data-sk="s11a">'+list+'</div>'+foot+'</div>';
  }
  const pins=WN_P11.map(k=>'<button class="pi" data-a="app" data-v="'+k+'">'+wnAppIco(k,32)+'<span>'+esc(WN_APPS[k].n)+'</span></button>').join("");
  const rec=wn.recent.slice(0,6).map(id=>wn.by[id]).filter(Boolean).map(n=>
    '<button class="rc" data-a="sopen" data-v="'+n.id+'">'+wnIco(n,32)+'<span><b>'+esc(wnFull(n))+'</b><small>'+esc(wnDt(n.date).slice(0,10))+'</small></span></button>').join("");
  return '<div class="s11">'+q+'<div class="s11h"><b>Закріплені</b><button class="sm" data-a="sall">Усі програми '+wnG("chr",10)+'</button></div>'+
    '<div class="s11p">'+pins+'</div><div class="s11h"><b>Рекомендовані</b><button class="sm">Більше '+wnG("chr",10)+'</button></div>'+
    '<div class="s11r">'+(rec||'<p class="s11n">Щойно ви відкриєте файли, вони з\'являться тут.</p>')+'</div>'+foot+'</div>';
}
/* пошук: програми за іменем і ключовими словами, папки й файли — за початком імені */
function wnFind(q){
  q=q.trim().toLowerCase();
  if(!q) return [];
  const apps=Object.keys(WN_APPS).filter(k=>{
    const a=WN_APPS[k], words=(a.n+" "+a.kw).toLowerCase().split(/\s+/);
    return a.n.toLowerCase().startsWith(q) || words.some(x=>x.startsWith(q)) || (q.length>2 && a.kw.includes(q));
  }).map(k=>({kind:"app", k, name:WN_APPS[k].n, sub:"Програма"}));
  const dirs=[], files=[];
  (function walk(n){ (n.kids||[]).forEach(k=>{
    if(wnAdm(k.id)) return;
    if(wnFull(k,true).toLowerCase().startsWith(q) || k.name.toLowerCase().split(/[\s_]+/).some(x=>x.startsWith(q)))
      (k.kind==="dir" ? dirs : files).push({kind:k.kind, id:k.id, name:wnFull(k,true), sub:k.kind==="dir" ? "Папка файлів" : wnType(k)});
    if(k.kind==="dir") walk(k);
  }); })(wn.root);
  return [...apps, ...dirs.slice(0,4), ...files.slice(0,4)];
}
function wnResIco(r, px){ return r.kind==="app" ? wnAppIco(r.k,px) : wnIco(wn.by[r.id],px); }
function wnSearchPanel(){
  const q=wn.sq.trim(), res=wnFind(q), v11=wn.ver==="11";
  const tabs='<div class="sr-tabs"><b>Усі</b><span>Програми</span><span>Документи</span><span>Інтернет</span>'+(v11?'<span>Параметри</span><span>Папки</span>':'<span>Інше '+wnG("chd",10)+'</span>')+'</div>';
  if(!q){
    const top=["edge","word","paint","calc","settings"].map(k=>'<button class="sr-top" data-a="app" data-v="'+k+'">'+wnAppIco(k,32)+'<span>'+esc(WN_APPS[k].n)+'</span></button>').join("");
    return '<div class="sr">'+tabs+'<div class="sr-e"><div class="sr-h">Основні програми</div><div class="sr-tops">'+top+'</div>'+
      '<div class="sr-h">Останні</div>'+wn.recent.slice(0,4).map(id=>wn.by[id]).filter(Boolean).map(n=>
        '<button class="sr-it" data-a="sopen" data-v="'+n.id+'">'+wnIco(n,20)+'<span><b>'+esc(wnFull(n))+'</b></span></button>').join("")+'</div></div>';
  }
  if(!res.length){
    return '<div class="sr">'+tabs+'<div class="sr-b"><div class="sr-l"><div class="sr-h">Шукати в Інтернеті</div>'+
      '<button class="sr-it best" data-a="app" data-v="edge">'+wnG("search",20)+'<span><b>'+esc(q)+'</b><small>Переглянути результати з Інтернету</small></span></button></div>'+
      '<div class="sr-r">'+wnG("search",48)+'<b>'+esc(q)+'</b><small>Переглянути результати з Інтернету</small><div class="sr-acts"><button data-a="app" data-v="edge">'+wnG("open")+'Відкрити в браузері</button></div></div></div></div>';
  }
  const b=res[0], rest=res.slice(1);
  const it=(r,i)=>'<button class="sr-it'+(i===0?" best":"")+'" data-a="sres" data-v="'+i+'">'+wnResIco(r,i===0?32:20)+'<span><b>'+esc(r.name)+'</b>'+(i===0||r.kind!=="app"?'<small>'+esc(i===0?r.sub:r.kind==="app"?"":wnReal(wn.up[r.id]))+'</small>':'')+'</span></button>';
  const grp=(h,list)=>list.length ? '<div class="sr-h">'+h+'</div>'+list.map(x=>it(x[0],x[1])).join("") : "";
  const idx=rest.map((r,i)=>[r,i+1]);
  return '<div class="sr">'+tabs+'<div class="sr-b"><div class="sr-l" data-sk="srl">'+grp("Найкраща відповідність",[[b,0]])+
    grp("Програми", idx.filter(x=>x[0].kind==="app"))+grp("Папки", idx.filter(x=>x[0].kind==="dir"))+grp("Документи", idx.filter(x=>x[0].kind==="file"))+'</div>'+
    '<div class="sr-r">'+wnResIco(b,64)+'<b>'+esc(b.name)+'</b><small>'+esc(b.sub)+'</small>'+
      (b.kind!=="app"?'<small class="loc">'+esc(wnReal(wn.up[b.id]))+'</small>':'')+
      '<div class="sr-acts"><button data-a="sres" data-v="0">'+wnG("open")+'Відкрити</button>'+
      (b.kind!=="app"?'<button data-a="sloc2" data-v="'+b.id+'">'+wnG("open")+'Відкрити розташування файлу</button>':'')+'</div></div></div></div>';
}

/* ---- вікна ---- */
function wnTitle(w){
  const t=wnTab(w);
  return t.q ? "Результати пошуку в «"+wnLocName(t.loc)+"»" : wnLocName(t.loc);
}
function wnWinHtml(w){
  if(w.kind==="exp") return wnExpHtml(w);
  if(w.kind==="app") return wnAppHtml(w);
  if(w.kind==="props") return wnPropsHtml(w);
  if(w.kind==="save") return wnSaveHtml(w);
  return wnDlgHtml(w);
}
function wnRenderWins(){
  const box=wn.scr.querySelector("#wnWins"), seen=new Set(), now=Date.now();
  const dlg=wnModal();
  for(const w of wn.wins){
    let el=box.querySelector(':scope > [data-w="'+w.id+'"]');
    if(!el){ el=document.createElement("div"); el.setAttribute("data-w", w.id); box.appendChild(el); }
    const H=wnH()-wnTB();
    el.className="wn-win k-"+w.kind+(w.kind==="app"?" a-"+w.app:"")+(wn.act===w.id?" act":"")+(w.max?" max":"")+(w.min?" min":"")+(now-w.born<260?" born":"");
    el.style.cssText = w.max ? "left:0;top:0;width:"+wnW()+"px;height:"+H+"px;z-index:"+w.z
      : "left:"+w.x+"px;top:"+w.y+"px;width:"+w.w+"px;"+(w.h?"height:"+w.h+"px;":"")+"z-index:"+w.z;
    wnSet(el, wnWinHtml(w));
    seen.add(el);
  }
  let bl=box.querySelector(":scope > .wn-block");
  if(dlg){ if(!bl){ bl=document.createElement("div"); bl.className="wn-block"; box.appendChild(bl); } bl.style.zIndex=dlg.z-1; seen.add(bl); }
  [...box.children].forEach(el=>{ if(!seen.has(el)) el.remove(); });
}

/* ---- Провідник ---- */
function wnFlags(w){
  const t=wnTab(w), loc=t.loc, sel=t.sel.map(id=>wn.by[id]).filter(Boolean);
  const wr=!t.q && wnWritable(loc)!==0, lock=sel.some(n=>n.lock), inBin=loc===wn.bin.id;
  return {t, loc, sel, any:sel.length>0, one:sel.length===1, wr, lock, inBin,
    canCut:sel.length>0 && !lock && !inBin, canDel:sel.length>0 && !lock, canRen:sel.length===1 && !lock && !inBin,
    canPaste:!!wn.clip && wr, canPin:(sel.length===1 && sel[0].kind==="dir" && !inBin) || (!sel.length && typeof loc==="number" && !inBin)};
}
function wnExpHtml(w){
  const t=wnTab(w);
  const body='<div class="x-bd">'+(w.nav?'<div class="x-nav" data-sk="nav'+w.id+'">'+wnNavHtml(w)+'</div>':'')+
    '<div class="x-ct" data-sf="w'+w.id+'" data-sk="ct'+w.id+'-'+t.loc+'-'+t.q+'">'+wnContentHtml(w)+'</div>'+(w.pane?wnPaneHtml(w):'')+'</div>';
  if(wn.ver==="11") return wnTabs11(w)+wnAddr(w)+wnCmd11(w)+body+wnStatus(w)+wnRsz(w);
  return wnTitle10(w)+wnRibbon10(w)+wnAddr(w)+body+wnStatus(w)+wnRsz(w);
}
function wnTitle10(w){
  return '<div class="x-tb" data-drag="1"><span class="qat">'+wnAppIco("explorer",16)+'<i class="qs"></i>'+
    '<button class="qb" data-a="props">'+wnG("props")+'</button><button class="qb" data-a="newdir">'+wnG("newdir")+'</button>'+
    '<button class="qb nar">'+wnG("chd",8)+'</button><i class="qs"></i></span>'+
    '<span class="tt">'+esc(wnTitle(w))+'</span>'+wnCaps(w)+'</div>';
}
function wnTabs11(w){
  return '<div class="x-tabs" data-drag="1">'+w.tabs.map((t,i)=>
    '<div class="tab'+(i===w.ti?" on":"")+'" data-a="tab" data-v="'+i+'">'+wnLocIco(t.loc,16)+'<span class="tn">'+esc(t.q?"Результати пошуку":wnLocName(t.loc))+'</span>'+
    '<button class="tx" data-a="tabx" data-v="'+i+'">'+wnG("x",8)+'</button></div>').join("")+
    '<button class="tadd" data-a="tabnew">'+wnG("add",12)+'</button><span class="sp"></span>'+wnCaps(w)+'</div>';
}
/* великі значки стрічки — ті самі гліфи, але кольорові й удвічі більші */
function wnBI(g, c){ return '<span class="bi '+(c||"")+'">'+wnG(g,32)+'</span>'; }
function wnRibbon10(w){
  const f=wnFlags(w);
  if(w.rtab==="bin" && !f.inBin) w.rtab="home";
  const tabs=[["home","Основне"],["share","Спільний доступ"],["view","Вигляд"]];
  if(f.inBin) tabs.push(["bin","Керування"]);
  const open=!w.rmin || w.rpop;
  let h='<div class="rt'+(f.inBin?" ctxon":"")+'"><button class="rf" data-a="filemenu">Файл</button>'+
    tabs.map(x=>'<button class="rtb'+(open && w.rtab===x[0]?" on":"")+(x[0]==="bin"?" ctx":"")+'" data-a="rtab" data-v="'+x[0]+'">'+
      (x[0]==="bin"?'<i>Засоби кошика</i>':'')+x[1]+'</button>').join("")+
    '<span class="sp"></span><button class="rmn" data-a="rmin">'+wnG(w.rmin?"chd":"chu",10)+'</button><span class="rhelp">?</span></div>';
  if(open) h+='<div class="rb'+(w.rpop?" pop":"")+'">'+wnRibbonBody(w,f)+'</div>';
  return h;
}
function wnRibbonBody(w, f){
  const B=(a,ic,label,dis,v,on)=>'<button class="rbb'+(on?" on":"")+'" data-a="'+a+'"'+(v!=null?' data-v="'+v+'"':'')+(dis?" disabled":"")+'>'+ic+'<span>'+label+'</span></button>';
  const S=(a,g,label,dis,v,on)=>'<button class="rbs'+(on?" on":"")+'" data-a="'+a+'"'+(v!=null?' data-v="'+v+'"':'')+(dis?" disabled":"")+'>'+wnG(g)+'<span>'+label+'</span></button>';
  const C=(k,label,on)=>'<button class="rbs rck" data-a="opt" data-v="'+k+'"><span class="ck'+(on?" on":"")+'">'+(on?wnG("check",10):"")+'</span><span>'+label+'</span></button>';
  const G=(label, inner)=>'<div class="rbg"><div class="rbgb">'+inner+'</div><div class="rbgl">'+label+'</div></div>';
  const col=x=>'<div class="rbc">'+x+'</div>';
  const dd=' <small>'+wnG("chd",8)+'</small>';
  if(w.rtab==="share") return G("Надіслати", B("",wnBI("share","c-bl"),"Поділитися",!f.any)+B("",wnBI("mail","c-bl"),"Надіслати поштою",!f.any)+B("",wnBI("zip","c-ye"),"Стиснути (ZIP)",!f.any)+
      col(S("","disc","Записати на диск",!f.any)+S("","print","Друк",1)+S("","print","Факс",1)))+
    G("Спільний доступ", B("",wnBI("user","c-bl"),"Конкретні люди…",!f.any)+B("",wnBI("shield","c-ye"),"Додаткові параметри безпеки",!f.any));
  if(w.rtab==="view"){
    const cur=wnViewOf(f.loc), vis=typeof f.loc==="number" && !wn.by[f.loc].pc || f.t.q;
    return G("Панелі", B("navm",wnBI("pane","c-bl"),"Область переходів"+dd)+col(S("pane","eye","Область перегляду",0,"preview",w.pane==="preview")+S("pane","props","Панель відомостей",0,"details",w.pane==="details")))+
      G("Макет", '<div class="rbl">'+WN_VIEWS.map(v=>'<button class="rbv'+(vis&&cur===v[0]?" on":"")+'" data-a="view" data-v="'+v[0]+'"'+(vis?"":" disabled")+'>'+wnG({xl:"vbig",large:"vbig",medium:"vbig",small:"vlist",list:"vlist",details:"vdet",tiles:"vtile",content:"vtile"}[v[0]])+v[1]+'</button>').join("")+'</div>')+
      G("Поточне подання", B("sortm",wnBI("sort","c-bl"),"Сортувати за"+dd,!vis)+col(S("","vlist","Групувати за",1)+S("","add","Додати стовпці",1)+S("","vdet","Припасувати всі стовпці",1)))+
      G("Показати або приховати", col(C("boxes","Прапорці елементів",wn.boxes)+C("ext","Розширення імен файлів",wn.showExt)+C("hidden","Приховані елементи",!!wn.hidden))+
        B("",wnBI("eye"),"Приховати вибрані елементи",1)+B("",wnBI("gear"),"Параметри",1));
  }
  if(w.rtab==="bin") return G("Керування", B("emptybin",'<span class="bi">'+WN_I.bin(32,true)+'</span>',"Очистити кошик",!wn.bin.kids.length)+B("",'<span class="bi">'+WN_I.bin(32,false)+'</span>',"Властивості кошика",1))+
    G("Відновити", B("restoreall",wnBI("restore","c-bl"),"Відновити всі елементи",!wn.bin.kids.length)+B("restore",wnBI("restore","c-gr"),"Відновити вибрані елементи",!f.any));
  return G("Буфер обміну", B("pin",wnBI("pin","c-bl"),"Закріпити на панелі швидкого доступу",!f.canPin)+B("copy",wnBI("copy","c-bl"),"Копіювати",!f.any)+B("paste",wnBI("paste","c-br"),"Вставити",!f.canPaste)+
      col(S("cut","cut","Вирізати",!f.canCut)+S("copypath","copy","Копіювати шлях",!f.any)+S("","paste","Вставити ярлик",1)))+
    G("Упорядкувати", B("movem",wnBI("moveto","c-ye"),"Перемістити до"+dd,!f.canCut)+B("copym",wnBI("copyto","c-ye"),"Копіювати до"+dd,!f.any||f.inBin)+
      B("del",wnBI("x","c-rd"),"Видалити"+dd,!f.canDel)+B("ren",wnBI("ren","c-bl"),"Перейменувати",!f.canRen))+
    G("Створити", B("newdir",'<span class="bi">'+wnFolder(32,false)+'</span>',"Нова папка",!f.wr)+col(S("newm","note","Новий елемент"+dd,!f.wr)+S("","share","Простий доступ"+dd,1)))+
    G("Відкрити", B("props",wnBI("props","c-bl"),"Властивості"+dd,!(f.any || typeof f.loc==="number" && !wn.by[f.loc].pc))+
      col(S("open","open","Відкрити"+dd,!f.one)+S("","edit","Редагувати",1)+S("","hist","Журнал",1)))+
    G("Виділити", col(S("selall","selall","Виділити все")+S("selnone","selnone","Скасувати виділення",!f.any)+S("selinv","selinv","Інвертувати виділення")));
}
function wnCmd11(w){
  const f=wnFlags(w);
  const I=(a,g,dis,title)=>'<button class="ci" data-a="'+a+'"'+(dis?" disabled":"")+' title="'+title+'">'+wnG(g)+'</button>';
  const vis=typeof f.loc==="number" && !wn.by[f.loc].pc || f.t.q;
  let h='<div class="x-cmd"><button class="cb nw" data-a="newm"'+(f.wr?"":" disabled")+'><span class="pl">'+wnG("plus")+'</span>Створити'+wnG("chd",10)+'</button><i class="cs"></i>'+
    I("cut","cut",!f.canCut,"Вирізати (Ctrl+X)")+I("copy","copy",!f.any,"Копіювати (Ctrl+C)")+I("paste","paste",!f.canPaste,"Вставити (Ctrl+V)")+
    I("ren","ren",!f.canRen,"Перейменувати (F2)")+I("","share",!f.any,"Поділитися")+I("del","del",!f.canDel,"Видалити (Delete)")+'<i class="cs"></i>'+
    '<button class="cb" data-a="sortm"'+(vis?"":" disabled")+'>'+wnG("sort")+'Сортувати'+wnG("chd",10)+'</button>'+
    '<button class="cb" data-a="viewm"'+(vis?"":" disabled")+'>'+wnG("view")+'Переглянути'+wnG("chd",10)+'</button>';
  if(f.inBin) h+='<i class="cs"></i><button class="cb" data-a="emptybin"'+(wn.bin.kids.length?"":" disabled")+'>'+WN_I.bin(16,true)+'Очистити кошик</button>'+
    '<button class="cb" data-a="restoreall"'+(wn.bin.kids.length?"":" disabled")+'>'+wnG("restore")+'Відновити всі елементи</button>';
  return h+'<button class="ci" data-a="more">'+wnG("more")+'</button><span class="sp"></span>'+
    '<button class="cb'+(w.pane==="details"?" on":"")+'" data-a="pane" data-v="details">'+wnG("pane")+'Відомості</button></div>';
}
function wnAddrText(t){
  if(typeof t.loc!=="number") return wnLocName(t.loc);
  return wnReal(t.loc) || wnLocName(t.loc);
}
function wnCrumbs(w){
  const t=wnTab(w), sep=v=>'<button class="as" data-a="crumbm" data-v="'+v+'">'+wnG("chr",10)+'</button>';
  if(t.q) return sep("")+'<button class="ac" data-a="crumb" data-v="'+t.loc+'">Результати пошуку в «'+esc(wnLocName(t.loc))+'»</button>';
  if(typeof t.loc!=="number" || t.loc===wn.bin.id) return sep("")+'<button class="ac" data-a="crumb" data-v="'+t.loc+'">'+esc(wnLocName(t.loc))+'</button>';
  return wnPath(t.loc).map(id=>sep(wn.up[id]==null?"":wn.up[id])+'<button class="ac" data-a="crumb" data-v="'+id+'">'+esc(wn.by[id].name)+'</button>').join("");
}
function wnAddr(w){
  const t=wnTab(w), v11=wn.ver==="11";
  const nb=(a,g,dis)=>'<button class="nb" data-a="'+a+'"'+(dis?" disabled":"")+'>'+wnG(g)+'</button>';
  const inner = t.addr ? '<input class="ain" data-fk="addr'+w.id+'" value="'+esc(t.addrv!=null ? t.addrv : wnAddrText(t))+'" spellcheck="false" autocomplete="off">'
    : '<div class="acr" data-a="addr"><span class="ai">'+wnLocIco(t.loc,16)+'</span>'+wnCrumbs(w)+'</div>';
  const box='<div class="abox'+(t.addr?" ed":"")+'">'+inner+(v11?'':'<button class="ab" data-a="addrm">'+wnG("chd",10)+'</button><button class="ab" data-a="refresh">'+wnG("refresh",12)+'</button>')+'</div>';
  const sbox='<label class="sbox">'+(v11?wnG("search",14):'')+'<input data-fk="q'+w.id+'" value="'+esc(t.q)+'" placeholder="Пошук: '+esc(wnLocName(t.loc))+'" spellcheck="false" autocomplete="off">'+(v11?'':wnG("search",14))+'</label>';
  const up=wnUpLoc(t.loc)==null || !!t.q;
  if(v11) return '<div class="x-ad">'+nb("back","back",!t.back.length)+nb("fwd","fwd",!t.fwd.length)+nb("up","up",up)+nb("refresh","refresh")+box+sbox+'</div>';
  return '<div class="x-ad">'+nb("back","back",!t.back.length)+nb("fwd","fwd",!t.fwd.length)+
    '<button class="nb sm" data-a="recent"'+(t.back.length||t.fwd.length?"":" disabled")+'>'+wnG("chd",8)+'</button>'+nb("up","up",up)+box+sbox+'</div>';
}
function wnNavHtml(w){
  const t=wnTab(w), cur=t.q ? null : t.loc;
  const row=(key, depth, ico, label, loc, kids, pin)=>{
    const open=w.open.has(key);
    return '<div class="nv'+(loc===cur?" cur":"")+'" data-a="nav" data-v="'+loc+'"'+(typeof loc==="number"?' data-nv="'+loc+'"':'')+' style="padding-left:'+(4+depth*16)+'px">'+
      '<span class="tw"'+(kids?' data-a="tog" data-v="'+key+'"':'')+'>'+(kids?wnG(open?"chd":"chr",10):"")+'</span>'+ico+
      '<span class="nm">'+esc(label)+'</span>'+(pin?'<span class="pn">'+wnG("pin",12)+'</span>':'')+'</div>';
  };
  const tree=(n, depth)=>{
    const kids=wnSorted(n.kids.filter(k=>k.kind==="dir"), {by:"name", dir:1}), key=n===wn.root ? "pc" : String(n.id);
    let h=row(key, depth, wnIco(n,16), n.name, n.id, kids.length>0);
    if(w.open.has(key)) kids.forEach(k=>{ h+=tree(k, depth+1); });
    return h;
  };
  const pins=d=>wn.pins.map(id=>wn.by[id]).filter(Boolean).map(n=>row("p"+n.id, d, wnIco(n,16), n.name, n.id, false, 1)).join("");
  if(wn.ver==="11")
    return row("home",0,WN_I.home(16),"Головна","quick")+row("gal",0,WN_I.gallery(16),"Галерея","gallery")+
      '<div class="nsep"></div>'+pins(0)+'<div class="nsep"></div>'+tree(wn.root,0)+row("net",0,WN_I.net(16),"Мережа","net");
  return row("quick",0,WN_I.star(16),"Швидкий доступ","quick",wn.pins.length>0)+(w.open.has("quick")?pins(1):"")+
    '<div class="nsp"></div>'+row("od",0,WN_I.cloud(16),"OneDrive","net")+'<div class="nsp"></div>'+tree(wn.root,0)+'<div class="nsp"></div>'+row("net",0,WN_I.net(16),"Мережа","net");
}
/* усе, що зараз видно у вмісті вікна, — у тому самому порядку */
function wnShown(w){
  const t=wnTab(w), loc=t.loc;
  if(t.q) return wnSearchIn(loc, t.q);
  if(loc==="quick") return [...wn.pins, ...wn.recent].map(id=>wn.by[id]).filter(Boolean);
  if(loc==="net") return [];
  if(loc==="gallery"){ const out=[]; (function walk(n){ n.kids.forEach(k=>{ if(k.kind==="dir") walk(k); else if(k.ext==="png"||k.ext==="bmp") out.push(k); }); })(wn.by[wn.sp.pics]); return out; }
  const n=wn.by[loc];
  if(n.pc) return [...wnSorted(n.kids.filter(k=>!k.drive),{by:"name",dir:1}), ...n.kids.filter(k=>k.drive)];
  return wnSorted(n.links ? [...n.kids, ...n.links.map(id=>wn.by[id])] : n.kids, wnSortOf(loc));
}
function wnSearchIn(loc, q){
  q=q.trim().toLowerCase();
  const base=typeof loc==="number" && !wn.by[loc].pc ? wn.by[loc] : wn.root, out=[];
  (function walk(n){ (n.kids||[]).forEach(k=>{ if(wnFull(k,true).toLowerCase().includes(q)) out.push(k); if(k.kind==="dir" && !k.bin) walk(k); }); })(base);
  return wnSorted(out, wnSortOf(loc));
}
function wnContentHtml(w){
  const t=wnTab(w), loc=t.loc;
  if(t.q) return wnItemsHtml(w, wnShown(w), "details", "search");
  if(loc==="quick") return wnQuickHtml(w);
  if(loc==="net") return '<div class="x-bar">Мережеве виявлення вимкнуто. Мережеві комп\'ютери й пристрої не відображаються. Клацніть, щоб змінити…</div>';
  if(loc==="gallery") return wnItemsHtml(w, wnShown(w), wnViewOf(loc), "std");
  const n=wn.by[loc];
  if(n.pc) return wnPcHtml(w);
  return wnItemsHtml(w, wnShown(w), wnViewOf(loc), n.bin ? "bin" : "std");
}
function wnGrp(h, n, inner){ return '<div class="x-grp"><div class="gh">'+wnG("chd",10)+'<span>'+h+' ('+n+')</span><i></i></div>'+inner+'</div>'; }
function wnTile(w, n, sub, bar){
  const t=wnTab(w);
  return '<div class="'+wnItCls(t,n,"tile")+'" data-it="'+n.id+'">'+wnBox(t,n)+'<span class="ic">'+wnIco(n,48,true)+'</span><span class="tx">'+wnName("w"+w.id,n,1)+
    (bar!=null?'<span class="ub"><i style="width:'+Math.round(bar*100)+'%"></i></span>':'')+(sub?'<small>'+sub+'</small>':'')+'</span></div>';
}
function wnPcHtml(w){
  const f=wnSorted(wn.root.kids.filter(k=>!k.drive), {by:"name", dir:1}), d=wn.root.kids.filter(k=>k.drive);
  return wnGrp("Папки", f.length, '<div class="x-tiles">'+f.map(n=>wnTile(w,n)).join("")+'</div>')+
    wnGrp("Пристрої та диски", d.length, '<div class="x-tiles">'+d.map(n=>wnTile(w,n,wnNum.format(Math.round(n.free))+" ГБ вільно з "+n.cap+" ГБ",(n.cap-n.free)/n.cap)).join("")+'</div>');
}
function wnQuickHtml(w){
  const t=wnTab(w), sf="w"+w.id, pins=wn.pins.map(id=>wn.by[id]).filter(Boolean), rec=wn.recent.map(id=>wn.by[id]).filter(Boolean);
  const tiles='<div class="x-tiles q">'+pins.map(n=>wnTile(w,n,esc(wn.up[n.id]!=null?wnLocName(wn.up[n.id]):"")+" "+wnG("pin",10))).join("")+'</div>';
  const rows=rec.map(n=>'<div class="'+wnItCls(t,n,"xr")+'" data-it="'+n.id+'"><span class="c nmc">'+wnBox(t,n)+wnIco(n,16)+wnName(sf,n,1)+'</span>'+
    (wn.ver==="11"?'<span class="c">'+esc(wnDt(n.date))+'</span>':'')+'<span class="c">'+esc(wnReal(wn.up[n.id]))+'</span></div>').join("");
  const tpl=wn.ver==="11" ? "280px 140px 360px" : "300px 420px";
  const list=rec.length ? '<div class="x-det" style="--cols:'+tpl+'">'+(wn.ver==="11"?'<div class="dh"><span>Ім\'я</span><span>Дата змінення</span><span>Розташування</span></div>':'')+rows+'</div>'
    : '<div class="x-note">Після того як ви відкриєте деякі файли, тут відображатимуться останні з них.</div>';
  if(wn.ver==="11") return wnGrp("Швидкий доступ", pins.length, tiles)+wnGrp("Вибране", 0, '<div class="x-note">Після того як ви додасте файли до вибраного, вони відобразяться тут.</div>')+wnGrp("Останні", rec.length, list);
  return wnGrp("Часто використовувані папки", pins.length, tiles)+wnGrp("Останні файли", rec.length, list);
}
function wnItemsHtml(w, items, view, mode){
  const t=wnTab(w), sf="w"+w.id;
  if(!items.length) return '<div class="x-empty">'+(mode==="search" ? "Немає елементів, які відповідають умовам пошуку." : mode==="bin" ? "Кошик порожній." : "Ця папка порожня.")+'</div>';
  if(view==="details"){
    const cols = mode==="bin" ? ["name","orig","del","size","type"] : mode==="search" ? ["name","date","type","size","where"] : ["name","date","type","size"];
    const s=wnSortOf(t.loc);
    return '<div class="x-det" style="--cols:'+cols.map(c=>WN_COLS[c].w+"px").join(" ")+'"><div class="dh">'+
      cols.map(c=>'<span class="'+(s.by===c?"on "+(s.dir>0?"asc":"desc"):"")+(WN_COLS[c].r?" r":"")+'" data-a="sort" data-v="'+c+'">'+WN_COLS[c].h+'</span>').join("")+'</div>'+
      items.map(n=>'<div class="'+wnItCls(t,n,"xr")+'" data-it="'+n.id+'">'+cols.map(c=>c==="name"
        ? '<span class="c nmc">'+wnBox(t,n)+wnIco(n,16)+wnName(sf,n,1)+'</span>'
        : '<span class="c'+(WN_COLS[c].r?" r":"")+'">'+esc(WN_COLS[c].v(n))+'</span>').join("")+'</div>').join("")+'</div>';
  }
  const px=WN_VPX[view], line=view==="small"||view==="list";
  return '<div class="x-grid v-'+view+'">'+items.map(n=>{
    const cls=wnItCls(t,n);
    if(view==="tiles") return '<div class="'+cls+'" data-it="'+n.id+'">'+wnBox(t,n)+'<span class="ic">'+wnIco(n,px,true)+'</span><span class="tx">'+wnName(sf,n,1)+
      '<small>'+esc(wnType(n))+'</small>'+(n.kind==="file"?'<small>'+wnKB(n.size)+'</small>':'')+'</span></div>';
    if(view==="content") return '<div class="'+cls+'" data-it="'+n.id+'">'+wnBox(t,n)+'<span class="ic">'+wnIco(n,px,true)+'</span><span class="tx">'+wnName(sf,n,1)+
      '<small>'+esc(n.kind==="file"?wnType(n):"")+'</small></span><span class="cx"><small>Дата змінення: '+esc(wnDt(n.date))+'</small>'+(n.kind==="file"?'<small>Розмір: '+wnHuman(n.size)+'</small>':'')+'</span></div>';
    return '<div class="'+cls+'" data-it="'+n.id+'">'+wnBox(t,n)+'<span class="ic" style="height:'+px+'px">'+wnIco(n,px,true)+'</span>'+wnName(sf,n,line)+'</div>';
  }).join("")+'</div>';
}
function wnStatus(w){
  const t=wnTab(w), cnt=wnShown(w).length, s=t.sel.length, v=wnViewOf(t.loc);
  const one=s===1 && wn.by[t.sel[0]], sz=one && one.kind==="file" ? wnHuman(one.size) : "";
  const vb='<span class="vb"><button data-a="view" data-v="details" class="'+(v==="details"?"on":"")+'">'+wnG("vdet",12)+'</button>'+
    '<button data-a="view" data-v="large" class="'+(v==="large"?"on":"")+'">'+wnG("vbig",12)+'</button></span>';
  if(wn.ver==="11") return '<div class="x-sb"><span>'+cnt+" "+plural(cnt,"елемент","елементи","елементів")+'</span>'+
    (s?'<i></i><span>Вибрано '+s+" "+plural(s,"елемент","елементи","елементів")+(sz?"&ensp;&ensp;"+sz:"")+'</span>':'')+'<span class="sp"></span>'+vb+'</div>';
  return '<div class="x-sb"><span>Елементів: '+cnt+'</span>'+(s?'<span>'+(s===1?"Вибрано 1 елемент":"Вибрано елементів: "+s)+'</span>':'')+
    (sz?'<span>'+sz+'</span>':'')+'<span class="sp"></span>'+vb+'</div>';
}
function wnPaneHtml(w){
  const t=wnTab(w), n=t.sel.length===1 ? wn.by[t.sel[0]] : null;
  if(w.pane==="preview"){
    let b;
    if(!n) b='<p class="pv-no">Виберіть файл для попереднього перегляду.</p>';
    else if(n.ext==="png"||n.ext==="bmp") b='<div class="pv-img">'+wnPic(n,220)+'</div>';
    else if(n.ext==="txt") b='<pre class="pv-txt">'+esc(n.text||"")+'</pre>';
    else b='<p class="pv-no">Немає доступного попереднього перегляду.</p>';
    return '<div class="x-pane">'+b+'</div>';
  }
  const cur=typeof t.loc==="number" ? wn.by[t.loc] : null, x=n || cur;
  if(!x) return '<div class="x-pane"><div class="pd-ic">'+wnLocIco(t.loc,96)+'</div><b class="pd-n">'+esc(wnLocName(t.loc))+'</b></div>';
  const row=(k,v)=>v ? '<div class="pd-r"><span>'+k+':</span><span>'+esc(v)+'</span></div>' : "";
  if(!n) return '<div class="x-pane"><div class="pd-ic">'+wnIco(x,96)+'</div><b class="pd-n">'+esc(x.name)+'</b><p class="pd-t">Елементів: '+wnShown(w).length+'</p></div>';
  return '<div class="x-pane"><div class="pd-ic">'+wnIco(n,96,true)+'</div><b class="pd-n">'+esc(wnFull(n))+'</b><p class="pd-t">'+esc(wnType(n))+'</p>'+
    row("Дата змінення",wnDt(n.date))+(n.kind==="file"?row("Розмір",wnHuman(n.size)):"")+row("Дата створення",wnDt(n.made||n.date))+
    (n.kind==="file" && wnAppOf(n)?row("Відкривається",WN_APPS[wnAppOf(n)].n):"")+'</div>';
}

/* ---- програми ---- */
function wnAppHtml(w){
  const f=w.file!=null ? wn.by[w.file] : null, A=WN_APPS[w.app]||{n:w.app}, nm=f ? f.name.replace(/_/g," ") : "";
  const title = w.app==="notepad" ? (w.dirty?"*":"")+(f?f.name:"Без назви")+" – Блокнот" : f ? f.name+" – "+A.n : A.n;
  const bar='<div class="a-tb" data-drag="1">'+wnAppIco(w.app,16)+'<span class="tt">'+esc(title)+'</span>'+wnCaps(w)+'</div>';
  const lines=k=>Array.from({length:k},(_,i)=>'<i style="width:'+(60+((i*37)%35))+'%"></i>').join("");
  let b;
  if(w.app==="notepad") b='<div class="np-m"><button data-a="npfile">Файл</button><span>Редагування</span><span>Формат</span><span>Вигляд</span><span>Довідка</span></div>'+
    '<textarea class="np-t" data-fk="np'+w.id+'" spellcheck="false">'+esc(w.text)+'</textarea>'+
    '<div class="np-sb"><span>Рядок 1, стовпець 1</span><span>100%</span><span>Windows (CRLF)</span><span>UTF-8</span></div>';
  else if(w.app==="photos") b='<div class="ph">'+(f?'<div class="ph-img">'+wnPic(f,560)+'</div>':'<p>Немає фотографій</p>')+'</div>';
  else if(w.app==="paint") b='<div class="pt-rb">'+["Файл","Основне","Вигляд"].map((x,i)=>'<span'+(i===1?' class="on"':'')+'>'+x+'</span>').join("")+'</div>'+
    '<div class="pt-tl">'+["#000000","#7F7F7F","#880015","#ED1C24","#FF7F27","#FFF200","#22B14C","#00A2E8","#3F48CC","#A349A4","#FFFFFF","#C3C3C3"].map(c=>'<i style="background:'+c+'"></i>').join("")+'</div>'+
    '<div class="pt-cv"><div class="pt-img">'+(f?wnPic(f,420).replace('viewBox="0 -20 160 160"','viewBox="0 0 160 120"'):'')+'</div></div>';
  else if(w.app==="word") b='<div class="wd-rb">'+["Файл","Основне","Вставлення","Конструктор","Макет","Посилання","Рецензування","Вигляд"].map((x,i)=>'<span'+(i===1?' class="on"':'')+'>'+x+'</span>').join("")+'</div>'+
    '<div class="wd-bd"><div class="wd-pg">'+(f?'<h4>'+esc(nm)+'</h4><div class="ln">'+lines(9)+'</div>':'')+'</div></div>';
  else if(w.app==="ppt") b='<div class="wd-rb pp">'+["Файл","Основне","Вставлення","Конструктор","Переходи","Анімація","Показ слайдів"].map((x,i)=>'<span'+(i===1?' class="on"':'')+'>'+x+'</span>').join("")+'</div>'+
    '<div class="pp-bd"><div class="pp-th">'+[1,2,3].map(i=>'<i class="'+(i===1?"on":"")+'"></i>').join("")+'</div><div class="pp-sl"><b>'+esc(nm||"Натисніть, щоб додати заголовок")+'</b><span>'+esc(f?"Учень":"Підзаголовок")+'</span></div></div>';
  else if(w.app==="media") b='<div class="md">'+wnAppIco("media",96)+'<b>'+esc(f?wnFull(f,true):"Медіапрогравач")+'</b><div class="md-bar"><i></i></div>'+
    '<div class="md-t"><span>0:00</span><span>'+(f?"3:"+String(f.size%60).padStart(2,"0"):"0:00")+'</span></div><div class="md-c">'+wnG("back",20)+'<span class="pl">'+wnSvg(20,"0 0 16 16",'<path d="M5 3v10l8-5z" fill="currentColor"/>')+'</span>'+wnG("fwd",20)+'</div></div>';
  else if(w.app==="edge") b='<div class="ed-tb"><span class="ed-tab">'+wnAppIco("edge",14)+esc(f?wnFull(f,true):"Нова вкладка")+'</span></div>'+
    '<div class="ed-ad">'+wnG("back")+wnG("fwd")+wnG("refresh")+'<span class="ed-url">'+esc(f?"file:///"+wnReal(f.id).replace(/\\/g,"/"):"Пошук або введення веб-адреси")+'</span></div>'+
    '<div class="ed-bd">'+(f?'<div class="wd-pg"><h4>'+esc(nm)+'</h4><div class="ln">'+lines(12)+'</div></div>':'<div class="ed-new">'+wnAppIco("edge",64)+'</div>')+'</div>';
  else b='<div class="gen">'+wnAppIco(w.app,72)+'<b>'+esc(A.n)+'</b></div>';
  return bar+'<div class="a-bd">'+b+'</div>'+wnRsz(w);
}

/* ---- «Зберегти як» ----
   Те саме дерево, адреса й таблиця, що в Провіднику, але видно лише папки й
   файли вибраного типу, а внизу — ім'я й тип файлу. */
function wnSaveHtml(w){
  const t=wnTab(w), loc=t.loc, fit=n=>n.kind==="dir" || n.drive || w.ftype==="all" || n.ext==="txt";
  let ct;
  if(!t.q && typeof loc==="number" && wn.by[loc].pc) ct=wnPcHtml(w);
  else {
    const items=(loc==="quick" && !t.q ? wn.pins.map(id=>wn.by[id]).filter(Boolean) : wnShown(w)).filter(fit);
    ct = items.length ? wnItemsHtml(w, items, "details", t.q ? "search" : "std") : '<div class="x-empty">Немає елементів, які відповідають умовам пошуку.</div>';
  }
  const types={txt:"Текстові документи (*.txt)", all:"Усі файли (*.*)"};
  return '<div class="a-tb dlg" data-drag="1">'+wnAppIco("notepad",16)+'<span class="tt">Зберегти як</span>'+wnCaps(w,1)+'</div>'+wnAddr(w)+
    '<div class="sv-tb"><button class="sv-b">Упорядкувати '+wnG("chd",10)+'</button><button class="sv-b" data-a="newdir"'+(!t.q && wnWritable(loc)?'':' disabled')+'>Нова папка</button>'+
      '<span class="sp"></span><button class="sv-b">'+wnG("vdet")+wnG("chd",10)+'</button></div>'+
    '<div class="x-bd"><div class="x-nav" data-sk="nav'+w.id+'">'+wnNavHtml(w)+'</div>'+
      '<div class="x-ct" data-sf="w'+w.id+'" data-sk="ct'+w.id+'-'+loc+'-'+t.q+'">'+ct+'</div></div>'+
    '<div class="sv-ft"><label>Ім\'я файлу:</label><input data-fk="sn'+w.id+'" value="'+esc(w.fname)+'" spellcheck="false" autocomplete="off">'+
      '<label>Тип файлу:</label><button class="sv-sel" data-a="svtype">'+types[w.ftype]+wnG("chd",10)+'</button></div>'+
    '<div class="sv-bt"><button class="sv-hide">'+wnG("chu",10)+' Сховати папки</button><span class="sp"></span>'+
      '<span class="sv-enc">Кодування:<span class="sv-sel sm">UTF-8'+wnG("chd",10)+'</span></span>'+
      '<button class="btn def" data-a="svok">Зберегти</button><button class="btn" data-a="close">Скасувати</button></div>'+wnRsz(w);
}

/* ---- «Властивості» ---- */
function wnPropsHtml(w){
  const n=wn.by[w.id2];
  if(!n) return '<div class="a-tb" data-drag="1"><span class="tt">Властивості</span>'+wnCaps(w,1)+'</div>';
  const tabs = n.kind==="file" ? ["Загальні","Безпека","Докладно","Попередні версії"]
    : n.drive ? ["Загальні","Знаряддя","Обладнання","Спільний доступ","Безпека"] : ["Загальні","Спільний доступ","Безпека","Попередні версії","Настроїти"];
  const R=(k,v,raw)=>'<div class="pr"><span>'+k+'</span><span>'+(raw?v:esc(v))+'</span></div>', HR='<div class="phr"></div>';
  const bytes=b=>wnHuman(b)+" ("+wnNum.format(b)+" байт)";
  const disk=b=>Math.ceil(b/4096)*4096;
  let b='<div class="phd"><span class="pic">'+wnIco(n,32)+'</span><input data-fk="pn'+w.id+'" value="'+esc(w.val)+'"'+(n.lock||wnInBin(n.id)?" readonly":"")+' spellcheck="false" autocomplete="off"></div>'+HR;
  if(n.drive){
    const used=(n.cap-n.free)*1073741824, free=n.free*1073741824, u=(n.cap-n.free)/n.cap;
    b+=R("Тип:","Локальний диск")+R("Файлова система:","NTFS")+HR+
      R('<i class="sw u"></i>Зайнято:', bytes(Math.round(used)), 1)+R('<i class="sw f"></i>Вільно:', bytes(Math.round(free)), 1)+HR+R("Місткість:", bytes(n.cap*1073741824))+
      '<div class="ppie"><span style="background:conic-gradient(#2A7AE2 0 '+Math.round(u*360)+'deg,#D6D6D6 0)"></span><b>Диск '+n.drive+':</b></div>';
  } else if(n.kind==="dir"){
    const s=wnDirSize(n);
    b+=R("Тип:", n.bin ? "Кошик" : wnType(n))+R("Розташування:", wnReal(wn.up[n.id]) || "Цей ПК")+R("Розмір:", bytes(s.s))+R("На диску:", bytes(disk(s.s)))+
      R("Вміст:", "Файлів: "+s.f+"; папок: "+s.d)+HR+R("Створено:", wnDtLong(n.made||n.date))+HR+
      '<div class="pr"><span>Атрибути:</span><span class="pat"><label><i class="ck mix"></i>Лише для читання (тільки для файлів у папці)</label><label><i class="ck"></i>Прихований</label></span></div>';
  } else {
    const app=wnAppOf(n);
    b+=R("Тип файлу:", wnType(n)+(n.ext?" (."+n.ext+")":""))+
      R("Програма:", app ? wnAppIco(app,16)+" "+esc(WN_APPS[app].n)+'<button class="btn sm" disabled>Змінити…</button>' : "Вибрати програму", 1)+HR+
      R("Розташування:", wnInBin(n.id) ? wnReal(n.orig) : wnReal(wn.up[n.id]))+R("Розмір:", bytes(n.size))+R("На диску:", bytes(disk(n.size)))+HR+
      R("Створено:", wnDtLong(n.made||n.date))+R("Змінено:", wnDtLong(n.date))+R("Відкрито:", wnDtLong(n.date))+HR+
      '<div class="pr"><span>Атрибути:</span><span class="pat"><label><i class="ck"></i>Лише для читання</label><label><i class="ck"></i>Прихований</label></span></div>';
  }
  return '<div class="a-tb dlg" data-drag="1"><span class="tt">Властивості: '+esc(wnFull(n))+'</span>'+wnCaps(w,1)+'</div>'+
    '<div class="p-bd"><div class="ptabs">'+tabs.map((x,i)=>'<span class="'+(i===0?"on":"")+'">'+x+'</span>').join("")+'</div><div class="ppg">'+b+'</div></div>'+
    '<div class="dg-bt"><button class="btn def" data-a="pok">OK</button><button class="btn" data-a="close">Скасувати</button><button class="btn" data-a="papply">Застосувати</button></div>';
}

/* ---- діалоги ---- */
const WN_DLGI={
  warn:'<path d="M16 3L30 28H2z" fill="#FFCC00" stroke="#C99A00" stroke-linejoin="round"/><path d="M16 11v9" stroke="#1B1B1B" stroke-width="2.6" stroke-linecap="round"/><circle cx="16" cy="24" r="1.6" fill="#1B1B1B"/>',
  del:'<path d="M7 3h13l6 6v20H7z" fill="#FFFFFF" stroke="#8B93A0"/><circle cx="23" cy="23" r="7" fill="#E81123"/><path d="M20 20l6 6M26 20l-6 6" stroke="#FFFFFF" stroke-width="2"/>',
  shield:'<path d="M16 2l12 4.5v8.5c0 7.5-5.3 12.8-12 15-6.7-2.2-12-7.5-12-15V6.5z" fill="#2F7FD8"/><path d="M16 2v28c6.7-2.2 12-7.5 12-15V6.5z" fill="#FFCC00"/>',
  err:'<circle cx="16" cy="16" r="14" fill="#E81123"/><path d="M11 11l10 10M21 11L11 21" stroke="#FFFFFF" stroke-width="2.4"/>'
};
function wnDlgHtml(w){
  const d=w.d;
  const about=d.about ? '<div class="dg-ab">'+wnIco(d.about,48,true)+'<div><b>'+esc(wnFull(d.about))+'</b><span>Тип: '+esc(wnType(d.about))+'</span>'+
    (d.about.kind==="file"?'<span>Розмір: '+wnHuman(d.about.size)+'</span>':'')+'<span>Дата змінення: '+esc(wnDt(d.about.date))+'</span></div></div>' : '';
  const opts=d.opts ? d.opts.map((o,i)=>'<button class="dg-op" data-a="dlgb" data-v="'+(-i-1)+'">'+wnG(i?"fwd":"check",20)+'<span>'+esc(o.t)+'</span></button>').join("") : '';
  return '<div class="a-tb dlg" data-drag="1"><span class="tt">'+esc(d.title)+'</span>'+wnCaps(w,1)+'</div>'+
    '<div class="dg-bd">'+(d.icon?'<span class="dg-ic">'+wnSvg(32,"0 0 32 32",WN_DLGI[d.icon])+'</span>':'')+
    '<div class="dg-tx">'+(d.main?'<div class="dg-main">'+d.main+'</div>':'')+(d.text?'<div>'+d.text+'</div>':'')+about+opts+'</div></div>'+
    '<div class="dg-bt">'+d.btns.map((b,i)=>'<button class="btn'+(b.def?" def":"")+'" data-a="dlgb" data-v="'+i+'">'+(b.shield?wnSvg(14,"0 0 32 32",WN_DLGI.shield):"")+esc(b.t)+'</button>').join("")+'</div>';
}

/* ---- контекстні меню ---- */
function wnMenuHtml(){
  const m=wn.menu; if(!m) return "";
  const list=(items, path)=>'<div class="mn">'+(path==="" && m.row ? '<div class="mrow">'+m.row.map((r,i)=>
      '<button data-a="'+(r.dis?"":"mrow")+'" data-v="'+i+'" title="'+esc(r.t)+'"'+(r.dis?" disabled":"")+'>'+wnG(r.g)+'</button>').join("")+'</div>' : '')+
    items.map((it,i)=>{
      if(it==="-") return '<div class="ms"></div>';
      if(it.hd) return '<div class="mh">'+esc(it.t)+'</div>';
      const p=path==="" ? String(i) : path+"."+i;
      return '<div class="mi'+(it.dis?" dis":"")+(it.sub?" has":"")+(it.b?" b":"")+(it.d?" two":"")+(it.on?" on":"")+'" data-a="'+(it.dis||it.sub?"":"mi")+'" data-v="'+p+'">'+
        '<span class="mic">'+(it.chk?wnG("check",12):it.rad?'<i class="dot"></i>':it.ic||"")+'</span><span class="mt">'+esc(it.t)+(it.d?'<small>'+esc(it.d)+'</small>':'')+'</span>'+
        (it.k?'<span class="mk">'+esc(it.k)+'</span>':'')+(it.sub?'<span class="ma">'+wnG("chr",10)+'</span>'+list(it.sub,p):'')+'</div>';
    }).join("")+'</div>';
  return '<div class="wn-menu st'+(m.st||wn.ver)+(m.dark?" dark":"")+'" id="wnMenu" style="left:'+m.x+'px;'+(m.bottom!=null?"bottom:"+m.bottom+"px":"top:"+m.y+"px")+'">'+list(m.items,"")+'</div>';
}
function wnMenuItem(p){
  let items=wn.menu.items, it=null;
  String(p).split(".").forEach(i=>{ it=items[+i]; items=it && it.sub; });
  return it;
}

/* ---- перемальовування ---- */
function wnRender(){
  if(!wn.el || !wn.open) return;
  const s=wn.scr, a=document.activeElement, fk=a && s.contains(a) ? a.getAttribute("data-fk") : null;
  const ss=fk && a.selectionStart!=null ? [a.selectionStart, a.selectionEnd, a.selectionDirection] : null;
  const sc={};
  s.querySelectorAll("[data-sk]").forEach(e=>{ sc[e.getAttribute("data-sk")]=[e.scrollTop, e.scrollLeft]; });
  s.className="wn-scr w"+wn.ver;
  s.style.width=wnW()+"px"; s.style.height=wnH()+"px";
  s.style.setProperty("--vh", wnH()+"px");
  wnSet(s.querySelector(".wn-wall"), WN_WALL[wn.ver]);
  const dk=s.querySelector("#wnDesk"); dk.style.bottom=wnTB()+"px"; wnSet(dk, wnDeskHtml());
  wnRenderWins();
  const bar=s.querySelector("#wnBar"); bar.style.height=wnTB()+"px"; wnSet(bar, wnBarHtml());
  const st=s.querySelector("#wnStart");
  st.className="wn-start"+(wn.start?" on m-"+wn.start:"");
  st.style.bottom=wnTB()+"px";
  if(wn.start) wnSet(st, wnStartHtml());
  wnSet(s.querySelector("#wnMenuBox"), wnMenuHtml());
  s.querySelectorAll("[data-sk]").forEach(e=>{ const v=sc[e.getAttribute("data-sk")]; if(v){ e.scrollTop=v[0]; e.scrollLeft=v[1]; } });
  if(wn.edit && wn.edit.fresh){
    wn.edit.fresh=false;
    const e=s.querySelector('[data-fk="ren"]'), n=wn.by[wn.edit.id];
    if(e){
      e.focus({preventScroll:true});
      const end = n.kind==="file" && n.ext && wn.showExt ? n.name.length : e.value.length;
      e.setSelectionRange(0, Math.min(end, e.value.length));
      e.scrollIntoView({block:"nearest"});
    }
  } else if(wn.want){
    const e=s.querySelector('[data-fk="'+wn.want+'"]'); wn.want=null;
    if(e){ e.focus({preventScroll:true}); if(e.select) e.select(); }
  } else if(fk){
    const e=s.querySelector('[data-fk="'+fk+'"]');
    if(e && e!==document.activeElement){ e.focus({preventScroll:true}); if(ss) try{ e.setSelectionRange(ss[0],ss[1],ss[2]); }catch(_){} }
  }
  if(wn.scrollTo!=null){ const e=s.querySelector('[data-w="'+wn.act+'"] [data-it="'+wn.scrollTo+'"]')||s.querySelector('#wnDesk [data-it="'+wn.scrollTo+'"]'); if(e) e.scrollIntoView({block:"nearest"}); wn.scrollTo=null; }
  s.querySelectorAll("textarea.ren:not(.line)").forEach(wnGrow);
  wnFitMenu();
}
function wnGrow(e){ e.style.height="0"; e.style.height=(e.scrollHeight+2)+"px"; }
/* меню не вилазить за край екрана: зсуваємо, а підменю відкриваємо ліворуч */
function wnFitMenu(){
  const el=wn.scr.querySelector("#wnMenu"); if(!el || !wn.menu) return;
  const W=wnW(), H=wnH()-(wn.menu.bottom!=null?0:wnTB());
  const r={w:el.offsetWidth, h:el.offsetHeight};
  if(wn.menu.x+r.w>W) el.style.left=Math.max(0, W-r.w-2)+"px";
  if(wn.menu.bottom==null && wn.menu.y+r.h>H) el.style.top=Math.max(0, H-r.h-2)+"px";
  el.classList.toggle("flip", el.offsetLeft+r.w*2>W);
}
