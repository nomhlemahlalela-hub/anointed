// ── RATING SYSTEM ──
document.addEventListener('DOMContentLoaded', function() {
  // Initialize rating stars
  const ratingStars = document.querySelectorAll('#ratingStars i');
  ratingStars.forEach(star => {
    star.addEventListener('click', function() {
      const rating = parseInt(this.getAttribute('data-rating'));
      document.getElementById('selectedRating').value = rating;

      // Update star display
      ratingStars.forEach((s, index) => {
        if (index < rating) {
          s.classList.add('active');
        } else {
          s.classList.remove('active');
        }
      });
    });
  });

  // Schedule event notifications
  scheduleEventNotifications();
});

function submitFeedback() {
  const event = document.getElementById('feedbackEvent').value;
  const rating = document.getElementById('selectedRating').value;
  const feedback = document.getElementById('feedbackText').value.trim();
  const name = document.getElementById('feedbackName').value.trim();
  const email = document.getElementById('feedbackEmail').value.trim();
  const anonymous = document.getElementById('feedbackAnonymous').checked;
  const msg = document.getElementById('feedbackMsg');

  if (!event) {
    msg.style.color = '#c94040';
    msg.innerText = 'Please select an event.';
    return;
  }

  if (!rating || rating === '0') {
    msg.style.color = '#c94040';
    msg.innerText = 'Please provide a rating.';
    return;
  }

  if (!feedback) {
    msg.style.color = '#c94040';
    msg.innerText = 'Please share your feedback.';
    return;
  }

  try {
    const feedbackData = {
      event,
      rating: parseInt(rating),
      feedback,
      anonymous,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    if (!anonymous && name) feedbackData.name = name;
    if (!anonymous && email) feedbackData.email = email;

    db.collection('feedback').add(feedbackData);

    msg.style.color = '#2d7a4f';
    msg.innerText = '✓ Thank you for your feedback!';

    // Clear form
    document.getElementById('feedbackEvent').value = '';
    document.getElementById('selectedRating').value = '0';
    document.getElementById('feedbackText').value = '';
    document.getElementById('feedbackName').value = '';
    document.getElementById('feedbackEmail').value = '';
    document.getElementById('feedbackAnonymous').checked = false;

    // Reset stars
    document.querySelectorAll('#ratingStars i').forEach(star => {
      star.classList.remove('active');
    });

    showToast('Feedback submitted successfully!');
  } catch (e) {
    msg.style.color = '#c94040';
    msg.innerText = 'Something went wrong. Please try again.';
  }
}