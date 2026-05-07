function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

const form = document.getElementById("userForm");
const messageEl = document.getElementById("message");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();

  if (!name) {
    messageEl.textContent = "Nimi on kohustuslik";
    return;
  }

  if (!email) {
    messageEl.textContent = "E-mail on kohustuslik";
    return;
  }

  if (!validateEmail(email)) {
    messageEl.textContent = "E-maili formaat on vale";
    return;
  }

  fetch("/api/submit-user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email }),
  })
    .then((res) => res.json())
    .then((data) => {
      messageEl.textContent = data.message || "Edukalt saadetud";
    })
    .catch(() => {
      messageEl.textContent = "Saatmine ebaonnestus";
    });
});
