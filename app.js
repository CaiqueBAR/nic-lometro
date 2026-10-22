import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getDatabase, ref, onValue, set
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const moodRef = ref(db, "mood");

const LEVELS = [
  { emoji: "😡", label: "Péssimo, foge 🚨" },
  { emoji: "😠", label: "Bicuda" },
  { emoji: "😤", label: "EMBUURADA" },
  { emoji: "🙁", label: "._." },
  { emoji: "😐", label: "Neutra" },
  { emoji: "🙂", label: "De boa" },
  { emoji: "😊", label: "Bem 💕" },
  { emoji: "😄", label: "Felizzinha 💖" },
  { emoji: "🥰", label: "UMA TATALUUGUINHA🐢" },
  { emoji: "🤩", label: "MUITOOOOOOOOOOOOOOOOOOO FELIZ 💞" }
];

const emojiEl = document.getElementById("emoji");
const levelLabelEl = document.getElementById("levelLabel");
const levelNumberEl = document.getElementById("levelNumber");
const barEl = document.getElementById("bar");
const slider = document.getElementById("slider");
const saveBtn = document.getElementById("saveBtn");
const savedMsg = document.getElementById("savedMsg");
const updatedEl = document.getElementById("updated");

const normalDisplay = document.getElementById("normalDisplay");
const raivaDisplay = document.getElementById("raivaDisplay");
const soninhoDisplay = document.getElementById("soninhoDisplay");
const raivaBtn = document.getElementById("raivaBtn");
const soninhoBtn = document.getElementById("soninhoBtn");
const tickNow = document.getElementById("tickNow");

// bolha com o número atual acompanha o pegador do slider
function moveTick(level) {
  const frac = (level - 1) / 9;
  tickNow.style.setProperty("--p", frac);
  tickNow.textContent = level;
}

// cor da barra acompanha o humor: bravo (vermelho) → apaixonada (rosa)
const BAR_COLORS = [
  { from: "#f05a45", to: "#d62828", glow: "rgba(214, 40, 40, 0.55)" },
  { from: "#f87040", to: "#e14b22", glow: "rgba(225, 75, 34, 0.5)" },
  { from: "#ff8c42", to: "#f26b21", glow: "rgba(242, 107, 33, 0.5)" },
  { from: "#ffab4a", to: "#ff8c42", glow: "rgba(255, 140, 66, 0.45)" },
  { from: "#ffc85c", to: "#ffab4a", glow: "rgba(255, 171, 74, 0.45)" },
  { from: "#ffb3c8", to: "#ff8fb3", glow: "rgba(255, 143, 179, 0.45)" },
  { from: "#ff9ec0", to: "#ff6fa5", glow: "rgba(255, 111, 165, 0.5)" },
  { from: "#ff85b3", to: "#ff4d8d", glow: "rgba(255, 77, 141, 0.55)" },
  { from: "#ff6fa5", to: "#f72585", glow: "rgba(247, 37, 133, 0.6)" },
  { from: "#ff4d8d", to: "#e0218a", glow: "rgba(224, 33, 138, 0.7)" }
];

function applyBarColor(level) {
  const c = BAR_COLORS[Math.max(1, Math.min(10, level)) - 1];
  barEl.style.setProperty("--bar-from", c.from);
  barEl.style.setProperty("--bar-to", c.to);
  barEl.style.setProperty("--bar-glow", c.glow);
}

function renderLevel(level) {
  const idx = Math.max(1, Math.min(10, level)) - 1;
  const l = LEVELS[idx];
  emojiEl.textContent = l.emoji;
  emojiEl.style.transform = "scale(1.15)";
  setTimeout(() => (emojiEl.style.transform = "scale(1)"), 200);
  levelLabelEl.textContent = l.label;
  levelNumberEl.textContent = level;
  barEl.style.width = (level * 10) + "%";
  applyBarColor(level);
  moveTick(level);
}

let currentStatus = null;

function applyStatus(status) {
  const next = status || null;
  const isRaiva = next === "raiva";
  const isSoninho = next === "soninho";
  const isNormal = !isRaiva && !isSoninho;

  normalDisplay.hidden = !isNormal;
  raivaDisplay.hidden = !isRaiva;
  soninhoDisplay.hidden = !isSoninho;
  // no modo raiva/soninho a barra some e o personagem ocupa o espaço
  document.body.classList.toggle("status-mode", !isNormal);

  // só treme quando ACABOU de entrar na raiva
  if (isRaiva && currentStatus !== "raiva") {
    document.body.classList.add("shake");
    setTimeout(() => document.body.classList.remove("shake"), 600);
  }
  currentStatus = next;
}

function formatTime(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  return "Atualizado em " + d.toLocaleString("pt-BR");
}

onValue(moodRef, (snap) => {
  const data = snap.val() || { level: 5, status: null, updatedAt: null };
  renderLevel(data.level ?? 5);
  slider.value = data.level ?? 5;
  applyStatus(data.status || null);
  updatedEl.textContent = formatTime(data.updatedAt);
});

slider.addEventListener("input", (e) => {
  const v = Number(e.target.value);
  const l = LEVELS[v - 1];
  emojiEl.textContent = l.emoji;
  levelLabelEl.textContent = l.label;
  levelNumberEl.textContent = v;
  barEl.style.width = (v * 10) + "%";
  applyBarColor(v);
  moveTick(v);
  // mexeu na barra = voltou pro humor normal, sem precisar do botão
  applyStatus(null);
});

async function saveMood({ level, status }) {
  const payload = {
    level: level ?? Number(slider.value),
    status: status ?? null,
    updatedAt: Date.now()
  };
  await set(moodRef, payload);
}

saveBtn.addEventListener("click", async () => {
  saveBtn.disabled = true;
  try {
    await saveMood({ level: Number(slider.value), status: null });
    savedMsg.style.color = "#d6336c";
    savedMsg.textContent = "Salvo 💗";
    setTimeout(() => (savedMsg.textContent = ""), 2000);
  } catch (err) {
    savedMsg.textContent = "Erro: " + err.message;
    savedMsg.style.color = "#ff8a8a";
  } finally {
    saveBtn.disabled = false;
  }
});

raivaBtn.addEventListener("click", async () => {
  await saveMood({ level: Number(slider.value), status: "raiva" });
});

soninhoBtn.addEventListener("click", async () => {
  await saveMood({ level: Number(slider.value), status: "soninho" });
});

