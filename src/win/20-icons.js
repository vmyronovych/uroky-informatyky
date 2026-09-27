/* ---- значки ----
   Малюнки в сітці 32×32, масштабуються під будь-який розмір. Градієнти
   описані один раз у WN_DEFS — прихованому svg на екрані. */
function wnSvg(px, vb, body){ return '<svg width="'+px+'" height="'+px+'" viewBox="'+vb+'" aria-hidden="true">'+body+'</svg>'; }

const WN_DEFS='<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>'+
  '<linearGradient id="wnF11" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE388"/><stop offset="1" stop-color="#FFC73A"/></linearGradient>'+
  '<linearGradient id="wnF10" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE17D"/><stop offset="1" stop-color="#F9C846"/></linearGradient>'+
  '<linearGradient id="wnEdge" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#35C1F1"/><stop offset=".55" stop-color="#1B7FD3"/><stop offset="1" stop-color="#2BB673"/></linearGradient>'+
  '<linearGradient id="wnDesk11" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#58B7FF"/><stop offset="1" stop-color="#1E6FD9"/></linearGradient>'+
  '<linearGradient id="wnPics11" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6FC8FF"/><stop offset="1" stop-color="#2A8EE8"/></linearGradient>'+
  '<linearGradient id="wnLogo11" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3CC5FF"/><stop offset="1" stop-color="#0063D8"/></linearGradient>'+
  '<linearGradient id="wnPhotos" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#46B6FF"/><stop offset="1" stop-color="#6B4DE6"/></linearGradient>'+
  '</defs></svg>';

const WN_EMB10={
  desk:'<rect x="10" y="14.5" width="12" height="8" rx=".8" fill="#2F7FD8"/><rect x="11" y="15.5" width="10" height="6" fill="#9FD3FF"/><path d="M14 24.5h4" stroke="#2F7FD8" stroke-width="1.4"/>',
  docs:'<path d="M12 13.5h6l2.5 2.5v8.5H12z" fill="#FFFFFF" stroke="#8A8A8A" stroke-width=".7"/><path d="M13.5 18h5.5M13.5 20h5.5M13.5 22h4" stroke="#2F6BD0" stroke-width=".9"/>',
  down:'<path d="M16 13.5v8M12.3 18.3L16 22l3.7-3.7" stroke="#1F6FD0" stroke-width="2" fill="none"/><path d="M11.5 24.5h9" stroke="#1F6FD0" stroke-width="1.5"/>',
  pics:'<rect x="10.5" y="14" width="11" height="9" fill="#FFFFFF" stroke="#8A8A8A" stroke-width=".6"/><circle cx="13.5" cy="16.7" r="1.2" fill="#F2A33A"/><path d="M11 22.5l3.5-3.8 2.3 2.4 1.6-1.4 2.6 2.8z" fill="#3E9B5A"/>',
  music:'<path d="M15 22.5v-7l5-1.2v6.5" stroke="#D2513B" stroke-width="1.6" fill="none"/><circle cx="13.6" cy="22.7" r="1.7" fill="#D2513B"/><circle cx="18.6" cy="21" r="1.7" fill="#D2513B"/>',
  video:'<rect x="10.5" y="14.5" width="11" height="8.5" rx="1" fill="#6E4FD0"/><path d="M14.5 16.8v4l3.4-2z" fill="#FFFFFF"/>'
};
const WN_SP11={
  desk:'<rect x="3" y="6" width="26" height="19" rx="2.5" fill="url(#wnDesk11)"/><rect x="3" y="6" width="26" height="4" rx="2" fill="#9ED6FF" opacity=".55"/><path d="M11 28h10" stroke="#4A6A94" stroke-width="2" stroke-linecap="round"/>',
  docs:'<path d="M8 3h11l6 6v19.5c0 .8-.7 1.5-1.5 1.5h-15.5c-.8 0-1.5-.7-1.5-1.5V4.5C6.5 3.7 7.2 3 8 3z" fill="#EEF2F7" stroke="#8E9DB2"/><path d="M19 3v6h6" fill="#D6DEE9" stroke="#8E9DB2"/><path d="M10.5 14h11M10.5 18h11M10.5 22h8" stroke="#5B7FB5" stroke-width="1.6" stroke-linecap="round"/>',
  down:'<circle cx="16" cy="16" r="13" fill="#2EA764"/><path d="M16 8.5v12M10.8 15.6L16 20.8l5.2-5.2" stroke="#FFFFFF" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  pics:'<rect x="3" y="5" width="26" height="22" rx="3" fill="url(#wnPics11)"/><circle cx="11" cy="12" r="2.6" fill="#FFE17D"/><path d="M3 23.5l8-8 5.5 5.5 3.5-3.5 9 9V24c0 1.7-1.3 3-3 3H6c-1.7 0-3-1.3-3-3z" fill="#1A5FB8"/>',
  music:'<circle cx="16" cy="16" r="13" fill="#F0633B"/><path d="M14 21.5v-11l7-2v10" stroke="#FFFFFF" stroke-width="2" fill="none"/><circle cx="12" cy="21.5" r="2.6" fill="#FFFFFF"/><circle cx="19" cy="19" r="2.6" fill="#FFFFFF"/>',
  video:'<rect x="3" y="6" width="26" height="20" rx="3" fill="#8457E6"/><path d="M13 11.5v9l7.5-4.5z" fill="#FFFFFF"/>'
};
function wnFolder(px, full){
  if(wn.ver==="11") return wnSvg(px,"0 0 32 32",
    '<path d="M2 7.5C2 6.1 3.1 5 4.5 5h7.3c.7 0 1.3.3 1.8.7L15.5 8H27.5C28.9 8 30 9.1 30 10.5v14c0 1.4-1.1 2.5-2.5 2.5h-23C3.1 27 2 25.9 2 24.5z" fill="#E9A42B"/>'+
    (full?'<rect x="5" y="10.5" width="22" height="10" rx="1" fill="#FFFFFF"/><rect x="5.5" y="12.5" width="21" height="9" rx="1" fill="#E8EEF6"/>':'')+
    '<path d="M2 13c0-1.4 1.1-2.5 2.5-2.5h23c1.4 0 2.5 1.1 2.5 2.5v11.5c0 1.4-1.1 2.5-2.5 2.5h-23C3.1 27 2 25.9 2 24.5z" fill="url(#wnF11)"/>');
  return wnSvg(px,"0 0 32 32",
    '<path d="M2 6.5C2 5.7 2.7 5 3.5 5h8.3l2.3 2.5h14.4c.8 0 1.5.7 1.5 1.5v17.5c0 .8-.7 1.5-1.5 1.5h-25C2.7 28 2 27.3 2 26.5z" fill="#DDA034"/>'+
    (full?'<path d="M4.5 9.5h23v11h-23z" fill="#FFFFFF" stroke="#D7D7D7" stroke-width=".5"/><path d="M6 11.5h20" stroke="#E7E7E7"/>':'')+
    '<path d="M2 12.3c0-.7.6-1.3 1.3-1.3h25.4c.7 0 1.3.6 1.3 1.3v14.2c0 .8-.7 1.5-1.5 1.5h-25C2.7 28 2 27.3 2 26.5z" fill="url(#wnF10)"/>'+
    '<path d="M2.3 11.6h27.4" stroke="#FFF0BC" stroke-width=".8"/>');
}
function wnSpecial(key, px){
  if(wn.ver==="11") return wnSvg(px,"0 0 32 32",WN_SP11[key]);
  return wnFolder(px,false).replace("</svg>", WN_EMB10[key]+"</svg>");
}
const WN_WINLOGO='<path d="M0 0h7.5v7.5H0zM8.5 0H16v7.5H8.5zM0 8.5h7.5V16H0zM8.5 8.5H16V16H8.5z"/>';
const WN_I={
  pc:px=>wnSvg(px,"0 0 32 32",
    '<rect x="3" y="5" width="26" height="17" rx="1.5" fill="#3B4A5E"/><rect x="4.5" y="6.5" width="23" height="14" fill="'+(wn.ver==="11"?"#4FB3FF":"#1E90E8")+'"/>'+
    '<path d="M4.5 20.5L27.5 6.5v14z" fill="#FFFFFF" opacity=".12"/><path d="M13 22h6l1 4h-8z" fill="#8894A5"/><rect x="9" y="26" width="14" height="2" rx="1" fill="#6B7788"/>'),
  drive:(px,sys)=>wnSvg(px,"0 0 32 32",
    '<rect x="2.5" y="11" width="27" height="12" rx="2" fill="#E3E6EA" stroke="#9AA1AB"/><rect x="2.5" y="18" width="27" height="5" rx="2" fill="#C5CAD1"/>'+
    '<rect x="5" y="19.5" width="11" height="2" rx="1" fill="#6D7582"/><circle cx="26" cy="20.5" r="1.2" fill="#35C15B"/>'+
    (sys?'<g transform="translate(5 12.5) scale(.33)" fill="'+(wn.ver==="11"?"#1C8BE8":"#1B79D0")+'">'+WN_WINLOGO+'</g>':'')),
  bin:(px,full)=>wnSvg(px,"0 0 32 32",
    (full?'<path d="M10 9.5l3-4 4 2.5 3-3 3 5z" fill="#FFFFFF" stroke="#9AA6B8" stroke-width=".7"/><path d="M13 9l2.5-2 3.5 2.5" fill="#CFE6FF" stroke="#8AA0C0" stroke-width=".6"/>':'')+
    '<path d="M6.5 8.5h19l-2.3 20H8.8z" fill="#E9F2FC" fill-opacity=".72" stroke="#7F8EA3"/>'+
    '<path d="M10 11.5l1.2 14M16 11.5v14M22 11.5l-1.2 14M8 15.5h16M8.6 20.5h14.8" stroke="#A3B1C4" stroke-width=".8"/>'+
    '<ellipse cx="16" cy="8.5" rx="9.5" ry="1.6" fill="#F4F8FD" stroke="#7F8EA3"/>'),
  net:px=>wnSvg(px,"0 0 32 32",'<rect x="4" y="5" width="13" height="10" rx="1" fill="#3B4A5E"/><rect x="5" y="6" width="11" height="8" fill="#4FA7F0"/><rect x="15" y="13" width="13" height="10" rx="1" fill="#3B4A5E"/><rect x="16" y="14" width="11" height="8" fill="#4FA7F0"/><path d="M10.5 15v12h11" stroke="#6B7788" stroke-width="1.5" fill="none"/>'),
  star:px=>wnSvg(px,"0 0 32 32",'<path d="M16 3.5l3.8 8 8.7 1-6.4 6 1.7 8.6L16 22.8l-7.8 4.3 1.7-8.6-6.4-6 8.7-1z" fill="#2B88D8"/>'),
  home:px=>wnSvg(px,"0 0 32 32",'<path d="M5 14.5L16 5l11 9.5V27c0 .6-.4 1-1 1h-6.5v-7.5h-7V28H6c-.6 0-1-.4-1-1z" fill="#F7B633" stroke="#B87A0E" stroke-linejoin="round"/>'),
  gallery:px=>wnSvg(px,"0 0 32 32",'<rect x="7" y="4" width="21" height="17" rx="2" fill="#9EC9F5"/><rect x="4" y="8" width="21" height="19" rx="2" fill="url(#wnPics11)"/><circle cx="10" cy="14" r="2" fill="#FFE17D"/><path d="M4 24l7-6 5 4.5 3-2.5 6 5V25c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2z" fill="#1A5FB8"/>'),
  cloud:px=>wnSvg(px,"0 0 32 32",'<path d="M9 24h15.5a5.5 5.5 0 0 0 .6-11A7.5 7.5 0 0 0 10.8 11 6.5 6.5 0 0 0 9 24z" fill="#1A73D9"/>')
};
const WN_BADGE={
  docx:['#185ABD','W'], pptx:['#C43E1C','P'], pdf:['#D93B3B','PDF'], mp3:['#E66A24','♪'], mp4:['#7A4FD0','▶']
};
function wnFileIco(ext, px){
  const doc='<path d="M7 2.5h12.5L26 9v20.5H7z" fill="#FFFFFF" stroke="#8B93A0"/><path d="M19.5 2.5V9H26" fill="#EEF0F3" stroke="#8B93A0" stroke-linejoin="round"/>';
  let b="";
  if(ext==="txt") b='<path d="M10.5 12.5h12M10.5 15.5h12M10.5 18.5h12M10.5 21.5h12M10.5 24.5h8" stroke="#8B93A0" stroke-width="1.1"/>';
  else if(ext==="png"||ext==="bmp") b='<rect x="9.5" y="12" width="14" height="13" fill="#6FC3F7"/><circle cx="13" cy="15.5" r="1.8" fill="#FFE17D"/><path d="M9.5 25l5-6 3.2 3.5 2-2 3.8 4.5z" fill="#2E8B57"/>'+
    (ext==="bmp"?'<rect x="3" y="18" width="11" height="11" rx="1.5" fill="#E8A53A"/><circle cx="8.5" cy="23.5" r="3" fill="#FFFFFF"/>':'');
  else if(WN_BADGE[ext]){
    const c=WN_BADGE[ext], wide=c[1].length>1;
    b='<path d="M'+(wide?"17 16h5M17 19h5M17 22h5M17 25h5":"17 14h6M17 17h6M17 20h6M17 23h6")+'" stroke="#C7CCD3" stroke-width="1.1"/>'+
      '<rect x="3" y="'+(wide?15:13)+'" width="'+(wide?15:13)+'" height="'+(wide?9:13)+'" rx="1.5" fill="'+c[0]+'"/>'+
      '<text x="'+(wide?10.5:9.5)+'" y="'+(wide?21.8:22.8)+'" font-family="Segoe UI,Arial,sans-serif" font-weight="700" font-size="'+(wide?6.5:10)+'" fill="#FFFFFF" text-anchor="middle">'+c[1]+'</text>';
  }
  return wnSvg(px,"0 0 32 32",doc+b);
}
function wnIco(n, px, thumb){
  if(n.pc) return WN_I.pc(px);
  if(n.bin) return WN_I.bin(px, n.kids.length>0);
  if(n.drive) return WN_I.drive(px, n.drive==="C");
  if(n.kind==="dir") return n.emb ? wnSpecial(n.emb, px) : wnFolder(px, n.kids.length>0);
  if(thumb && (n.ext==="png"||n.ext==="bmp")) return wnPic(n, px);
  return wnFileIco(n.ext, px);
}
function wnLocIco(loc, px){
  if(loc==="quick") return wn.ver==="11" ? WN_I.home(px) : WN_I.star(px);
  if(loc==="gallery") return WN_I.gallery(px);
  if(loc==="net") return WN_I.net(px);
  return wn.by[loc] ? wnIco(wn.by[loc], px) : "";
}

/* значки програм */
const WN_APPI={
  explorer:'<path d="M2 7c0-1.1.9-2 2-2h8l2.5 2.5H28c1.1 0 2 .9 2 2V26c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2z" fill="#E9A42B"/><path d="M2 12c0-1.1.9-2 2-2h24c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2z" fill="url(#wnF11)"/><rect x="2" y="17" width="28" height="4.5" fill="#2F8CE6"/>',
  thispc:'<rect x="3" y="5" width="26" height="17" rx="1.5" fill="#3B4A5E"/><rect x="4.5" y="6.5" width="23" height="14" fill="#1E90E8"/><path d="M13 22h6l1 4h-8z" fill="#8894A5"/><rect x="9" y="26" width="14" height="2" rx="1" fill="#6B7788"/>',
  edge:'<circle cx="16" cy="16" r="13.5" fill="url(#wnEdge)"/><path d="M7.5 18.5c.5-6 5-9.5 10-9.5 5.3 0 8.5 3.7 8.5 7.5 0 2.4-1.8 4-4.3 4-2 0-3.2-.9-3.2-2.3 0-1 .7-1.4.7-2.6 0-1.8-1.7-3.1-4-3.1-3.3 0-5.8 2.6-5.8 6.3 0 4.6 4 8 9.5 8" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" opacity=".92"/>',
  store:'<path d="M5 10h22l-1.3 17.5c-.1.8-.8 1.5-1.6 1.5H7.9c-.8 0-1.5-.7-1.6-1.5z" fill="#2B7FD9"/><path d="M11 10V8a5 5 0 0 1 10 0v2" stroke="#2B7FD9" stroke-width="2" fill="none"/><g transform="translate(11.5 14.5) scale(.56)">'+
         '<path d="M0 0h7.5v7.5H0z" fill="#F35325"/><path d="M8.5 0H16v7.5H8.5z" fill="#81BC06"/><path d="M0 8.5h7.5V16H0z" fill="#05A6F0"/><path d="M8.5 8.5H16V16H8.5z" fill="#FFBA08"/></g>',
  word:'<rect x="9" y="4" width="20" height="24" rx="2" fill="#41A5EE"/><rect x="9" y="4" width="20" height="8" rx="2" fill="#2B7CD3"/><rect x="3" y="9" width="15" height="15" rx="1.5" fill="#185ABD"/><text x="10.5" y="20.7" font-family="Segoe UI,Arial,sans-serif" font-weight="700" font-size="11" fill="#FFFFFF" text-anchor="middle">W</text>',
  excel:'<rect x="9" y="4" width="20" height="24" rx="2" fill="#33C481"/><rect x="9" y="4" width="20" height="8" rx="2" fill="#21A366"/><rect x="3" y="9" width="15" height="15" rx="1.5" fill="#107C41"/><text x="10.5" y="20.7" font-family="Segoe UI,Arial,sans-serif" font-weight="700" font-size="11" fill="#FFFFFF" text-anchor="middle">X</text>',
  ppt:'<circle cx="19" cy="16" r="12" fill="#FF8F6B"/><path d="M19 4a12 12 0 0 1 12 12H19z" fill="#ED6C47"/><rect x="3" y="9" width="15" height="15" rx="1.5" fill="#C43E1C"/><text x="10.5" y="20.7" font-family="Segoe UI,Arial,sans-serif" font-weight="700" font-size="11" fill="#FFFFFF" text-anchor="middle">P</text>',
  onedrive:'<path d="M8 24h16.5a5.5 5.5 0 0 0 .6-11A7.5 7.5 0 0 0 10.8 11 6.5 6.5 0 0 0 8 24z" fill="#1A73D9"/>',
  notepad:'<rect x="6" y="5" width="20" height="24" rx="2" fill="#FFFFFF" stroke="#4A90D9" stroke-width="1.4"/><rect x="6" y="5" width="20" height="5" rx="2" fill="#4A90D9"/><path d="M10 15h12M10 19h12M10 23h8" stroke="#8FA8C8" stroke-width="1.4"/><path d="M10 3v4M16 3v4M22 3v4" stroke="#2C5E9E" stroke-width="1.5" stroke-linecap="round"/>',
  paint:'<path d="M16 4C8.8 4 3 9.2 3 15.5 3 21 7.5 25 12 25c2 0 2.5-1.3 2.5-2.5 0-1.5 1-2.5 2.5-2.5h3.5C25.7 20 29 17 29 13 29 8 23.2 4 16 4z" fill="#FFFFFF" stroke="#7D8A99"/><circle cx="9" cy="15" r="2" fill="#E8483C"/><circle cx="12" cy="10" r="2" fill="#F5B31B"/><circle cx="18" cy="8.5" r="2" fill="#3CB44B"/><circle cx="23.5" cy="12" r="2" fill="#2F7FD8"/>',
  photos:'<rect x="3" y="5" width="26" height="22" rx="4" fill="url(#wnPhotos)"/><circle cx="11" cy="12" r="2.5" fill="#FFFFFF"/><path d="M3 23l8-7 6 5 4-3 8 6.5V23c0 2.2-1.8 4-4 4H7c-2.2 0-4-1.8-4-4z" fill="#FFFFFF" opacity=".85"/>',
  media:'<circle cx="16" cy="16" r="13.5" fill="#F0633B"/><path d="M13 10v12l9.5-6z" fill="#FFFFFF"/>',
  calc:'<rect x="6" y="3" width="20" height="26" rx="2.5" fill="#3A3F48"/><rect x="8.5" y="6" width="15" height="5" rx="1" fill="#9FB3C8"/>'+
       '<g fill="#D8DEE6"><rect x="8.5" y="13.5" width="4" height="3.5" rx=".6"/><rect x="14" y="13.5" width="4" height="3.5" rx=".6"/><rect x="19.5" y="13.5" width="4" height="3.5" rx=".6"/><rect x="8.5" y="18.5" width="4" height="3.5" rx=".6"/><rect x="14" y="18.5" width="4" height="3.5" rx=".6"/><rect x="8.5" y="23.5" width="4" height="3.5" rx=".6"/><rect x="14" y="23.5" width="4" height="3.5" rx=".6"/></g><rect x="19.5" y="18.5" width="4" height="8.5" rx=".6" fill="#F08A24"/>',
  camera:'<rect x="3" y="9" width="26" height="18" rx="3" fill="#48505C"/><path d="M11 9l2-3h6l2 3" fill="#48505C"/><circle cx="16" cy="18" r="6" fill="#1F2329"/><circle cx="16" cy="18" r="3.8" fill="#3E8EDC"/>',
  clock:'<circle cx="16" cy="16" r="13" fill="#FFFFFF" stroke="#3A74C9" stroke-width="2.5"/><path d="M16 8v8l5 3" stroke="#233A5E" stroke-width="2" fill="none" stroke-linecap="round"/>',
  mail:'<rect x="3" y="7" width="26" height="18" rx="2" fill="#1D7AD4"/><path d="M3.5 8l12.5 9.5L28.5 8" stroke="#FFFFFF" stroke-width="1.8" fill="none"/>',
  settings:'<circle cx="16" cy="16" r="9" fill="none" stroke="#5A6472" stroke-width="5" stroke-dasharray="3.2 2.4"/><circle cx="16" cy="16" r="7" fill="none" stroke="#5A6472" stroke-width="3"/>',
  cmd:'<rect x="3" y="5" width="26" height="22" rx="2" fill="#1B1B1B"/><rect x="3" y="5" width="26" height="4" rx="2" fill="#3A3A3A"/><path d="M7.5 13.5l4 3.5-4 3.5M13.5 21h7" stroke="#FFFFFF" stroke-width="1.6" fill="none"/>',
  ctrl:'<rect x="4" y="6" width="24" height="18" rx="2" fill="#2F7FD8"/><path d="M8 19l5-5 4 3 7-7" stroke="#FFFFFF" stroke-width="2" fill="none"/><rect x="9" y="25" width="14" height="2.5" rx="1" fill="#7C8A9C"/>',
  snip:'<circle cx="10" cy="22" r="4" fill="none" stroke="#2F7FD8" stroke-width="2.4"/><circle cx="22" cy="22" r="4" fill="none" stroke="#2F7FD8" stroke-width="2.4"/><path d="M13 19L23 5M19 19L9 5" stroke="#5A6472" stroke-width="2.2"/>',
  taskmgr:'<rect x="3" y="5" width="26" height="22" rx="2" fill="#E8F1FB" stroke="#2F7FD8" stroke-width="1.4"/><path d="M6 20l5-6 4 4 5-8 6 6" stroke="#2F7FD8" stroke-width="2" fill="none"/>',
  user:'<circle cx="16" cy="16" r="14" fill="#8FA0B5"/><circle cx="16" cy="12.5" r="5" fill="#E9EEF4"/><path d="M6.5 26c1.8-4.2 5.3-6.5 9.5-6.5s7.7 2.3 9.5 6.5" fill="#E9EEF4"/>'
};
function wnAppIco(app, px){ return wnSvg(px,"0 0 32 32",WN_APPI[app]||WN_APPI.explorer); }

/* дрібні гліфи інтерфейсу: 16×16, лінія кольором тексту */
const WN_G={
  back:'<path d="M13.5 8H3M7 4L3 8l4 4"/>', fwd:'<path d="M2.5 8H13M9 4l4 4-4 4"/>', up:'<path d="M8 13.5V3M4 7l4-4 4 4"/>',
  refresh:'<path d="M13 8a5 5 0 1 1-1.6-3.7M13 2.5v3h-3"/>', chr:'<path d="M6 3.5L10.5 8 6 12.5"/>', chd:'<path d="M3.5 6L8 10.5 12.5 6"/>',
  chu:'<path d="M3.5 10L8 5.5 12.5 10"/>', search:'<circle cx="6.5" cy="6.5" r="4.5"/><path d="M10 10l4.5 4.5"/>',
  x:'<path d="M3 3l10 10M13 3L3 13"/>', min:'<path d="M3 8.5h10"/>', max:'<rect x="3.5" y="3.5" width="9" height="9"/>',
  rest:'<rect x="3.5" y="5.5" width="7" height="7"/><path d="M5.5 5.5v-2h7v7h-2"/>',
  cut:'<circle cx="4.5" cy="12" r="2.2"/><circle cx="11.5" cy="12" r="2.2"/><path d="M5.8 10.3L11.5 2M10.2 10.3L4.5 2"/>',
  copy:'<rect x="5.5" y="5.5" width="8" height="9" rx="1"/><path d="M3.5 11V2.5h7"/>',
  paste:'<path d="M5.5 3H3.5v11.5h9V3h-2"/><rect x="5.5" y="1.5" width="5" height="3" rx=".8"/>',
  ren:'<rect x="1.5" y="4.5" width="13" height="7" rx="1"/><path d="M9 2.5v11M7.5 2.5h3M7.5 13.5h3"/>',
  share:'<path d="M9 2.5h4.5V7M13.5 2.5L7.5 8.5M11.5 9.5v4h-9v-9h4"/>',
  del:'<path d="M2.5 4h11M6 4V2.5h4V4M4 4l.8 10h6.4L12 4M6.8 6.5v5M9.2 6.5v5"/>',
  plus:'<circle cx="8" cy="8" r="6.5"/><path d="M8 5v6M5 8h6"/>',
  sort:'<path d="M5 13V3M2.5 5.5L5 3l2.5 2.5M11 3v10M8.5 10.5L11 13l2.5-2.5"/>',
  view:'<path d="M2.5 4h11M2.5 8h11M2.5 12h11"/>', more:'<circle cx="3.5" cy="8" r=".9"/><circle cx="8" cy="8" r=".9"/><circle cx="12.5" cy="8" r=".9"/>',
  pane:'<rect x="1.5" y="2.5" width="13" height="11" rx="1"/><path d="M10 2.5v11"/>',
  pin:'<path d="M6 2.5h4l-.5 4 2 2H4.5l2-2zM8 8.5v5"/>', filter:'<path d="M2 3h12L9.5 8.5V13l-3 1.5v-6z"/>',
  check:'<path d="M3 8.5l3 3 7-7"/>', ham:'<path d="M2 4h12M2 8h12M2 12h12"/>',
  power:'<path d="M8 2v6M4.8 4.2a5 5 0 1 0 6.4 0"/>', gear:'<circle cx="8" cy="8" r="2.3"/><path d="M8 1.5v2M8 12.5v2M1.5 8h2M12.5 8h2M3.4 3.4l1.4 1.4M11.2 11.2l1.4 1.4M3.4 12.6l1.4-1.4M11.2 4.8l1.4-1.4"/>',
  newdir:'<path d="M1.5 4.5V13h13V5.5H8L6.5 3.5H1.5z"/><path d="M10.5 7.5v4M8.5 9.5h4"/>',
  props:'<rect x="2.5" y="1.5" width="11" height="13" rx="1"/><path d="M5 6l1.5 1.5L10 4M5 10.5h6"/>',
  taskv:'<rect x="1.5" y="3.5" width="5.5" height="9" rx=".8"/><rect x="9" y="3.5" width="5.5" height="9" rx=".8"/>',
  wifi:'<path d="M1.5 6.5a9 9 0 0 1 13 0M3.8 9a6 6 0 0 1 8.4 0M6.1 11.5a3 3 0 0 1 3.8 0"/><circle cx="8" cy="13.5" r=".6"/>',
  net:'<rect x="2" y="2.5" width="12" height="8.5" rx=".6"/><path d="M6 14h4M8 11v3"/>',
  vol:'<path d="M2 6h2.5L8 3v10L4.5 10H2zM10.5 5.5a3.5 3.5 0 0 1 0 5M12.5 3.5a6.3 6.3 0 0 1 0 9"/>',
  bell:'<path d="M4 11.5V7a4 4 0 0 1 8 0v4.5l1.3 1.5H2.7zM6.5 13.5a1.5 1.5 0 0 0 3 0"/>',
  note:'<path d="M2.5 2.5h11v8l-3 3h-8zM10.5 13.5v-3h3"/>', open:'<path d="M2 4.5V13h12V6H8L6.5 4.5z"/>',
  selall:'<rect x="2.5" y="2.5" width="11" height="11" rx="1" stroke-dasharray="2 1.4"/><path d="M5 8l2 2 4-4"/>',
  selnone:'<rect x="2.5" y="2.5" width="11" height="11" rx="1" stroke-dasharray="2 1.4"/>',
  selinv:'<rect x="2.5" y="2.5" width="11" height="11" rx="1" stroke-dasharray="2 1.4"/><path d="M2.5 13.5l11-11"/>',
  moveto:'<path d="M1.5 4.5V13h13V5.5H8L6.5 3.5H1.5z"/><path d="M5.5 9.5h5M8.5 7.5l2 2-2 2"/>',
  copyto:'<path d="M1.5 4.5V13h13V5.5H8L6.5 3.5H1.5z"/><rect x="5.5" y="7.5" width="4" height="4"/><path d="M7.5 7.5v-1.5h4v4h-1.5"/>',
  hist:'<circle cx="8" cy="8" r="6"/><path d="M8 4.5V8l2.5 1.5"/>', edit:'<path d="M3 13l.7-3L11 2.7 13.3 5 6 12.3zM9.5 4.2l2.3 2.3"/>',
  restore:'<path d="M3 8a5 5 0 1 0 1.6-3.7M3 2.5v3h3"/>', term:'<rect x="1.5" y="2.5" width="13" height="11" rx="1"/><path d="M4 6l2.5 2L4 10M8 10.5h4"/>',
  shield:'<path d="M8 1.5l5.5 2v4c0 3.5-2.5 6-5.5 7-3-1-5.5-3.5-5.5-7v-4z"/>',
  zip:'<path d="M3.5 1.5h7l2 2v11h-9z"/><path d="M7 1.5v1.5h1.5V4.5H7V6h1.5v1.5H7v2h1.5v2H7"/>',
  add:'<path d="M8 2.5v11M2.5 8h11"/>', chl:'<path d="M10 3.5L5.5 8 10 12.5"/>',
  pic:'<rect x="1.5" y="2.5" width="13" height="11" rx="1"/><circle cx="5.5" cy="6" r="1.3"/><path d="M2 12l4-4 3 3 2-2 3.5 3.5"/>', mail:'<rect x="1.5" y="3.5" width="13" height="9" rx="1"/><path d="M2 4l6 4.5L14 4"/>',
  user:'<circle cx="8" cy="5.5" r="3"/><path d="M2.5 14.5c.8-3 2.9-4.5 5.5-4.5s4.7 1.5 5.5 4.5"/>',
  vdet:'<path d="M1.5 3.5h13M1.5 6.5h13M1.5 9.5h13M1.5 12.5h13"/>',
  vbig:'<rect x="2" y="2" width="5" height="5"/><rect x="9" y="2" width="5" height="5"/><rect x="2" y="9" width="5" height="5"/><rect x="9" y="9" width="5" height="5"/>',
  vlist:'<rect x="1.5" y="2.5" width="3" height="3"/><rect x="1.5" y="10.5" width="3" height="3"/><path d="M6 4h8M6 12h8"/>',
  vtile:'<rect x="1.5" y="2.5" width="4.5" height="4.5"/><rect x="1.5" y="9" width="4.5" height="4.5"/><path d="M7.5 4h7M7.5 6h5M7.5 10.5h7M7.5 12.5h5"/>',
  print:'<path d="M4 6V1.5h8V6M4 12H1.5V6h13v6H12M4 9.5h8v5H4z"/>', disc:'<circle cx="8" cy="8" r="6.5"/><circle cx="8" cy="8" r="1.5"/>',
  eye:'<path d="M1 8s2.5-4.5 7-4.5S15 8 15 8s-2.5 4.5-7 4.5S1 8 1 8z"/><circle cx="8" cy="8" r="2"/>'
};
function wnG(k, px){ return '<svg class="g" width="'+(px||16)+'" height="'+(px||16)+'" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true">'+(WN_G[k]||"")+'</svg>'; }

/* мініатюри картинок: сюжет за ім'ям, щоб «кола» були колами, а «Розклад» — таблицею */
function wnPicBody(n){
  const nm=(n.name||"").toLowerCase();
  if(n.blank) return '<rect width="160" height="120" fill="#FFFFFF"/>';
  if(nm.includes("кола")) return '<rect width="160" height="120" fill="#FFFFFF"/><circle cx="45" cy="50" r="28" fill="#F25C54"/><circle cx="95" cy="62" r="34" fill="#3FA7F5" fill-opacity=".85"/><circle cx="118" cy="36" r="18" fill="#FFC53D"/><circle cx="60" cy="92" r="16" fill="#44BB6C"/>';
  if(nm.includes("розклад")) return '<rect width="160" height="120" fill="#FFFFFF"/><rect x="12" y="10" width="136" height="16" fill="#2F7FD8"/>'+
    [0,1,2,3,4].map(i=>'<rect x="12" y="'+(30+i*17)+'" width="136" height="14" fill="'+(i%2?"#EEF3FA":"#FFFFFF")+'" stroke="#C9D5E6"/>').join("")+'<path d="M48 26v85M84 26v85M120 26v85" stroke="#C9D5E6"/>';
  if(nm.includes("карта")) return '<rect width="160" height="120" fill="#DDEFFB"/><path d="M22 52l18-14 22 4 16-10 20 6 20-4 20 12 10 16-14 12-22 2-10 14-26-4-14 8-18-12-12 4-14-14z" fill="#FFD84D" stroke="#3C7FD1" stroke-width="2"/><path d="M30 64l110 0" stroke="#3C7FD1" stroke-width="1" stroke-dasharray="3 3"/>';
  if(nm.includes("малюнок")||nm.includes("марія")) return '<rect width="160" height="120" fill="#BFE6FF"/><rect y="88" width="160" height="32" fill="#7CCB5B"/><rect x="42" y="52" width="52" height="40" fill="#F4A259"/><path d="M36 54l32-26 32 26z" fill="#C8553D"/><rect x="60" y="68" width="14" height="24" fill="#6B4226"/><circle cx="130" cy="26" r="13" fill="#FFD43B"/><path d="M112 88c4-14 18-14 22 0" fill="#3E9B5A"/>';
  const h=[...nm].reduce((a,c)=>a+c.codePointAt(0),0)%3;
  if(h===1) return '<rect width="160" height="120" fill="#6EC6FF"/><rect y="70" width="160" height="50" fill="#1E6FB8"/><path d="M60 72l20-30 20 30z" fill="#FFFFFF"/><path d="M52 72h56l-8 10H60z" fill="#8D5524"/><circle cx="130" cy="24" r="12" fill="#FFE066"/>';
  if(h===2) return '<rect width="160" height="120" fill="#FFF3E0"/><circle cx="80" cy="55" r="14" fill="#FFB300"/>'+[0,60,120,180,240,300].map(a=>'<ellipse cx="80" cy="30" rx="10" ry="18" fill="#EC407A" transform="rotate('+a+' 80 55)"/>').join("")+'<circle cx="80" cy="55" r="12" fill="#FFB300"/><path d="M80 70v45" stroke="#43A047" stroke-width="5"/>';
  return '<rect width="160" height="120" fill="#8FD3FF"/><path d="M0 84c30-24 60-24 90-6s50 10 70-4v46H0z" fill="#58B35A"/><path d="M0 98c40-16 80-6 120 2 16 3 28 0 40-4v24H0z" fill="#3E8E41"/><circle cx="36" cy="30" r="14" fill="#FFE066"/>';
}
function wnPic(n, px){
  return '<svg width="'+px+'" height="'+px+'" viewBox="0 -20 160 160" aria-hidden="true">'+wnPicBody(n)+
    '<rect width="160" height="120" fill="none" stroke="#C9CED6" stroke-width="'+(160/px)+'"/></svg>';
}

/* шпалери: Windows 10 — синє світло з логотипа, Windows 11 — синя квітка на блакитному */
const WN_WALL={
  "10":'<svg viewBox="0 0 1366 768" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>'+
    '<radialGradient id="wnW10a" cx="68%" cy="48%" r="75%"><stop offset="0" stop-color="#2C86E6"/><stop offset=".35" stop-color="#0B4AA8"/><stop offset=".75" stop-color="#03204F"/><stop offset="1" stop-color="#010B22"/></radialGradient>'+
    '<linearGradient id="wnW10b" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#9FD4FF" stop-opacity=".55"/><stop offset=".6" stop-color="#3C8FE8" stop-opacity=".12"/><stop offset="1" stop-color="#3C8FE8" stop-opacity="0"/></linearGradient>'+
    '<linearGradient id="wnW10c" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E4F3FF"/><stop offset="1" stop-color="#6FB9FF"/></linearGradient>'+
    '<filter id="wnW10f"><feGaussianBlur stdDeviation="14"/></filter></defs>'+
    '<rect width="1366" height="768" fill="url(#wnW10a)"/>'+
    '<path d="M880 200L-80 -120V900L880 560z" fill="url(#wnW10b)"/><path d="M880 330L-60 180V620L880 430z" fill="url(#wnW10b)" opacity=".7"/>'+
    '<g filter="url(#wnW10f)" opacity=".85"><path d="M880 200l95 26v148l-95 1zM990 230l100 27v117H990zM880 389h95v146l-95 25zM990 389h100v114l-100 29z" fill="#8BD0FF"/></g>'+
    '<path d="M880 200l95 26v148l-95 1zM990 230l100 27v117H990zM880 389h95v146l-95 25zM990 389h100v114l-100 29z" fill="url(#wnW10c)" opacity=".92"/>'+
    '<path d="M0 640L1366 470V768H0z" fill="#010B22" opacity=".35"/></svg>',
  "11":'<svg viewBox="0 0 1366 768" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs>'+
    '<linearGradient id="wnW11a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9DBFEA"/><stop offset=".5" stop-color="#C3D9F2"/><stop offset="1" stop-color="#E4EEF9"/></linearGradient>'+
    '<linearGradient id="wnW11p" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#123FC4"/><stop offset=".6" stop-color="#2F7BF5"/><stop offset="1" stop-color="#9CCBFF"/></linearGradient>'+
    '<linearGradient id="wnW11q" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#0A2E9E"/><stop offset="1" stop-color="#4C8EF0"/></linearGradient>'+
    '<linearGradient id="wnW11l" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#2F6CF0"/><stop offset="1" stop-color="#BFE0FF"/></linearGradient>'+
    '<filter id="wnW11f"><feGaussianBlur stdDeviation="1.6"/></filter></defs>'+
    '<rect width="1366" height="768" fill="url(#wnW11a)"/>'+
    '<g transform="translate(683 450)" filter="url(#wnW11f)">'+
    [[180,.62,.8,"q"],[108,.82,.82,"q"],[-108,.82,.82,"q"],[52,.97,.86,"p"],[-52,.97,.86,"p"],[0,1.05,.9,"p"],[24,.72,.55,"l"],[-24,.72,.55,"l"],[0,.6,.6,"l"]].map(x=>
      '<path d="M0 0C70 -50 130 -200 0 -310C-130 -200 -70 -50 0 0z" fill="url(#wnW11'+x[3]+')" opacity="'+x[2]+'" transform="rotate('+x[0]+') scale('+x[1]+')"/>').join("")+
    '</g></svg>'
};
