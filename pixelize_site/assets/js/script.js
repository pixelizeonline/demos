
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
