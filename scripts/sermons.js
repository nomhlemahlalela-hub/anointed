// ── SERMONS ──
let sermons = [
  { title:"The Power of Prayer", speaker:"Pastor Mamba", date:"March 15, 2026", img:"https://via.placeholder.com/400x180?text=Sermon", videoId:"hEl_ULInpng", desc:"In this message, Pastor Mamba explores the transformative power of persistent prayer.", series:"power-of-prayer", category:"prayer", duration:"42:15", verse:"1 Thessalonians 5:17", takeaway:"Prayer changes things and moves the hand of God.", notes:"Key Points:\\n1. The purpose of prayer\\n2. Overcoming obstacles in prayer\\n3. Praying with authority\\n4. Seeing results through faith", transcript:"[Sermon transcript would appear here]", rating:4.8 },
  { title:"Faith in Action", speaker:"Pastor Nelsiwe", date:"March 8, 2026", img:"https://via.placeholder.com/400x180?text=Sermon", videoId:"hEl_ULInpng", desc:"Pastor Nelsiwe teaches from James 2 about how genuine faith produces works.", series:"abundant-life", category:"leadership", duration:"38:42", verse:"James 2:26", takeaway:"Faith without works is dead - demonstrate your faith through action.", notes:"Key Points:\\n1. Faith is more than belief\\n2. Your works prove your faith\\n3. Serving others demonstrates faith\\n4. Being a living testimony", transcript:"[Sermon transcript would appear here]", rating:4.9 },
  { title:"God's Love Endures", speaker:"Lady Arch Bishop", date:"March 1, 2026", img:"https://via.placeholder.com/400x180?text=Sermon", videoId:"hEl_ULInpng", desc:"A heartfelt message on the unfailing love of God.", series:"grace-upon-grace", category:"salvation", duration:"45:30", verse:"Romans 8:39", takeaway:"Nothing can separate you from God's eternal love and protection.", notes:"Key Points:\\n1. God's love is unconditional\\n2. His love covers all your sins\\n3. Love gives us confidence\\n4. Share God's love with others", transcript:"[Sermon transcript would appear here]", rating:5.0 },
  { title:"Walking in Grace", speaker:"Pastor Mamba", date:"February 22, 2026", img:"https://via.placeholder.com/400x180?text=Sermon", videoId:"hEl_ULInpng", desc:"Discover the freedom that comes from living under God's grace.", series:"grace-upon-grace", category:"worship", duration:"41:18", verse:"2 Corinthians 12:9", takeaway:"God's grace is sufficient for all your needs - live in that freedom.", notes:"Key Points:\\n1. Understanding grace vs law\\n2. The power of God's grace\\n3. Living confidently in grace\\n4. Extending grace to others", transcript:"[Sermon transcript would appear here]", rating:4.7 },
  { title:"The Armor of God", speaker:"Pastor Nelsiwe", date:"February 15, 2026", img:"https://via.placeholder.com/400x180?text=Sermon", videoId:"hEl_ULInpng", desc:"Learn how to put on the full armor of God.", series:"walking-by-faith", category:"prayer", duration:"39:22", verse:"Ephesians 6:10-18", takeaway:"Equip yourself with God's armor to stand against all spiritual attacks.", notes:"Key Points:\\n1. The belt of truth\\n2. The breastplate of righteousness\\n3. The shield of faith\\n4. Prayer as a weapon", transcript:"[Sermon transcript would appear here]", rating:4.8 },
  { title:"Overcoming Fear", speaker:"Lady Arch Bishop", date:"February 8, 2026", img:"https://via.placeholder.com/400x180?text=Sermon", videoId:"hEl_ULInpng", desc:"A powerful word on how to conquer fear with faith.", series:"walking-by-faith", category:"family", duration:"43:05", verse:"2 Timothy 1:7", takeaway:"Fear comes from the enemy, but faith comes from God - choose faith.", notes:"Key Points:\\n1. The source of fear\\n2. Faith as an antidote\\n3. Trusting God in uncertainty\\n4. Developing spiritual courage", transcript:"[Sermon transcript would appear here]", rating:4.9 }
];

let favoriteSermons = [], sermonComments = {};

function renderSermons(list) {
  const grid = document.getElementById('sermonGrid'); if (!grid) return;
  grid.innerHTML = '';
  list.forEach(s => {
    const shortDesc = s.desc.length > 80 ? s.desc.substring(0,80) + '…' : s.desc;
    const isFav = favoriteSermons.some(fs => fs.title === s.title) ? 'bi-heart-fill' : 'bi-heart';
    grid.innerHTML += `<div class="col-md-4"><div class="sermon-card" style="cursor:pointer"><img src="${s.img}" class="sermon-img" onerror="this.src='https://via.placeholder.com/400x160?text=Sermon'"><div class="sermon-body"><div style="display:flex;justify-content:space-between;align-items:start"><div><div class="sermon-title">${s.title}</div><div class="sermon-meta">${s.speaker} · ${s.date}</div></div><button class="btn btn-sm" style="background:none;border:none;font-size:1.2rem;padding:0" onclick="toggleFavoriteSermon(this, '${s.title}')"><i class="bi ${isFav}" style="color:#e74c3c"></i></button></div><p style="font-size:0.82rem;color:var(--ink-muted);line-height:1.6;margin:8px 0">${shortDesc}</p><div style="font-size:0.75rem;color:var(--ink-muted);margin-bottom:10px"><i class="bi bi-clock me-1"></i>${s.duration} | <i class="bi bi-star-fill" style="color:var(--gold)"></i> ${s.rating}</div><button class="btn-watch" onclick="openSermonDetail('${s.title}')"><i class="bi bi-play-circle me-2"></i>Watch</button></div></div></div>`;
  });
}

function renderSermons(list) {
  const grid = document.getElementById('sermonGrid'); if (!grid) return;
  grid.innerHTML = '';
  list.forEach(s => {
    const shortDesc = s.desc.length > 80 ? s.desc.substring(0,80) + '…' : s.desc;
    const isFav = favoriteSermons.some(fs => fs.title === s.title) ? 'bi-heart-fill' : 'bi-heart';
    grid.innerHTML += `<div class="col-md-4"><div class="sermon-card" style="cursor:pointer"><img src="${s.img}" class="sermon-img" onerror="this.src='https://via.placeholder.com/400x160?text=Sermon'"><div class="sermon-body"><div style="display:flex;justify-content:space-between;align-items:start"><div><div class="sermon-title">${s.title}</div><div class="sermon-meta">${s.speaker} · ${s.date}</div></div><button class="btn btn-sm" style="background:none;border:none;font-size:1.2rem;padding:0;pointer-events:all" onclick="event.stopPropagation(); toggleFavoriteSermon(this, '${s.title}')"><i class="bi ${isFav}" style="color:#e74c3c"></i></button></div><p style="font-size:0.82rem;color:var(--ink-muted);line-height:1.6;margin:8px 0">${shortDesc}</p><div style="font-size:0.75rem;color:var(--ink-muted);margin-bottom:10px"><i class="bi bi-clock me-1"></i>${s.duration} | <i class="bi bi-star-fill" style="color:var(--gold)"></i> ${s.rating}</div><button class="btn-watch" onclick="openSermonDetail('${s.title}')"><i class="bi bi-play-circle me-2"></i>Watch</button></div></div></div>`;
  });
}

function filterSermons(q) { renderSermons(sermons.filter(s => s.title.toLowerCase().includes(q.toLowerCase()) || s.speaker.toLowerCase().includes(q.toLowerCase()))); }

function filterSermonsBySeries(series) {
  let filtered = sermons;
  if (series) filtered = filtered.filter(s => s.series === series);
  renderSermons(filtered);
}

function filterSermonsByCategory(category) {
  let filtered = sermons;
  if (category) filtered = filtered.filter(s => s.category === category);
  renderSermons(filtered);
}

function filterSermonsByDate(range) {
  let filtered = sermons;
  if (range) {
    const now = new Date();
    let startDate;
    if (range === 'week') startDate = new Date(now.getTime() - 7*24*60*60*1000);
    else if (range === 'month') startDate = new Date(now.getTime() - 30*24*60*60*1000);
    else if (range === 'quarter') startDate = new Date(now.getTime() - 90*24*60*60*1000);
    else if (range === 'year') startDate = new Date(now.getTime() - 365*24*60*60*1000);
    filtered = filtered.filter(s => new Date(s.date) >= startDate);
  }
  renderSermons(filtered);
}

function openSermonDetail(title) {
  const sermon = sermons.find(s => s.title === title);
  if (!sermon) return;
  
  document.getElementById('sermonTitle').innerText = sermon.title;
  document.getElementById('sermonSpeaker').innerText = sermon.speaker;
  document.getElementById('sermonDate').innerText = sermon.date;
  document.getElementById('sermonSeriesName').innerText = sermon.series ? sermon.series.replace(/-/g, ' ').toUpperCase() : 'General';
  document.getElementById('sermonCategory').innerText = sermon.category.toUpperCase();
  document.getElementById('sermonDuration').innerText = sermon.duration;
  document.getElementById('sermonVerse').innerText = sermon.verse;
  document.getElementById('sermonTakeaway').innerText = sermon.takeaway;
  document.getElementById('sermonNotes').innerText = sermon.notes;
  document.getElementById('sermonTranscript').innerText = sermon.transcript;
  document.getElementById('commentCount').innerText = (sermonComments[title] || []).length;
  
  const videoContainer = document.getElementById('sermonVideoContainer');
  videoContainer.innerHTML = `<iframe src="https://www.youtube.com/embed/${sermon.videoId}" style="position:absolute;top:0;left:0;width:100%;height:100%;border-radius:3px" allowfullscreen></iframe>`;
  
  renderSermonComments(title);
  
  const modal = new bootstrap.Modal(document.getElementById('sermonDetailModal'));
  modal.show();
  
  window.currentSermonTitle = title;
}

function renderSermonComments(title) {
  const comments = sermonComments[title] || [];
  const list = document.getElementById('commentsList');
  list.innerHTML = '';
  comments.forEach((c, i) => {
    list.innerHTML += `<div style="border-bottom:1px solid var(--border);padding:12px 0;font-size:0.85rem"><div style="display:flex;justify-content:space-between"><strong>${c.name}</strong> <span style="color:var(--ink-muted);font-size:0.75rem">${c.date}</span></div><p style="margin:6px 0;color:var(--ink-muted)">${c.text}</p><button class="btn btn-sm btn-link" style="padding:0;font-size:0.75rem" onclick="replyComment(${i}, '${title}')">Reply</button></div>`;
  });
}

function submitSermonComment(e) {
  e.preventDefault();
  const title = window.currentSermonTitle;
  const text = document.getElementById('commentText').value;
  if (!text || !title) return;
  if (!sermonComments[title]) sermonComments[title] = [];
  sermonComments[title].push({ name:'You', date:'Just now', text:text });
  document.getElementById('commentText').value = '';
  renderSermonComments(title);
  document.getElementById('commentCount').innerText = sermonComments[title].length;
  showToast('Comment posted! ✓');
}

function toggleFavoriteSermon(btn, title) {
  const idx = favoriteSermons.findIndex(s => s.title === title);
  if (idx > -1) {
    favoriteSermons.splice(idx, 1);
    if (btn && btn.querySelector) btn.querySelector('i').classList.remove('bi-heart-fill');
    if (btn && btn.querySelector) btn.querySelector('i').classList.add('bi-heart');
  } else {
    const sermon = sermons.find(s => s.title === title);
    if (sermon) {
      favoriteSermons.push(sermon);
      if (btn && btn.querySelector) btn.querySelector('i').classList.add('bi-heart-fill');
      if (btn && btn.querySelector) btn.querySelector('i').classList.remove('bi-heart');
    }
  }
  showToast(idx > -1 ? 'Removed from favorites' : 'Added to favorites! ♡');
}

function rateSermon(stars) {
  const title = window.currentSermonTitle;
  const sermon = sermons.find(s => s.title === title);
  if (sermon) {
    sermon.rating = ((sermon.rating * 10 + stars) / 11).toFixed(1);
    showToast(`Rated ${stars} ⭐`);
    const stars_el = document.querySelectorAll('#sermonDetailModal .btn-sm[style*="background:none"]');
    stars_el.forEach((s, i) => s.innerText = i < stars ? '★' : '☆');
  }
}

function shareSermon(source) {
  const title = window.currentSermonTitle;
  const text = `Check out "${title}" from Anointed in Living Christ`;
  window.currentSermonText = text;
  showToast('Share option opened!');
}

function shareToWhatsApp() {
  const text = encodeURIComponent(window.currentSermonText || 'Check out our latest sermon!');
  window.open(`https://wa.me/?text=${text}`, '_blank');
}

function shareToFacebook() {
  const url = encodeURIComponent(window.location.href);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
}

function shareToX() {
  const text = encodeURIComponent(window.currentSermonText || 'Check out our latest sermon!');
  window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
}

function shareToInstagram() {
  showToast('Open Instagram to share! 📱');
}

function copyLink() {
  navigator.clipboard.writeText(window.location.href);
  showToast('Link copied to clipboard! 📋');
}

function downloadSermon() {
  showToast('Download started... 📥');
}


// ── MEMBERSHIP ──
function submitMembershipForm() { showToast('Thank you! We will contact you soon. God bless 🙏'); document.getElementById('membershipForm').reset(); return false; }