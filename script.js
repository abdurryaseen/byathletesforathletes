const API_BASE = "https://byathletesforathletes-admin.vercel.app";

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[c]);
}

function starsSvg(count, size) {
  let html = "";
  for (let i = 0; i < 5; i++) {
    const color = i < count ? "#22c55e" : "rgba(255,255,255,0.15)";
    html += `<svg width="${size}" height="${size}" viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L1.4 7.8l6-.8L10 1.5z" fill="${color}"></path></svg>`;
  }
  return html;
}

(() => {
  const summaryEl = document.getElementById("reviewsSummary");
  const gridEl = document.getElementById("reviewsGrid");
  if (!summaryEl || !gridEl) return;

  fetch(`${API_BASE}/api/reviews`)
    .then((res) => (res.ok ? res.json() : []))
    .then((rows) => {
      if (!rows.length) {
        summaryEl.style.display = "none";
        gridEl.innerHTML = '<p class="text-center text-white/50">No reviews yet. Be the first to leave one.</p>';
        return;
      }

      const avg = rows.reduce((sum, r) => sum + r.rating, 0) / rows.length;
      const avgDisplay = avg.toFixed(1);
      const avgRounded = Math.round(avg);
      summaryEl.innerHTML = `<div class="flex gap-0.5" role="img" aria-label="${avgRounded} out of 5 stars">${starsSvg(avgRounded, 18)}</div><span>${avgDisplay} from ${rows.length} review${rows.length === 1 ? "" : "s"}</span>`;

      gridEl.innerHTML = rows
        .map((r) => {
          const roleLine = r.role ? `<p class="text-xs text-white/50">${escapeHtml(r.role)}</p>` : "";
          return `<figure class="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div class="flex gap-0.5" role="img" aria-label="${r.rating} out of 5 stars">${starsSvg(r.rating, 18)}</div>
            <blockquote class="mt-4 text-sm leading-relaxed text-white/80">“${escapeHtml(r.body)}”</blockquote>
            <figcaption class="mt-4"><p class="font-bold">${escapeHtml(r.name)}</p>${roleLine}</figcaption>
          </figure>`;
        })
        .join("");
    })
    .catch(() => {});
})();

(() => {
  const reviewForm = document.getElementById("review-form");
  if (!reviewForm) return;

  const stars = [...reviewForm.querySelectorAll('[role="radio"]')];
  const submitBtn = reviewForm.querySelector('button[type="submit"]');
  const nameInput = reviewForm.querySelector('input[aria-label="Your name"]');
  const roleInput = reviewForm.querySelector('input[aria-label="Who you are"]');
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
    submitBtn.disabled = true;
    fetch(`${API_BASE}/api/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: nameInput.value.trim(),
        role: roleInput.value.trim(),
        rating,
        body: textArea.value.trim(),
      }),
    })
      .then(() => {
        reviewForm.innerHTML =
          '<p class="text-center text-white/80">Thanks for sharing your experience! Your review will appear once it is checked.</p>';
      })
      .catch(() => {
        submitBtn.disabled = false;
      });
  });
})();

(() => {
  const newsletterForm = document.getElementById("newsletter-form");
  if (!newsletterForm) return;

  const firstNameInput = newsletterForm.querySelector('input[aria-label="First name"]');
  const lastNameInput = newsletterForm.querySelector('input[aria-label="Last name"]');
  const emailInput = newsletterForm.querySelector('input[aria-label="Email"]');
  const phoneInput = newsletterForm.querySelector('input[aria-label="Phone number"]');
  const submitBtn = newsletterForm.querySelector('button[type="submit"]');

  newsletterForm.addEventListener("submit", (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    fetch(`${API_BASE}/api/newsletter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: firstNameInput.value.trim(),
        lastName: lastNameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
      }),
    })
      .then(() => {
        newsletterForm.innerHTML =
          '<p class="text-center text-white/80">You\'re on the list! Keep an eye on your inbox for weekly recruiting tips.</p>';
      })
      .catch(() => {
        submitBtn.disabled = false;
      });
  });
})();
