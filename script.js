// ---------- Matrix rain ----------
(() => {
  const canvas = document.getElementById("matrix");
  const ctx = canvas.getContext("2d");
  const glyphs = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワン$HACKINU".split("");
  const size = 16;
  let cols, drops;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cols = Math.ceil(canvas.width / size);
    drops = Array.from({ length: cols }, () => Math.random() * -50);
  }

  function draw() {
    ctx.fillStyle = "rgba(5, 8, 5, 0.09)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${size}px monospace`;
    for (let i = 0; i < cols; i++) {
      const ch = glyphs[(Math.random() * glyphs.length) | 0];
      const y = drops[i] * size;
      ctx.fillStyle = Math.random() > 0.975 ? "#d9ffd0" : "#39ff14";
      ctx.fillText(ch, i * size, y);
      if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i] += 0.5;
    }
  }

  resize();
  window.addEventListener("resize", resize);
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let last = 0;
    (function loop(t) {
      if (t - last > 45) { draw(); last = t; }
      requestAnimationFrame(loop);
    })(0);
  }
})();

// ---------- Hero typing ----------
(() => {
  const el = document.getElementById("typed");
  const lines = [
    "> A stray Shiba found a laptop in the rain.",
    "> He learned the code. He found the rug.",
    "> Then he hacked it with a fair launch.",
    "> Hood up. Paws on keys. Join the pack.",
  ];
  let li = 0, ci = 0, deleting = false;
  function tick() {
    const line = lines[li];
    if (!deleting) {
      el.textContent = line.slice(0, ++ci);
      if (ci === line.length) { deleting = true; return setTimeout(tick, 2200); }
      return setTimeout(tick, 38 + Math.random() * 40);
    }
    el.textContent = line.slice(0, --ci);
    if (ci === 0) { deleting = false; li = (li + 1) % lines.length; return setTimeout(tick, 300); }
    setTimeout(tick, 16);
  }
  tick();
})();

// ---------- Mobile nav ----------
(() => {
  const nav = document.querySelector(".nav");
  document.getElementById("burger").addEventListener("click", () => nav.classList.toggle("open"));
  document.querySelectorAll("#navLinks a").forEach((a) => a.addEventListener("click", () => nav.classList.remove("open")));
})();

// ---------- Reveal on scroll + supply counter ----------
(() => {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      const counter = e.target.querySelector("[data-count]");
      if (counter) countUp(counter);
      io.unobserve(e.target);
    });
  }, { threshold: 0.15 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  function countUp(el) {
    const target = Number(el.dataset.count);
    const start = performance.now();
    const dur = 1600;
    (function step(now) {
      const p = Math.min((now - start) / dur, 1);
      const v = Math.floor(target * (1 - Math.pow(1 - p, 3)));
      el.textContent = v >= 1e9 ? "1B" : `${Math.floor(v / 1e6)}M`;
      if (p < 1) requestAnimationFrame(step);
    })(start);
  }
})();

// ---------- Interactive terminal ----------
(() => {
  const out = document.getElementById("termOut");
  const form = document.getElementById("termForm");
  const input = document.getElementById("termInput");
  const history = [];
  let hIdx = 0;

  function print(text, cls = "") {
    const div = document.createElement("div");
    if (cls) div.className = cls;
    div.textContent = text;
    out.appendChild(div);
    out.scrollTop = out.scrollHeight;
  }

  const commands = {
    help: () => [
      "available commands:",
      "  whoami       who is hacker inu",
      "  lore         the short version",
      "  ticker       token info",
      "  buy          how to get $HACKINU",
      "  manifesto    the rules of the pack",
      "  scan         scan for rugs",
      "  sudo pump    you know what this does",
      "  bark         ...",
      "  clear        clear the screen",
    ].join("\n"),
    whoami: () => "guest. but you could be a hacker. pull up your hood.",
    lore: () => "stray shiba > found laptop > learned code > saw the rugs > fair-launched $HACKINU on pump.fun > built a pack.",
    ticker: () => ["name:     Hacker Inu", "ticker:   $HACKINU", "chain:    Solana", "launch:   pump.fun (fair launch)", "supply:   1,000,000,000", "tax:      0%"].join("\n"),
    buy: () => "1. get a solana wallet  2. load SOL  3. open pump.fun & search $HACKINU  4. execute.",
    manifesto: () => "the rug was the bug. fair launch is the patch.",
    bark: () => ["WOOF.", "woof woof.", "*aggressive keyboard typing*", "bork.exe executed successfully."][(Math.random() * 4) | 0],
    clear: () => { out.innerHTML = ""; return null; },
    ls: () => "lore.txt  manifesto.txt  tokenomics.json  hood.png  rugs_exposed/",
    cat: () => "usage: try 'lore' or 'manifesto'",
    exit: () => "there is no exit. only the pack.",
    sudo: (args) => (args === "pump" ? null : "sudo: you need a better command. try 'sudo pump'"),
    "rm": () => "nice try. the only thing getting removed here is rugs.",
  };

  async function run(raw) {
    const line = raw.trim();
    print(line, "cmd");
    if (!line) return;
    const [cmd, ...rest] = line.split(/\s+/);
    const name = cmd.toLowerCase();
    const args = rest.join(" ").toLowerCase();

    if (name === "scan") return scan();
    if (name === "sudo" && args === "pump") return pump();

    const fn = commands[name];
    if (!fn) return print(`command not found: ${cmd}. type 'help'.`, "err");
    const res = fn(args);
    if (res) print(res, "ok");
  }

  function wait(ms) { return new Promise((r) => setTimeout(r, ms)); }

  async function scan() {
    input.disabled = true;
    print("[*] scanning the chain for rugs...", "warn");
    for (let i = 1; i <= 5; i++) {
      await wait(350);
      print(`[*] block ${Math.floor(Math.random() * 1e8)} ... ${i < 5 ? "suspicious dev wallet flagged" : "done"}`, i < 5 ? "warn" : "ok");
    }
    await wait(300);
    print("[+] $HACKINU: no presale, no team bags. clean. ✔", "ok");
    input.disabled = false; input.focus();
  }

  async function pump() {
    input.disabled = true;
    print("[sudo] password for guest: ********", "warn");
    await wait(500);
    print("ACCESS GRANTED", "ok");
    const bars = [2, 3, 2, 5, 4, 7, 6, 10, 9, 14];
    for (const b of bars) {
      await wait(160);
      print("█".repeat(b) + " ▲", "ok");
    }
    print("payload delivered. now go tell the pack.", "ok");
    input.disabled = false; input.focus();
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = input.value;
    if (v.trim()) { history.push(v); hIdx = history.length; }
    input.value = "";
    run(v);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && hIdx > 0) { input.value = history[--hIdx]; e.preventDefault(); }
    if (e.key === "ArrowDown") { hIdx = Math.min(hIdx + 1, history.length); input.value = history[hIdx] || ""; e.preventDefault(); }
  });

  document.getElementById("term").addEventListener("click", () => input.focus());

  print("HackOS v4.20 // secure shell established", "ok");
  print("welcome, guest. type 'help' to begin.", "ok");
})();

document.getElementById("year").textContent = new Date().getFullYear();
