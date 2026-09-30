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
const pad = (n) => String(n).padStart(3, "0");

// ---------- Pantalla de turnos: dígitos de siete segmentos ----------
const SEGMENTS = {
  a: "12,0 44,0 48,4 44,8 12,8 8,4",
  b: "48,8 52,12 52,42 48,46 44,42 44,12",
  c: "48,50 52,54 52,84 48,88 44,84 44,54",
  d: "12,88 44,88 48,92 44,96 12,96 8,92",
  e: "8,50 12,54 12,84 8,88 4,84 4,54",
  f: "8,8 12,12 12,42 8,46 4,42 4,12",
  g: "12,44 44,44 48,48 44,52 12,52 8,48",
};
const DIGITS = ["abcdef", "bc", "abged", "abgcd", "fgbc", "afgcd", "afgedc", "abc", "abcdefg", "abcfgd"];

function digitSvg() {
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 0 56 96");
  svg.setAttribute("class", "digit");
  svg.setAttribute("aria-hidden", "true");
  const g = document.createElementNS(ns, "g");
  g.setAttribute("transform", "skewX(-6) translate(5 0)");
  for (const [name, points] of Object.entries(SEGMENTS)) {
    const p = document.createElementNS(ns, "polygon");
    p.setAttribute("points", points);
    p.setAttribute("class", "seg");
    p.dataset.seg = name;
    g.appendChild(p);
  }
  svg.appendChild(g);
  return svg;
}

const numberEl = document.getElementById("turno");
const srNumber = numberEl.querySelector(".sr-only");
const digitEls = [digitSvg(), digitSvg(), digitSvg()];
digitEls.forEach((d) => numberEl.appendChild(d));

function showNumber(n) {
  pad(n).split("").forEach((ch, i) => {
    const on = DIGITS[Number(ch)];
    digitEls[i].querySelectorAll(".seg").forEach((s) => s.classList.toggle("on", on.includes(s.dataset.seg)));
  });
  srNumber.textContent = `Turno ${pad(n)}`;
}

// Turnos de ejemplo que va atendiendo el bot.
const EVENTS = [
  ["Clínica Sonrisa", "Recordatorio enviado · mañana 10:30"],
  ["Barbería El Güero", "Precio y horario respondidos"],
  ["Inmobiliaria Norte", "Prospecto calificado · crédito Infonavit"],
  ["Consultorio Dra. Ruiz", "Pago recordado · liga enviada"],
  ["Barbería El Güero", "Lugar liberado · cliente avisado"],
  ["Inmobiliaria Norte", "Visita agendada · casa en venta"],
  ["Clínica Sonrisa", "Cita agendada · jueves 17:30"],
];

let turn = 24;
let eventIndex = 0;
const board = document.getElementById("board");
const speed = document.getElementById("speed");
const takeNum = document.getElementById("take-num");
showNumber(turn);

function serveNext() {
  const [who, what] = EVENTS[eventIndex % EVENTS.length];
  eventIndex += 1;

  const row = document.createElement("li");
  row.className = "is-new";
  row.innerHTML = `<span class="b-num">${pad(turn)}</span><span class="b-who"></span><span class="b-what"></span>`;
  row.querySelector(".b-who").textContent = who;
  row.querySelector(".b-what").textContent = what;
  board.prepend(row);
  while (board.children.length > 3) board.lastElementChild.remove();

  turn += 1;
  showNumber(turn);
  speed.textContent = `${2 + (eventIndex % 3)} s`;
  takeNum.textContent = pad(turn + 1);
}

if (!reduceMotion) {
  let timer = null;
  const start = () => { if (!timer) timer = setInterval(serveNext, 3600); };
  const stop = () => { clearInterval(timer); timer = null; };
  // Solo avanza cuando la pantalla está a la vista.
  new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop())).observe(numberEl);
  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : null));
}

// ---------- Ventanillas por giro ----------
const tabs = [...document.querySelectorAll(".window-tab")];
function selectTab(tab) {
  tabs.forEach((t) => {
    const active = t === tab;
    t.classList.toggle("is-active", active);
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
tabs.forEach((tab, i) => {
  tab.addEventListener("click", () => selectTab(tab));
  tab.addEventListener("keydown", (e) => {
    const keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const next = tabs[(i + keys[e.key] + tabs.length) % tabs.length];
    selectTab(next);
    next.focus();
  });
});

// ---------- Dispensador: el boleto se arranca al tomarlo ----------
const ticket = document.getElementById("take-turn");
ticket.addEventListener("click", () => {
  ticket.classList.add("is-pulled");
  setTimeout(() => ticket.classList.remove("is-pulled"), 1200);
});

document.getElementById("year").textContent = new Date().getFullYear();
