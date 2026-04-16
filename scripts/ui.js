// ── TOAST ──
function showToast(msg, type = 'success') {
  const el   = document.getElementById('toastEl');
  const icon = document.getElementById('toastIcon');
  const text = document.getElementById('toastMsg');
  el.className = 'toast-notification ' + type;
  icon.className = type === 'success' ? 'bi bi-check-circle-fill' : type === 'error' ? 'bi bi-x-circle-fill' : 'bi bi-info-circle-fill';
  text.innerText = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3800);
}


// ── LIVE CHAT ──
let chatOpen = false;
let chatMessages = [
  { type: 'received', content: 'Hello! Welcome to Anointed in Living Christ. How can we help you today?', time: 'Just now' }
];

function toggleChat() {
  const widget = document.getElementById('chatWidget');
  const window = document.getElementById('chatWindow');
  chatOpen = !chatOpen;
  if (chatOpen) {
    window.style.display = 'flex';
    widget.classList.add('open');
  } else {
    window.style.display = 'none';
    widget.classList.remove('open');
  }
}

function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const message = input.value.trim();
  if (!message) return;

  // Add user message
  addChatMessage('sent', message);

  // Clear input
  input.value = '';

  // Simulate response (in real implementation, this would connect to a chat service)
  setTimeout(() => {
    const responses = [
      "Thank you for your message. Our team will get back to you soon.",
      "We appreciate you reaching out. How else can we assist you?",
      "That's a great question! Let us help you with that.",
      "We're here to support you. Is there anything specific you'd like to know about our church?"
    ];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    addChatMessage('received', randomResponse);
  }, 1000 + Math.random() * 2000);
}

function addChatMessage(type, content) {
  const messagesContainer = document.getElementById('chatMessages');
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}`;
  messageDiv.innerHTML = `
    <div class="message-content">${content}</div>
    <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
  `;
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  // Show notification if chat is closed
  if (!chatOpen) {
    document.getElementById('chatNotification').style.display = 'flex';
  }
}

function handleChatKeyPress(event) {
  if (event.key === 'Enter') {
    sendChatMessage();
  }
}