// ── BIBLE QUIZ ──
const quizQuestions = [
  {q:"How many days did God take to create the world?",opts:["5","6","7","8"],ans:1},
  {q:"Who was swallowed by a great fish?",opts:["Elijah","Moses","Jonah","Noah"],ans:2},
  {q:"What is the shortest verse in the Bible?",opts:["God is love","Jesus wept","Fear not","Be still"],ans:1},
  {q:"How many disciples did Jesus have?",opts:["10","11","12","13"],ans:2},
  {q:"Who wrote most of the Psalms?",opts:["Solomon","Moses","David","Paul"],ans:2},
  {q:"In what city was Jesus born?",opts:["Nazareth","Jerusalem","Bethlehem","Jericho"],ans:2},
  {q:"Who was the first man created by God?",opts:["Noah","Abraham","Moses","Adam"],ans:3},
  {q:"What river was Jesus baptised in?",opts:["Nile","Euphrates","Jordan","Tigris"],ans:2},
  {q:"How many books are in the New Testament?",opts:["24","27","30","33"],ans:1},
  {q:"Who denied Jesus three times?",opts:["John","Judas","Peter","Thomas"],ans:2},
  {q:"What did God create on the first day?",opts:["Animals","Light","Plants","Water"],ans:1},
  {q:"Which book comes first in the New Testament?",opts:["Mark","Luke","John","Matthew"],ans:3},
  {q:"How many plagues did God send on Egypt?",opts:["7","10","12","9"],ans:1},
  {q:"Who built the ark?",opts:["Abraham","Noah","Moses","David"],ans:1},
  {q:"What was the name of the garden where Adam and Eve lived?",opts:["Gethsemane","Eden","Canaan","Goshen"],ans:1},
  {q:"How many commandments did God give Moses?",opts:["5","8","10","12"],ans:2},
  {q:"Who was thrown into the lion's den?",opts:["Elijah","Ezekiel","Daniel","Jeremiah"],ans:2},
  {q:"What is the first book of the Bible?",opts:["Exodus","Genesis","Leviticus","Numbers"],ans:1},
  {q:"How many times did Israelites march around Jericho?",opts:["3","5","7","9"],ans:2},
  {q:"Who was the mother of Jesus?",opts:["Martha","Elizabeth","Mary","Sarah"],ans:2},
  {q:"What did Jesus turn water into at the wedding in Cana?",opts:["Milk","Honey","Wine","Oil"],ans:2},
  {q:"Who betrayed Jesus for 30 pieces of silver?",opts:["Peter","Thomas","Judas","James"],ans:2},
  {q:"On which day did Jesus rise from the dead?",opts:["First day","Second day","Third day","Fourth day"],ans:2},
  {q:"Who was the first king of Israel?",opts:["David","Solomon","Saul","Samuel"],ans:2},
  {q:"What language was most of the Old Testament originally written in?",opts:["Greek","Aramaic","Hebrew","Latin"],ans:2},
  {q:"How many sons did Jacob have?",opts:["10","11","12","13"],ans:2},
  {q:"Who led the Israelites out of Egypt?",opts:["Abraham","Moses","Joshua","Aaron"],ans:1},
  {q:"What is the last book of the Bible?",opts:["Jude","Hebrews","Revelation","Acts"],ans:2},
  {q:"Who was known as the wisest man who ever lived?",opts:["David","Moses","Solomon","Paul"],ans:2},
  {q:"How many days and nights did it rain during the flood?",opts:["20","30","40","50"],ans:2}
];

const resultMessages = [
  { min:0,  max:10, title:"Keep Studying",  verse:'"Study to shew thyself approved unto God." — 2 Timothy 2:15' },
  { min:11, max:18, title:"Good Effort",    verse:'"For the word of God is alive and active." — Hebrews 4:12' },
  { min:19, max:24, title:"Well Done",      verse:'"Your word is a lamp to my feet and a light to my path." — Psalm 119:105' },
  { min:25, max:28, title:"Excellent",      verse:'"Blessed is the one who finds wisdom." — Proverbs 3:13' },
  { min:29, max:30, title:"Bible Champion", verse:'"Whatever you do, work at it with all your heart, as working for the Lord." — Colossians 3:23' }
];

let qIndex=0, qCorrect=0, qWrong=0, qStreak=0, qBestStreak=0;
let qAnswered=false, qTimerInterval=null, qTimeLeft=20;
let shuffledQuestions=[];

function switchQuizTab(tab) {
  document.getElementById('tabQuiz').classList.toggle('active', tab === 'quiz');
  document.getElementById('tabLeaderboard').classList.toggle('active', tab === 'leaderboard');
  document.getElementById('quizPanel').style.display        = tab === 'quiz'        ? 'block' : 'none';
  document.getElementById('leaderboardPanel').style.display = tab === 'leaderboard' ? 'block' : 'none';
  if (tab === 'leaderboard') loadLeaderboard();
}

function startQuiz() {
  shuffledQuestions = [...quizQuestions].sort(() => Math.random() - 0.5);
  qIndex=0; qCorrect=0; qWrong=0; qStreak=0; qBestStreak=0;
  document.getElementById('quizIntro').style.display  = 'none';
  document.getElementById('quizResult').style.display = 'none';
  document.getElementById('quizActive').style.display = 'block';
  updateScoreChips(); renderQuestion();
}

function renderQuestion() {
  qAnswered = false; clearInterval(qTimerInterval);
  const q   = shuffledQuestions[qIndex];
  const tot = shuffledQuestions.length;
  document.getElementById('quizQMeta').innerText        = `Question ${qIndex + 1} of ${tot}`;
  document.getElementById('quizQuestion').innerText     = q.q;
  document.getElementById('quizProgressFill').style.width = ((qIndex / tot) * 100) + '%';
  document.getElementById('quizFeedback').style.display = 'none';
  document.getElementById('quizNextBtn').style.display  = 'none';
  const opts = document.getElementById('quizOptions'); opts.innerHTML = '';
  q.opts.forEach((o, i) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-opt-btn';
    btn.innerHTML = `<span class="quiz-opt-letter">${['A','B','C','D'][i]}</span>${o}`;
    btn.onclick   = () => answerQuestion(i, btn, q);
    opts.appendChild(btn);
  });
  startTimer();
}

function startTimer() {
  qTimeLeft = 20; updateTimerUI();
  qTimerInterval = setInterval(() => {
    qTimeLeft--; updateTimerUI();
    if (qTimeLeft <= 0) { clearInterval(qTimerInterval); if (!qAnswered) timeUp(); }
  }, 1000);
}

function updateTimerUI() {
  const circle = document.getElementById('quizTimerCircle');
  circle.innerText = qTimeLeft;
  circle.classList.toggle('urgent', qTimeLeft <= 5);
}

function timeUp() {
  qAnswered = true; qWrong++; qStreak = 0; updateScoreChips();
  const q = shuffledQuestions[qIndex];
  document.querySelectorAll('.quiz-opt-btn').forEach((b, i) => { b.disabled = true; if (i === q.ans) b.classList.add('correct'); });
  showFeedback(false, "Time's up! The answer was: " + q.opts[q.ans]);
  document.getElementById('quizNextBtn').style.display = 'block';
}

function answerQuestion(chosen, btn, q) {
  if (qAnswered) return; qAnswered = true; clearInterval(qTimerInterval);
  const correct = chosen === q.ans;
  if (correct) { qCorrect++; qStreak++; if (qStreak > qBestStreak) qBestStreak = qStreak; }
  else { qWrong++; qStreak = 0; }
  updateScoreChips();
  document.querySelectorAll('.quiz-opt-btn').forEach((b, i) => { b.disabled = true; if (i === q.ans) b.classList.add('correct'); if (i === chosen && !correct) b.classList.add('wrong'); });
  showFeedback(correct, correct ? ['Correct! Praise God!','That\'s right!','Excellent!','Well done!'][Math.floor(Math.random()*4)] : 'The correct answer is: ' + q.opts[q.ans]);
  document.getElementById('quizNextBtn').style.display = 'block';
}

function showFeedback(correct, msg) {
  const el = document.getElementById('quizFeedback');
  el.style.display = 'block';
  el.className = 'quiz-feedback ' + (correct ? 'correct-fb' : 'wrong-fb');
  el.innerText = msg;
}

function nextQuestion() { qIndex++; if (qIndex >= shuffledQuestions.length) { showResult(); return; } renderQuestion(); }
function updateScoreChips() { document.getElementById('qCorrectCount').innerText = qCorrect; document.getElementById('qWrongCount').innerText = qWrong; document.getElementById('qStreak').innerText = qStreak; }

async function showResult() {
  clearInterval(qTimerInterval);
  document.getElementById('quizActive').style.display = 'none';
  document.getElementById('quizResult').style.display = 'block';
  document.getElementById('resultNum').innerHTML    = qCorrect + '<span class="result-score-denom">/30</span>';
  document.getElementById('resultCorrect').innerText = qCorrect;
  document.getElementById('resultWrong').innerText   = qWrong;
  document.getElementById('resultBest').innerText    = qBestStreak;
  const msg = resultMessages.find(m => qCorrect >= m.min && qCorrect <= m.max) || resultMessages[0];
  document.getElementById('resultTitle').innerText = msg.title;
  document.getElementById('resultVerse').innerText = msg.verse;
  const savedMsg = document.getElementById('resultSavedMsg');
  if (isLoggedIn && currentMember) {
    try {
      const ref  = db.collection('quizScores').doc(currentMember.uid);
      const snap = await ref.get();
      const prev = snap.exists ? snap.data() : null;
      if (!prev || qCorrect > prev.bestScore) {
        await ref.set({ uid: currentMember.uid, name: currentMember.name, email: currentMember.email, bestScore: qCorrect, totalPct: Math.round((qCorrect/30)*100), plays: (prev ? prev.plays : 0) + 1, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
        savedMsg.innerText = prev ? 'New personal best saved! 🎉' : 'Score saved to leaderboard!';
        loadProfileQuizStats();
      } else {
        await ref.update({ plays: firebase.firestore.FieldValue.increment(1) });
        savedMsg.innerText = `Your best is ${prev.bestScore}/30. Keep going!`;
      }
    } catch(e) {}
  } else {
    savedMsg.innerText = 'Sign in to save your score to the leaderboard.';
  }
}

async function loadLeaderboard() {
  const list = document.getElementById('lbList');
  list.innerHTML = '<div class="lb-empty">Loading...</div>';
  try {
    const snap = await db.collection('quizScores').orderBy('bestScore','desc').limit(20).get();
    if (snap.empty) { list.innerHTML = '<div class="lb-empty">No scores yet — be the first to play!</div>'; return; }
    const rankClass = ['r1','r2','r3'];
    const medals    = ['🥇','🥈','🥉'];
    let html = '';
    snap.docs.forEach((doc, i) => {
      const d        = doc.data();
      const initials = d.name ? d.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : '??';
      html += `<div class="lb-row"><div class="lb-rank ${rankClass[i]||''}">${medals[i]||(i+1)}</div><div class="lb-avatar">${initials}</div><div style="flex:1"><div class="lb-name">${d.name||'Anonymous'}</div><div class="lb-plays">${d.plays||1} play${(d.plays||1)!==1?'s':''}</div></div><div style="text-align:right"><div class="lb-score-num">${d.bestScore}<span style="font-size:0.8rem;font-weight:300;color:var(--ink-muted)">/30</span></div><div class="lb-score-sub">Best Score</div></div></div>`;
    });
    list.innerHTML = html;
    if (isLoggedIn && currentMember) {
      const myDoc = await db.collection('quizScores').doc(currentMember.uid).get();
      if (myDoc.exists) {
        const d        = myDoc.data();
        const myRank   = snap.docs.findIndex(doc => doc.id === currentMember.uid) + 1;
        const initials = currentMember.name.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase();
        document.getElementById('lbYourPosition').style.display = 'block';
        document.getElementById('lbYourRow').innerHTML = `<div class="lb-rank">${myRank > 0 ? '#'+myRank : '?'}</div><div class="lb-avatar" style="background:var(--gold);color:var(--ink)">${initials}</div><div style="flex:1"><div class="lb-name">${currentMember.name} <span style="font-size:0.6rem;background:var(--forest);color:white;padding:2px 7px;border-radius:2px;letter-spacing:0.08em;font-weight:600">YOU</span></div><div class="lb-plays">${d.plays||1} plays</div></div><div style="text-align:right"><div class="lb-score-num">${d.bestScore}/30</div><div class="lb-score-sub">Your Best</div></div>`;
      }
    }
  } catch(e) { list.innerHTML = '<div class="lb-empty">Could not load leaderboard.</div>'; }
}

function loadQuiz() {
  document.getElementById('quizIntro').style.display  = 'block';
  document.getElementById('quizActive').style.display = 'none';
  document.getElementById('quizResult').style.display = 'none';
  switchQuizTab('quiz');
}