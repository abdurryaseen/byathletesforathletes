document.querySelectorAll(".faq-item button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.closest(".faq-item");
    const isOpen = item.classList.contains("open");
    document.querySelectorAll(".faq-item.open").forEach((open) => open.classList.remove("open"));
    if (!isOpen) item.classList.add("open");
  });
});
