// ── LEADERS ──
const leaders = [
  { name:"Late Arch Bishop Mvuleni",  title:"Founding Arch Bishop",      category:"Arch Bishops",  photo:"images/archbishop1.jpg" },
  { name:"Lady Arch Bishop",          title:"Presiding Arch Bishop",     category:"Arch Bishops",  photo:"images/lady arch.jpeg" },
  { name:"Bishop Gantana",            title:"Senior Bishop",             category:"Bishops",       photo:"images/babe gantana.jpeg" },
  { name:"Bishop Ndungwane",          title:"Bishop",                    category:"Bishops",       photo:"images/bishop2.jpg" },
  { name:"Bishop Sindane  ",          title:"Bishop ",                   category:"Bishops",       photo:"images/bishop3.jpg" },
  { name:"Pastor Lady Nkosi",         title:"Mpumalanga Branch Pastor",  category:"Pastors",       photo:"images/gogo.jpeg" },
  { name:"Pastor Elvis Mamba ",       title:"Pretoria Branch Pastor",    category:"Pastors",       photo:"images/pastor2.jpg" },
  { name:"Pastor Dladla",             title:"Pretoria Branch Pastor",    category:"Pastors",       photo:"images/babe dladla.jpeg" },
  { name:"Pastor Nelsiwe sthole",     title:"Mpumalanga Branch Pastor",  category:"Pastors",       photo:"images/mama nelly.jpeg" },
  { name:"Pastor Lady Mamba",         title:" Pastor",                   category:"Pastors",       photo:"images/pastor6.jpg" },
  { name:"Preacher Goodman Mamba",    title:"Evangelist",                category:"Preachers",     photo:"images/goodman.jpeg" },
  { name:"Preacher Nkuli",           title:"Youth Preacher",             category:"Preachers",     photo:"images/nkuli.jpeg" },
  { name:"Preacher Blessing",        title:"Evangelist",                 category:"Preachers",     photo:"images/bless.jpeg"}  
];

function loadLeaders() {
  const c = document.getElementById('leaders-container'); if (!c) return; c.innerHTML = '';
  ['Arch Bishops','Bishops','Pastors','Preachers'].forEach(cat => {
    const catL = leaders.filter(l => l.category === cat); if (!catL.length) return;
    c.innerHTML += `<div class="category-heading">${cat}</div>`;
    const row = document.createElement('div'); row.className = 'row g-4';
    catL.forEach(l => { row.innerHTML += `<div class="col-md-3 col-sm-6"><div class="leader-card"><img src="${l.photo}" class="leader-photo" onerror="this.src='https://via.placeholder.com/88?text=${encodeURIComponent(l.name.split(' ').slice(-1)[0])}'"><div class="leader-name">${l.name}</div><div class="leader-role">${l.title}</div></div></div>`; });
    c.appendChild(row);
  });
}