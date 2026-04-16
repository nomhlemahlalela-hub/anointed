// ── DAILY VERSE ──
const dailyVerses = [
  {text:"The Lord is my shepherd; I shall not want.",ref:"Psalm 23:1"},
  {text:"For God so loved the world that he gave his one and only Son.",ref:"John 3:16"},
  {text:"I can do all this through him who gives me strength.",ref:"Philippians 4:13"},
  {text:"For I know the plans I have for you, declares the Lord, plans to prosper you.",ref:"Jeremiah 29:11"},
  {text:"And we know that in all things God works for the good of those who love him.",ref:"Romans 8:28"},
  {text:"Trust in the Lord with all your heart and lean not on your own understanding.",ref:"Proverbs 3:5"},
  {text:"Be strong and courageous. Do not be afraid, for the Lord your God will be with you.",ref:"Joshua 1:9"},
  {text:"The Spirit of the Lord is on me, because he has anointed me to proclaim good news.",ref:"Luke 4:18"},
  {text:"Faith is confidence in what we hope for and assurance about what we do not see.",ref:"Hebrews 11:1"},
  {text:"Cast all your anxiety on him because he cares for you.",ref:"1 Peter 5:7"},
  {text:"Your word is a lamp for my feet, a light on my path.",ref:"Psalm 119:105"},
  {text:"Love is patient, love is kind. It does not envy, it does not boast.",ref:"1 Corinthians 13:4"},
  {text:"For by grace you have been saved through faith — it is the gift of God.",ref:"Ephesians 2:8"},
  {text:"Be still, and know that I am God.",ref:"Psalm 46:10"},
  {text:"If anyone is in Christ, the new creation has come: The old has gone, the new is here!",ref:"2 Corinthians 5:17"},
  {text:"Whatever you do, work at it with all your heart, as working for the Lord.",ref:"Colossians 3:23"},
  {text:"The Lord bless you and keep you; the Lord make his face shine on you.",ref:"Numbers 6:24-25"},
  {text:"Do not be anxious about anything, but present your requests to God.",ref:"Philippians 4:6"},
  {text:"He gives strength to the weary and increases the power of the weak.",ref:"Isaiah 40:29"},
  {text:"Taste and see that the Lord is good; blessed is the one who takes refuge in him.",ref:"Psalm 34:8"},
  {text:"Give thanks to the Lord, for he is good; his love endures forever.",ref:"Psalm 136:1"},
  {text:"Let your light shine before others, that they may see your good deeds.",ref:"Matthew 5:16"},
  {text:"This is the day that the Lord has made; let us rejoice and be glad in it.",ref:"Psalm 118:24"},
  {text:"Seek first his kingdom and his righteousness, and all these things will be given.",ref:"Matthew 6:33"},
  {text:"The Lord is close to the brokenhearted and saves those who are crushed in spirit.",ref:"Psalm 34:18"},
  {text:"Fear not, for I am with you; be not dismayed, for I am your God.",ref:"Isaiah 41:10"},
  {text:"He heals the brokenhearted and binds up their wounds.",ref:"Psalm 147:3"},
  {text:"For where two or three gather in my name, there am I with them.",ref:"Matthew 18:20"},
  {text:"The name of the Lord is a fortified tower; the righteous run to it and are safe.",ref:"Proverbs 18:10"},
  {text:"I am the resurrection and the life. Whoever believes in me will live, even though they die.",ref:"John 11:25"}
];

function loadDailyVerse() {
  const today = new Date();
  const idx   = (today.getDate() + today.getMonth() * 3) % dailyVerses.length;
  const v     = dailyVerses[idx];
  const el    = document.getElementById('dailyVerseText');
  const ref   = document.getElementById('dailyVerseRef');
  if (el)  el.innerText  = '\u201c' + v.text + '\u201d';
  if (ref) ref.innerText = '\u2014 ' + v.ref;
}

function shareDailyVerse() {
  const today = new Date();
  const v     = dailyVerses[(today.getDate() + today.getMonth() * 3) % dailyVerses.length];
  const text  = '\u201c' + v.text + '\u201d \u2014 ' + v.ref + ' | Anointed in Living Christ';
  if (navigator.share) navigator.share({ title:'Verse of the Day', text });
  else navigator.clipboard.writeText(text).then(() => showToast('Verse copied to clipboard!'));
}

function checkLiveStatus() {
  const now = new Date(); const day = now.getDay(); const hour = now.getHours();
  const banner = document.getElementById('liveBanner');
  if (banner) banner.style.display = (day === 0 && hour >= 10 && hour < 16) ? 'block' : 'none';
}