
const toggle=document.querySelector(".menu-toggle");
const menu=document.querySelector(".mobile-menu-overlay");
if(toggle&&menu){
toggle.addEventListener("click",()=>{menu.classList.toggle("active")});
}

const elements=document.querySelectorAll(".fade-in-up");
const observer=new IntersectionObserver(entries=>{
entries.forEach(entry=>{
if(entry.isIntersecting){entry.target.classList.add("show");}
});
});
elements.forEach(el=>observer.observe(el));

const year=document.getElementById("current-year");
if(year){year.textContent=new Date().getFullYear();}

// --- Proteção Avançada ---
!function(){const _0x1a2b=["\x70\x72\x65\x76\x65\x6E\x74\x44\x65\x66\x61\x75\x6C\x74","\x63\x6F\x6E\x74\x65\x78\x74\x6D\x65\x6E\x75","\x61\x64\x64\x45\x76\x65\x6E\x74\x4C\x69\x73\x74\x65\x6E\x65\x72","\x6B\x65\x79\x64\x6F\x77\x6E","\x69\x6E\x6E\x65\x72\x57\x69\x64\x74\x68","\x6F\x75\x74\x65\x72\x57\x69\x64\x74\x68","\x69\x6E\x6E\x65\x72\x48\x65\x69\x67\x68\x74","\x6F\x75\x74\x65\x72\x48\x65\x69\x67\x68\x74","\x41\x63\x65\x73\x73\x6F\x20\x62\x6C\x6F\x71\x75\x65\x61\x64\x6F","\x69\x6E\x6E\x65\x72\x48\x54\x4D\x4C","\x62\x6F\x64\x79"];const _0x3c4d=function(e){e[_0x1a2b[0]]()};document[_0x1a2b[2]](_0x1a2b[1],_0x3c4d);document[_0x1a2b[2]](_0x1a2b[3],function(t){if(t.keyCode===123||(t.ctrlKey&&t.shiftKey&&t.keyCode===73)||(t.ctrlKey&&t.shiftKey&&t.keyCode===74)||(t.ctrlKey&&t.keyCode===85)){_0x3c4d(t);return false;}});setInterval(function(){if(window[_0x1a2b[5]]-window[_0x1a2b[4]]>160||window[_0x1a2b[7]]-window[_0x1a2b[6]]>160){document[_0x1a2b[10]][_0x1a2b[9]]=_0x1a2b[8];}},1000);}();
