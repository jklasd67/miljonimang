async function init() {
  try {
    const res = await fetch("./data.json");
    const data = await res.json();
    render(data.items);
  } catch (error) {
    document.body.textContent = "Andmete laadimine ebaõnnestus";
  }
}

function render(items) {
  const root = document.createElement("div");
  root.innerHTML = items.map((x) => `<article>${x.name}</article>`).join("");
  document.body.appendChild(root);
}

init();
