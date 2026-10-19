import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getDatabase, ref, onValue, set
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const moodRef = ref(db, "mood");

const LEVELS = [
  { emoji: "😡", label: "Péssima, foge 🚨" },
  { emoji: "😠", label: "Bicuda" },
  { emoji: "😤", label: "EMBUURADA" },
  { emoji: "🙁", label: "Meio pra baixo" },
  { emoji: "😐", label: "._." },
  { emoji: "🙂", label: "De boa" },
  { emoji: "😊", label: "Bem 💕" },
  { emoji: "😄", label: "Felizzinha 💖" },
  { emoji: "🥰", label: " UMA TATALUUGUINHA💘" },
  { emoji: "🤩", label: "MUITOOOOOOOOOOOOOOOOOOOO FELIZ 💞" }
];

const emojiEl = document.getElementById("emoji");
const levelLabelEl = document.getElementById("levelLabel");
const levelNumberEl = document.getElementById("levelNumber");
const barEl = document.getElementById("bar");
const slider = document.getElementById("slider");
const saveBtn = document.getElementById("saveBtn");
const savedMsg = document.getElementById("savedMsg");
const updatedEl = document.getElementById("updated");

function render(level) {
  const idx = Math.max(1, Math.min(10, level)) - 1;
  const l = LEVELS[idx];
  emojiEl.textContent = l.emoji;
  emojiEl.style.transform = "scale(1.15)";
  setTimeout(() => (emojiEl.style.transform = "scale(1)"), 200);
  levelLabelEl.textContent = l.label;
  levelNumberEl.textContent = level;
  barEl.style.width = (level * 10) + "%";
}

function formatTime(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  return "Atualizado em " + d.toLocaleString("pt-BR");
}

onValue(moodRef, (snap) => {
  const data = snap.val() || { level: 5, updatedAt: null };
  render(data.level);
  slider.value = data.level;
  updatedEl.textContent = formatTime(data.updatedAt);
});

slider.addEventListener("input", (e) => {
  const v = Number(e.target.value);
  const l = LEVELS[v - 1];
  emojiEl.textContent = l.emoji;
  levelLabelEl.textContent = l.label;
  levelNumberEl.textContent = v;
  barEl.style.width = (v * 10) + "%";
});

saveBtn.addEventListener("click", async () => {
  saveBtn.disabled = true;
  try {
    await set(moodRef, {
      level: Number(slider.value),
      updatedAt: Date.now()
    });
    savedMsg.textContent = "Salvo 💗";
    setTimeout(() => (savedMsg.textContent = ""), 2000);
  } catch (err) {
    savedMsg.textContent = "Erro: " + err.message;
    savedMsg.style.color = "#ff8a8a";
  } finally {
    saveBtn.disabled = false;
  }
});
