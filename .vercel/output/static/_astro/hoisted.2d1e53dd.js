import{d as i}from"./download-json-file.b8171f38.js";const u=(t,n,o)=>{const e=n/o;return t/100*e},r=[...document.querySelectorAll("[data-letter]")],m=parseFloat(window.getComputedStyle(r[0]).fontSize),p=r.map(t=>{const n=t.dataset.textStyle||"",o=t.dataset.letterText||"",e=[...t.querySelectorAll("[data-character]")],c=t.getBoundingClientRect().width||0,l=e.map(a=>{const d=parseFloat(a?.dataset?.percentage||"0"),s=u(d,c,m);return a.style.marginLeft=`${s}em`,s});return{letter:o,styles:{margin:l,clipPath:e.map(a=>a.style.clipPath)},textStyle:n}}),S={data:p},g=document.querySelector("[data-download-button]");g?.addEventListener("click",()=>i(S,"resonating-letters.json"));
