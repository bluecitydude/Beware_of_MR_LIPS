// ======================================================
// 🔥 LIPS Horror Escape – Updated Build
// Updates in this version:
// ✔ Quiz box UI improved (no overflow, buttons auto-wrap, padding, smooth layout)
// ✔ Player speed increased from 3 → 3.8
// ======================================================

// GAME START TRIGGER

// ======================================================
// 🔊 AUDIO SYSTEM ADDED
// ======================================================

// Background horror ambience
let ambience = new Audio(
  "https://cdn.pixabay.com/download/audio/2022/03/15/audio_f918a1963e.mp3?filename=dark-ambient-110781.mp3"
);
ambience.loop = true;
ambience.volume = 0.45; // medium loud

// Ghost heartbeat proximity effect
let heartbeat = new Audio(
  "https://cdn.pixabay.com/download/audio/2024/01/13/audio_3af04c95f9.mp3?filename=heartbeat-140447.mp3"
);
heartbeat.loop = true;
heartbeat.volume = 0;

// Soft click when answering quiz
let quizSelect = new Audio(
  "https://cdn.pixabay.com/download/audio/2022/03/15/audio_61e66c7a14.mp3?filename=menu-select-110624.mp3"
);

// Level complete chime
let levelUpSound = new Audio(
  "https://cdn.pixabay.com/download/audio/2021/08/04/audio_b914f04c63.mp3?filename=success-1-6297.mp3"
);
levelUpSound.volume = 0.6;

// Final boss intense track
let finalBossTheme = new Audio(
  "https://cdn.pixabay.com/download/audio/2022/01/07/audio_0c87c84b3e.mp3?filename=horror-dark-ambient-soundscape-102277.mp3"
);
finalBossTheme.loop = true;
finalBossTheme.volume = 0.8;

let gameStarted = false;
document.getElementById("startBtn").onclick = () => {
  gameStarted = true;
  document.getElementById("startBtn").style.display = "none";

  // start audio safely (required click)
  ambience.play();
  heartbeat.play();
  heartbeat.volume = 0; // starts silent
};

// ======================================================
// CANVAS SETUP
// ======================================================
const c = document.getElementById("game");
const ctx = c.getContext("2d");

function resize() {
  c.width = innerWidth;
  c.height = innerHeight;
}
resize();
onresize = resize;

// ======================================================
// GAME STATE
// ======================================================
let lvl = 1,
  score = 0;
let running = true,
  inQuiz = false;

let player = { x: 300, y: 300, r: 16, spd: 3.8 }; // ← UPDATED SPEED
let ghost = { x: 900, y: 200, r: 20, spd: 0, active: false };

let orbs = [];
const orbCount = { 1: 2, 2: 3, 3: 4, 4: 6 };

// ======================================================
// QUESTION BANK (complete 30+)
// ======================================================
const QUESTIONS = [
  {
    q: "OS stands for?",
    a: 0,
    options: [
      "Operating System",
      "Open Source",
      "Output Service",
      "Optical Software"
    ]
  },
  {
    q: "Process scheduling decides?",
    a: 1,
    options: [
      "Memory size",
      "Which process runs next",
      "Battery usage",
      "BIOS load"
    ]
  },
  {
    q: "Virtual memory helps?",
    a: 2,
    options: [
      "Disk cleanup",
      "CPU speed",
      "Run bigger programs",
      "GPU rendering"
    ]
  },
  {
    q: "Deadlock means?",
    a: 3,
    options: [
      "Fast threads",
      "No process created",
      "Virus crash",
      "Processes waiting forever"
    ]
  },

  // DBMS
  {
    q: "Primary key is?",
    a: 0,
    options: ["Unique identifier", "Foreign ID", "Null column", "Temporary key"]
  },
  {
    q: "Foreign key refers to?",
    a: 2,
    options: [
      "Self column",
      "RAM address",
      "Primary key of another table",
      "Java ID"
    ]
  },
  {
    q: "SQL JOIN is used for?",
    a: 1,
    options: [
      "Formatting text",
      "Combining tables",
      "Delete DB",
      "Shutdown server"
    ]
  },
  {
    q: "Normalization removes?",
    a: 0,
    options: ["Redundancy", "CSS", "Runtime errors", "BIOS check"]
  },

  // Networking
  {
    q: "LAN stands for?",
    a: 0,
    options: [
      "Local Area Network",
      "Line Access Node",
      "Logical Array Net",
      "Linked Automation Net"
    ]
  },
  {
    q: "IP address identifies?",
    a: 1,
    options: ["OS", "Device on network", "Compiler", "Login password"]
  },
  { q: "HTTP is?", a: 3, options: ["IDE", "DBMS", "CMS", "Web protocol"] },
  {
    q: "Router used for?",
    a: 0,
    options: ["Packet routing", "Virus scan", "Rendering UI", "Gaming keyboard"]
  },

  // Web Tech
  {
    q: "CSS used for?",
    a: 3,
    options: ["Server", "Database", "Compiler", "Styling webpages"]
  },
  {
    q: "JS stands for?",
    a: 2,
    options: ["Java Syntax", "Just System", "JavaScript", "Jumbo Server"]
  },
  {
    q: "DOM controls?",
    a: 1,
    options: ["Hardware", "Webpage structure", "SQL index", "BIOS"]
  },

  // Programming
  {
    q: "Loop repeats until?",
    a: 0,
    options: ["Condition false", "Internet off", "Mouse move", "BIOS reset"]
  },
  {
    q: "Object is instance of?",
    a: 2,
    options: ["Loop", "RAM", "Class", "Port"]
  },
  {
    q: "Recursion calls?",
    a: 1,
    options: ["GPU", "Itself", "Compiler", "Driver"]
  },

  // Hardware
  {
    q: "ALU performs?",
    a: 0,
    options: ["Arithmetic/Logic", "Rendering", "Debug", "Upload"]
  },
  {
    q: "Register is?",
    a: 1,
    options: ["SSD storage", "Small CPU storage", "ROM chip", "GPU fan"]
  },
  {
    q: "Cache exists to?",
    a: 2,
    options: ["Delete RAM", "Store OS", "Speed access", "Reduce resolution"]
  },

  // FINAL BOSS
  {
    q: "Mr LIPS stands for?",
    a: 3,
    options: [
      "Linux Python Shell",
      "Large Input Packet Server",
      "Local Intel Process Sheet",
      "Lucky Institute Professor Spirit"
    ]
  },
  {
    q: "To escape you need?",
    a: 1,
    options: [
      "Laptop",
      "All papers + correct answers",
      "Student ID",
      "BIOS setup"
    ]
  },
  {
    q: "Exam success requires?",
    a: 0,
    options: ["Knowledge", "Luck", "Cheating", "Copying"]
  },
  {
    q: "Cheating leads to?",
    a: 2,
    options: ["Marks", "Memory", "Mr. LIPS chasing you", "Scholarship"]
  },
  {
    q: "Best weapon is?",
    a: 3,
    options: ["Hacking", "Running", "Shouting", "Studying"]
  },
  {
    q: "True victory means?",
    a: 1,
    options: ["Hiding", "Learning", "Breaking doors", "Ghost hunting"]
  },

  // RANDOM
  {
    q: "ASCII full form?",
    a: 2,
    options: [
      "Cache Storage",
      "Kernel Class",
      "American Standard Code for Information Interchange",
      "Access Script Syntax"
    ]
  },
  { q: "CPU brain is?", a: 0, options: ["CU + ALU", "RAM", "SMPS", "GPU"] },
  {
    q: "Compiler converts?",
    a: 1,
    options: ["Binary→XML", "Source→Machine code", "SQL→CSS", "RAM→ROM"]
  }
];

function rnd(a) {
  return a[Math.floor(Math.random() * a.length)];
}

// ======================================================
// INPUT
// ======================================================
let keys = {};
onkeydown = (e) => (keys[e.key] = true);
onkeyup = (e) => (keys[e.key] = false);
function clearKeys() {
  for (let k in keys) keys[k] = false;
}

// ======================================================
// SETUP LEVEL
// ======================================================
function setup() {
  running = true;
  inQuiz = false;
  orbs = [];
  for (let i = 0; i < orbCount[lvl]; i++)
    orbs.push({
      x: Math.random() * c.width * 0.8 + 90,
      y: Math.random() * c.height * 0.7 + 90,
      r: 18,
      Q: rnd(QUESTIONS),
      solved: false
    });

  player.x = 250;
  player.y = 300;
  ghost.x = c.width - 200;
  ghost.y = 200;
  ghost.active = lvl > 1;
  ghost.spd = lvl == 2 ? 2.6 : lvl == 3 ? 3.2 : lvl == 4 ? 4.6 : 0;

  document.getElementById("levelText").textContent = "LEVEL " + lvl;
  document.getElementById("scoreText").textContent = score;
  document.getElementById("quizBox").classList.add("hide");
}
setup();

// ======================================================
function loop() {
  if (gameStarted) {
    if (running && !inQuiz) tick();
    draw();
  }
  requestAnimationFrame(loop);
}
loop();

// ======================================================
// UPDATE
// ======================================================
function tick() {
  if (keys.w || keys.ArrowUp) player.y -= player.spd;
  if (keys.s || keys.ArrowDown) player.y += player.spd;
  if (keys.a || keys.ArrowLeft) player.x -= player.spd;
  if (keys.d || keys.ArrowRight) player.x += player.spd;

  player.x = Math.max(player.r, Math.min(c.width - player.r, player.x));
  player.y = Math.max(player.r, Math.min(c.height - player.r, player.y));

  if (ghost.active) {
    let dx = player.x - ghost.x,
      dy = player.y - ghost.y,
      d = Math.hypot(dx, dy) || 1;

    ghost.x += (dx / d) * ghost.spd;
    ghost.y += (dy / d) * ghost.spd;

    // 🔥 heartbeat based on distance
    let fear = Math.max(0, (260 - d) / 260);
    heartbeat.volume = fear * 0.9; // louder when ghost close

    if (d < player.r + ghost.r) lose();
  }

  for (let i = 0; i < orbs.length; i++) {
    let o = orbs[i];
    if (
      !o.solved &&
      Math.hypot(player.x - o.x, player.y - o.y) < player.r + o.r
    )
      openQuiz(i);
  }
}

// ======================================================
// RENDER (flashlight + radar)
// ======================================================
function draw() {
  ctx.fillStyle =
    lvl == 1
      ? "#070912"
      : lvl == 2
      ? "#031118"
      : lvl == 3
      ? "#190812"
      : "#310008";
  ctx.fillRect(0, 0, c.width, c.height);

  orbs.forEach((o) => {
    if (o.solved) return;
    let g = (Math.sin(Date.now() / 140) + 1) * 3;
    ctx.beginPath();
    ctx.arc(o.x, o.y, o.r + g * 0.2, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
  });

  if (ghost.active) {
    let f = (Math.sin(Date.now() / 200) + 1) * 3;
    ctx.beginPath();
    ctx.arc(ghost.x, ghost.y, ghost.r + f * 0.2, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
  }

  ctx.beginPath();
  ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2);
  ctx.fillStyle = "#00eaff";
  ctx.fill();

  let overlay = document.createElement("canvas");
  overlay.width = c.width;
  overlay.height = c.height;
  let o = overlay.getContext("2d");
  o.fillStyle = "rgba(0,0,0,0.96)";
  o.fillRect(0, 0, c.width, c.height);

  let rad = 240;
  let lg = o.createRadialGradient(
    player.x,
    player.y,
    0,
    player.x,
    player.y,
    rad
  );
  lg.addColorStop(0, "white");
  lg.addColorStop(1, "transparent");

  o.globalCompositeOperation = "destination-out";
  o.beginPath();
  o.arc(player.x, player.y, rad, 0, Math.PI * 2);
  o.fillStyle = lg;
  o.fill();

  ctx.drawImage(overlay, 0, 0);
  radar();
}

// ======================================================
// QUIZ (Now clean UI & no overflow)
// ======================================================
function openQuiz(i) {
  quizSelect.play();

  running = false;
  inQuiz = true;
  clearKeys();

  let Q = orbs[i].Q;
  document.getElementById("qText").textContent = Q.q;

  let opt = document.getElementById("options");
  opt.innerHTML = "";
  opt.style.display = "flex"; // <— Smooth grid layout
  opt.style.flexWrap = "wrap";
  opt.style.gap = "10px";
  opt.style.justifyContent = "center";

  Q.options.forEach((t, index) => {
    let b = document.createElement("button");
    b.textContent = t;
    b.style.padding = "10px";
    b.style.flex = "1 1 45%"; // <— No overflow; 2-per row layout
    b.style.fontSize = "15px";
    b.onclick = () => {
      if (index === Q.a) {
        orbs[i].solved = true;
        score += 10;
        document.getElementById("scoreText").textContent = score;
      }
      closeQuiz();
      checkFinish();
    };
    opt.appendChild(b);
  });

  document.getElementById("quizBox").classList.remove("hide");
}

function closeQuiz() {
  document.getElementById("quizBox").classList.add("hide");
  inQuiz = false;
  running = true;
  clearKeys();
}

// ======================================================
function checkFinish() {
  if (orbs.some((o) => !o.solved)) return;

  if (lvl < 4) {
    levelUpSound.play();
    alert("LEVEL " + lvl + " COMPLETE!");
    lvl++;
    setup();
  } else finalBoss();
}

// ======================================================
function finalBoss() {
  ambience.pause();
  finalBossTheme.play();

  alert("🔥 FINAL EXAM HALL — MR. LIPS IS NEAR 🔥");
  ghost.spd = 4.8;
  ghost.active = true;

  orbs = [];
  for (let i = 0; i < 6; i++)
    orbs.push({
      x: Math.random() * c.width * 0.8 + 100,
      y: Math.random() * c.height * 0.7 + 100,
      r: 22,
      Q: rnd(QUESTIONS),
      solved: false
    });

  let exit = false;
  const old = closeQuiz;
  closeQuiz = function () {
    old();
    if (orbs.every((o) => o.solved) && !exit) {
      exit = true;
      alert("📜 All papers collected — Escape to pass!");
    }
    if (
      exit &&
      Math.hypot(player.x - ghost.x, player.y - ghost.y) < player.r + 120
    )
      winFinal();
  };
}

// ======================================================
function winFinal() {
  running = false;
  alert("🎓 YOU PASSED!\nFinal Score: " + score);
  if (confirm("PLAY AGAIN?")) {
    lvl = 1;
    score = 0;
    setup();
  }
}

function lose() {
  running = false;
  clearKeys();
  if (confirm("❌ Mr. LIPS caught you.\nRetry?")) {
    lvl = 1;
    score = 0;
    setup();
  }
}

// ======================================================
function radar() {
  const size = 120,
    pad = 15,
    sc = 0.1;
  ctx.fillStyle = "rgba(0,0,0,.55)";
  ctx.fillRect(pad, pad, size, size);
  ctx.strokeStyle = "cyan";
  ctx.strokeRect(pad, pad, size, size);

  ctx.fillStyle = "cyan";
  ctx.fillRect(pad + player.x * sc - 2, pad + player.y * sc - 2, 4, 4);

  orbs.forEach((o) => {
    if (o.solved) return;
    ctx.fillStyle = "red";
    ctx.fillRect(pad + o.x * sc - 2, pad + o.y * sc - 2, 4, 4);
  });

  if (ghost.active) {
    ctx.fillStyle = "white";
    ctx.fillRect(pad + ghost.x * sc - 3, pad + ghost.y * sc - 3, 6, 6);
  }
}
