// ============================================================
// CONFIGURA AQUÍ TU NÚMERO DE WHATSAPP
// Formato: 52 + número a 10 dígitos, sin espacios ni signos.
// Ejemplo: 525512345678
// ============================================================
const WHATSAPP_NUMBER = "524495458788";

// Arma todos los enlaces de WhatsApp con el número y el mensaje de cada botón.
document.querySelectorAll("[data-wa]").forEach((link) => {
  const text = encodeURIComponent(link.dataset.wa);
  link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  link.target = "_blank";
  link.rel = "noopener";
});

// Pestañas de giros (clínicas, barberías, inmobiliarias).
const tabs = document.querySelectorAll(".tab");
function selectTab(tab) {
  tabs.forEach((t) => {
    const active = t === tab;
    t.classList.toggle("active", active);
    t.setAttribute("aria-selected", String(active));
    t.tabIndex = active ? 0 : -1;
    document.getElementById(t.getAttribute("aria-controls")).hidden = !active;
  });
}
tabs.forEach((tab, i) => {
  tab.addEventListener("click", () => selectTab(tab));
  tab.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const next = tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length];
    selectTab(next);
    next.focus();
  });
});

document.getElementById("year").textContent = new Date().getFullYear();
