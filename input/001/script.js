const form = document.getElementById("calcForm");
const out = document.getElementById("out");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const a = Number(document.getElementById("a").value);
  const b = Number(document.getElementById("b").value);

  if (Number.isNaN(a) || Number.isNaN(b)) {
    out.textContent = "Sisend peab olema arv";
    return;
  }

  out.textContent = String(a + b);
});
