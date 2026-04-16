// ── BIBLE STUDY TOOLS ──
function lookupVerse() {
  const book = document.getElementById('bibleBook').value;
  const chapter = document.getElementById('bibleChapter').value;
  const verse = document.getElementById('bibleVerse').value;

  if (!book || !chapter) {
    showToast('Please select a book and chapter', 'error');
    return;
  }

  // This is a simplified Bible API call - in a real implementation, you'd use a Bible API
  const reference = verse ? `${book} ${chapter}:${verse}` : `${book} ${chapter}`;

  // Mock verse data - replace with actual API call
  const mockVerses = {
    "John 3:16": "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.",
    "Jeremiah 29:11": "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.",
    "Psalms 23:1": "The Lord is my shepherd, I lack nothing.",
    "Philippians 4:13": "I can do all things through Christ who strengthens me.",
    "Romans 8:28": "And we know that in all things God works for the good of those who love him, who have been called according to his purpose."
  };

  const verseText = mockVerses[reference] || "This verse lookup feature connects to a Bible API. In a full implementation, this would fetch real Bible verses from a service like Bible Gateway or ESV API.";

  document.getElementById('verseReference').textContent = reference;
  document.getElementById('verseText').textContent = verseText;
  document.getElementById('verseResult').style.display = 'block';

  showToast(`Found verse: ${reference}`);
}

function shareVerse() {
  const reference = document.getElementById('verseReference').textContent;
  const text = document.getElementById('verseText').textContent;

  if (navigator.share) {
    navigator.share({
      title: `Bible Verse: ${reference}`,
      text: `${text} - ${reference}`,
      url: window.location.href
    });
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(`${text} - ${reference}`).then(() => {
      showToast('Verse copied to clipboard!');
    });
  }
}

function addToStudyPlan() {
  const reference = document.getElementById('verseReference').textContent;
  showToast(`Added ${reference} to your study plan!`);
  // In a real implementation, this would save to user's study plan
}

function highlightVerse() {
  const reference = document.getElementById('verseReference').textContent;
  const bookmarksContainer = document.getElementById('bookmarkedVerses');

  const bookmarkItem = document.createElement('div');
  bookmarkItem.className = 'bookmark-item';
  bookmarkItem.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid var(--border)">
      <span style="font-weight:500;font-size:0.85rem">${reference}</span>
      <button onclick="this.parentElement.remove()" style="background:none;border:none;color:var(--ink-muted);font-size:0.8rem;cursor:pointer">
        <i class="bi bi-x"></i>
      </button>
    </div>
  `;

  // Remove empty state if it exists
  const emptyState = bookmarksContainer.querySelector('p');
  if (emptyState) emptyState.remove();

  bookmarksContainer.appendChild(bookmarkItem);
  showToast(`Bookmarked ${reference}!`);
}

function startStudyPlan(planType) {
  const planNames = {
    'beginners': 'Beginner\'s Guide to Faith',
    'prayer': 'The Power of Prayer',
    'discipleship': 'Discipleship Journey'
  };

  showToast(`Starting study plan: ${planNames[planType]}`);
  // In a real implementation, this would navigate to the study plan page
}

function getNewVerse() {
  const verses = [
    { text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.", ref: "John 3:16" },
    { text: "Trust in the Lord with all your heart and lean not on your own understanding.", ref: "Proverbs 3:5" },
    { text: "I can do all things through Christ who strengthens me.", ref: "Philippians 4:13" },
    { text: "The Lord is my shepherd, I lack nothing.", ref: "Psalm 23:1" },
    { text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.", ref: "Jeremiah 29:11" }
  ];

  const randomVerse = verses[Math.floor(Math.random() * verses.length)];
  document.querySelector('.verse-text-small').textContent = randomVerse.text;
  document.querySelector('.verse-ref-small').textContent = randomVerse.ref;
}