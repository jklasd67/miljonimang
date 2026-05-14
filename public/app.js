const LEVEL_POINTS = [
  100, 200, 300, 500, 1000,
  2000, 4000, 8000, 16000, 32000,
  64000, 125000, 250000, 500000, 1000000,
];

const SAFETY_LEVELS = new Set([1000, 32000, 1000000]);

const state = {
  tasks: [],
  task: null,
  questions: [],
  currentIndex: 0,
  score: 0,
  ended: false,
  lifelines: {
    fifty: true,
    hint: true,
    audience: true,
  },
  disabledOptions: [],
};

const els = {
  taskView: document.getElementById("taskView"),
  gameView: document.getElementById("gameView"),
  resultView: document.getElementById("resultView"),
  taskList: document.getElementById("taskList"),
  taskTitle: document.getElementById("taskTitle"),
  levelLabel: document.getElementById("levelLabel"),
  difficulty: document.getElementById("difficulty"),
  questionText: document.getElementById("questionText"),
  options: document.getElementById("options"),
  feedback: document.getElementById("feedback"),
  resultSummary: document.getElementById("resultSummary"),
  progress: document.getElementById("progress"),
  levels: document.getElementById("levels"),
  fiftyBtn: document.getElementById("fiftyBtn"),
  hintBtn: document.getElementById("hintBtn"),
  audienceBtn: document.getElementById("audienceBtn"),
  quitBtn: document.getElementById("quitBtn"),
  restartBtn: document.getElementById("restartBtn"),
};

function getDifficultyLabel(difficulty) {
  if (difficulty === "easy") return "Lihtne";
  if (difficulty === "medium") return "Keskmine";
  return "Raske";
}

function getSafetyFallback(score) {
  const levels = [...SAFETY_LEVELS].sort((a, b) => a - b);
  let fallback = 0;
  for (const level of levels) {
    if (score >= level) fallback = level;
  }
  return fallback;
}

function showView(name) {
  els.taskView.classList.toggle("hidden", name !== "tasks");
  els.gameView.classList.toggle("hidden", name !== "game");
  els.resultView.classList.toggle("hidden", name !== "result");
}

function renderScoreboard() {
  els.levels.innerHTML = "";
  [...LEVEL_POINTS].reverse().forEach((points, reverseIndex) => {
    const level = LEVEL_POINTS.length - reverseIndex;
    const li = document.createElement("li");
    li.textContent = `${level}. küsimus - ${points.toLocaleString("et-EE")} punkti`;

    if (state.currentIndex + 1 === level && !state.ended) {
      li.classList.add("active");
    }

    if (SAFETY_LEVELS.has(points)) {
      li.textContent += " (turvatase)";
    }

    els.levels.appendChild(li);
  });
}

async function loadTasks() {
  const res = await fetch("/api/tasks");
  const data = await res.json();
  state.tasks = data.tasks || [];

  if (!state.tasks.length) {
    els.taskList.innerHTML = "<p>input/ kaustas ei leitud numbrilisi ülesandeid.</p>";
    return;
  }

  els.taskList.innerHTML = "";
  state.tasks.forEach((task) => {
    const item = document.createElement("article");
    item.className = "task-item";
    item.innerHTML = `
      <div>
        <strong>${task.id}</strong> - ${task.title}
      </div>
    `;

    const btn = document.createElement("button");
    btn.textContent = "Alusta";
    btn.addEventListener("click", () => startGame(task.id));

    item.appendChild(btn);
    els.taskList.appendChild(item);
  });
}

async function startGame(taskId) {
  const taskRes = await fetch(`/api/tasks/${taskId}`);
  const taskData = await taskRes.json();
  if (!taskRes.ok) {
    alert(taskData.error || "Ülesande laadimine ebaõnnestus");
    return;
  }

  const questionRes = await fetch("/api/game/questions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ taskId }),
  });
  const questionData = await questionRes.json();

  if (!questionRes.ok) {
    alert(questionData.error || "Küsimuste genereerimine ebaõnnestus");
    return;
  }

  state.task = taskData;
  state.questions = questionData.questions;
  state.currentIndex = 0;
  state.score = 0;
  state.ended = false;
  state.disabledOptions = [];
  state.lifelines = { fifty: true, hint: true, audience: true };

  els.taskTitle.textContent = `${taskData.id} - ${taskData.title}`;
  showView("game");
  renderQuestion();
}

function renderQuestion() {
  const q = state.questions[state.currentIndex];
  if (!q) {
    endGame(true);
    return;
  }

  els.feedback.className = "feedback hidden";
  els.feedback.textContent = "";

  els.levelLabel.textContent = `Küsimus ${state.currentIndex + 1} / 15`;
  els.difficulty.textContent = `Raskus: ${getDifficultyLabel(q.difficulty)}`;
  els.questionText.textContent = q.question;
  els.options.innerHTML = "";
  els.progress.style.width = `${((state.currentIndex) / 15) * 100}%`;

  q.options.forEach((optionText, index) => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.textContent = `${String.fromCharCode(65 + index)}. ${optionText}`;
    btn.disabled = state.disabledOptions.includes(index);
    btn.addEventListener("click", () => answer(index));
    els.options.appendChild(btn);
  });

  els.fiftyBtn.disabled = !state.lifelines.fifty;
  els.hintBtn.disabled = !state.lifelines.hint;
  els.audienceBtn.disabled = !state.lifelines.audience;

  renderScoreboard();
}

function answer(index) {
  if (state.ended) return;

  const q = state.questions[state.currentIndex];
  const isCorrect = index === q.correctIndex;

  els.feedback.classList.remove("hidden");

  if (isCorrect) {
    state.score = LEVEL_POINTS[state.currentIndex];
    els.feedback.className = "feedback correct";
    els.feedback.textContent = `Õige! ${q.explanation}`;

    state.currentIndex += 1;
    state.disabledOptions = [];

    if (state.currentIndex >= 15) {
      endGame(true);
      return;
    }

    setTimeout(() => renderQuestion(), 1000);
  } else {
    const fallback = getSafetyFallback(state.score);
    state.score = fallback;
    els.feedback.className = "feedback wrong";
    els.feedback.textContent = `Vale vastus. ${q.explanation}`;
    state.ended = true;
    setTimeout(() => endGame(false), 1300);
  }
}

function endGame(won) {
  state.ended = true;
  showView("result");

  if (won) {
    els.resultSummary.textContent = `Suurepärane! Läbisid kõik 15 küsimust ja teenisid ${state.score.toLocaleString("et-EE")} punkti.`;
    return;
  }

  els.resultSummary.textContent = `Mäng lõppes. Sinu lõppskoor on ${state.score.toLocaleString("et-EE")} punkti.`;
}

async function useHint() {
  if (!state.lifelines.hint) return;
  const q = state.questions[state.currentIndex];

  const res = await fetch("/api/game/hint", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question: q }),
  });
  const data = await res.json();

  state.lifelines.hint = false;
  alert(`Vihje: ${data.hint}`);
  renderQuestion();
}

function useFifty() {
  if (!state.lifelines.fifty) return;
  const q = state.questions[state.currentIndex];

  const wrong = [0, 1, 2, 3].filter((idx) => idx !== q.correctIndex);
  wrong.sort(() => 0.5 - Math.random());

  state.disabledOptions = wrong.slice(0, 2);
  state.lifelines.fifty = false;
  renderQuestion();
}

async function useAudience() {
  if (!state.lifelines.audience) return;
  const q = state.questions[state.currentIndex];

  const res = await fetch("/api/game/audience", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question: q }),
  });
  const data = await res.json();

  state.lifelines.audience = false;
  const lines = data.poll.map((p) => `${p.option} - ${p.percent}%`).join("\n");
  alert(`Publiku haaletus:\n${lines}`);
  renderQuestion();
}

function quitGame() {
  const confirmed = window.confirm("Kas oled kindel, et soovid mängu pooleli jätta?");
  if (!confirmed) return;

  state.ended = true;
  showView("result");
  els.resultSummary.textContent = `Mäng katkestati. Hetkeskoor: ${state.score.toLocaleString("et-EE")} punkti.`;
}

els.fiftyBtn.addEventListener("click", useFifty);
els.hintBtn.addEventListener("click", useHint);
els.audienceBtn.addEventListener("click", useAudience);
els.quitBtn.addEventListener("click", quitGame);
els.restartBtn.addEventListener("click", () => {
  showView("tasks");
  loadTasks();
});

loadTasks();
