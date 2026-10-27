(() => {
  const reviewForm = document.getElementById("review-form");
  if (!reviewForm) return;

  const stars = [...reviewForm.querySelectorAll('[role="radio"]')];
  const submitBtn = reviewForm.querySelector('button[type="submit"]');
  const nameInput = reviewForm.querySelector('input[aria-label="Your name"]');
  const textArea = reviewForm.querySelector("textarea");
  let rating = 0;

  function paintStars() {
    stars.forEach((btn, i) => {
      const path = btn.querySelector("path");
      path.setAttribute("fill", i < rating ? "#22c55e" : "rgba(255,255,255,0.15)");
      btn.setAttribute("aria-checked", i < rating ? "true" : "false");
    });
  }

  function checkValid() {
    submitBtn.disabled = !(rating > 0 && nameInput.value.trim() && textArea.value.trim());
  }

  stars.forEach((btn, i) => {
    btn.addEventListener("click", () => {
      rating = i + 1;
      paintStars();
      checkValid();
    });
  });

  [nameInput, textArea].forEach((el) => el.addEventListener("input", checkValid));

  reviewForm.addEventListener("submit", (e) => {
    e.preventDefault();
    reviewForm.innerHTML =
      '<p class="text-center text-white/80">Thanks for sharing your experience! Your review will appear once it is checked.</p>';
  });
})();

(() => {
  const newsletterForm = document.getElementById("newsletter-form");
  if (!newsletterForm) return;

  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    newsletterForm.innerHTML =
      '<p class="text-center text-white/80">You\'re on the list! Keep an eye on your inbox for weekly recruiting tips.</p>';
  });
})();
