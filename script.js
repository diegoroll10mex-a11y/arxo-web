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

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isPhone = window.matchMedia("(max-width: 860px)").matches;
const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));

// ---------- Entrada del héroe ----------
requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.add("is-loaded")));

// ---------- Todo lo que depende del scroll, en un solo cuadro ----------
const nav = document.getElementById("nav");
const heroCopy = document.querySelector("[data-hero-copy]");
const heroStage = document.querySelector("[data-hero-stage]");
const manifesto = document.querySelector(".manifesto");
const revealText = document.querySelector("[data-reveal-text]");

// Parte el manifiesto en palabras; la última frase se enciende en azul.
const words = [];
if (revealText) {
  const text = revealText.textContent.trim();
  const blueFrom = text.indexOf("ese siempre eres tú.");
  revealText.textContent = "";
  let cursor = 0;
  text.split(" ").forEach((word, i, all) => {
    const span = document.createElement("span");
    span.className = "w" + (cursor >= blueFrom ? " blue" : "");
    span.textContent = word;
    revealText.appendChild(span);
    if (i < all.length - 1) revealText.appendChild(document.createTextNode(" "));
    words.push(span);
    cursor += word.length + 1;
  });
}

let ticking = false;
function onScroll() {
  const y = window.scrollY;
  const vh = window.innerHeight;
  nav.classList.toggle("is-scrolled", y > 8);

  if (!reduceMotion && !isPhone) {
    // El texto del héroe se aleja y el teléfono se acerca.
    const p = clamp(y / (vh * 0.9));
    heroCopy.style.transform = `translate3d(0, ${-p * 90}px, 0) scale(${1 - p * 0.06})`;
    heroCopy.style.opacity = String(1 - p * 1.25);
    heroCopy.style.filter = `blur(${p * 10}px)`;
    heroStage.style.transform = `translate3d(0, ${-p * 110}px, 0) scale(${1 + p * 0.1})`;
  }

  if (manifesto && words.length) {
    const rect = manifesto.getBoundingClientRect();
    const progress = clamp(-rect.top / (rect.height - vh));
    const lit = reduceMotion ? words.length : Math.round(progress * 1.15 * words.length);
    words.forEach((w, i) => w.classList.toggle("on", i < lit));
  }
  ticking = false;
}
window.addEventListener("scroll", () => {
  if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
}, { passive: true });
window.addEventListener("resize", onScroll);
onScroll();

// ---------- Conversación que se escribe sola en el héroe ----------
const thread = document.querySelector("[data-live-thread]");
if (thread && !reduceMotion) {
  const items = [...thread.querySelectorAll("[data-step]")];
  const typing = thread.querySelector("[data-typing]");
  // [momento en ms, acción]
  const script = [
    [500, () => show(0)],
    [1300, () => typing.classList.add("is-on")],
    [2500, () => { typing.classList.remove("is-on"); show(2); }],
    [4000, () => show(3)],
    [4700, () => typing.classList.add("is-on")],
    [5800, () => { typing.classList.remove("is-on"); show(5); }],
    [6500, () => show(6)],
  ];
  const show = (step) => items.find((el) => el.dataset.step === String(step))?.classList.add("is-shown");
  let timers = [];
  let running = false;

  function play() {
    thread.classList.add("is-playing");
    items.forEach((el) => el.classList.remove("is-shown"));
    typing.classList.remove("is-on");
    timers = script.map(([t, fn]) => setTimeout(fn, t));
    timers.push(setTimeout(play, 11000));
  }
  function stop() { timers.forEach(clearTimeout); timers = []; }

  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !running) { running = true; play(); }
    if (!entry.isIntersecting && running) { running = false; stop(); }
  }, { threshold: 0.1 }).observe(thread);
}

// ---------- Funciones: el paso activo cambia la pantalla del teléfono ----------
const steps = [...document.querySelectorAll("[data-step-index]")];
const screens = [...document.querySelectorAll("[data-screen]")];
function activate(index) {
  steps.forEach((s) => s.classList.toggle("is-active", s.dataset.stepIndex === String(index)));
  screens.forEach((s) => s.classList.toggle("is-active", s.dataset.screen === String(index)));
}
if (isPhone) {
  // En celular cada tarjeta lleva su propio teléfono con su pantalla.
  const device = document.querySelector(".scrolly-stage .device");
  steps.forEach((step) => {
    const clone = device.cloneNode(true);
    clone.removeAttribute("role");
    clone.removeAttribute("aria-label");
    clone.setAttribute("aria-hidden", "true");
    clone.querySelectorAll("[data-screen]").forEach((sc) => {
      if (sc.dataset.screen === step.dataset.stepIndex) sc.classList.add("is-active");
      else sc.remove();
    });
    const wrap = document.createElement("div");
    wrap.className = "step-device";
    wrap.appendChild(clone);
    step.prepend(wrap);
  });
} else {
  const stepObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) activate(entry.target.dataset.stepIndex); });
  }, { rootMargin: "-45% 0px -45% 0px" });
  steps.forEach((s) => stepObserver.observe(s));
}

// ---------- Giros: control segmentado ----------
const segmented = document.querySelector("[data-segmented]");
const tabs = [...segmented.querySelectorAll('[role="tab"]')];
function placeThumb(tab) {
  segmented.style.setProperty("--x", `${tab.offsetLeft}px`);
  segmented.style.setProperty("--w", `${tab.offsetWidth}px`);
}
function selectTab(tab) {
  const index = tabs.indexOf(tab);
  placeThumb(tab);
  // En celular el selector se desliza de lado; el giro elegido queda a la vista.
  segmented.scrollTo({ left: tab.offsetLeft - (segmented.clientWidth - tab.offsetWidth) / 2, behavior: reduceMotion ? "auto" : "smooth" });
  tabs.forEach((t) => {
    const active = t === tab;
    t.setAttribute("aria-selected", String(active));
    t.tabIndex = active ? 0 : -1;
    const panel = document.getElementById(t.getAttribute("aria-controls"));
    panel.hidden = !active;
    if (active) {
      panel.classList.remove("is-entering");
      void panel.offsetWidth;
      panel.classList.add("is-entering");
    }
  });
}
const selectedTab = () => tabs.find((t) => t.getAttribute("aria-selected") === "true");
placeThumb(selectedTab());
window.addEventListener("resize", () => placeThumb(selectedTab()));
document.fonts?.ready.then(() => placeThumb(selectedTab()));
tabs.forEach((tab, i) => {
  tab.addEventListener("click", () => selectTab(tab));
  tab.addEventListener("keydown", (e) => {
    const dir = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (!dir) return;
    e.preventDefault();
    const next = tabs[(i + dir + tabs.length) % tabs.length];
    selectTab(next);
    next.focus();
  });
});

// ---------- Entradas suaves al aparecer en pantalla ----------
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-in");
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
document.querySelectorAll(".fade").forEach((el) => fadeObserver.observe(el));

document.getElementById("year").textContent = new Date().getFullYear();
