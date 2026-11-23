const app = document.querySelector("#app");

app.innerHTML = `
  <canvas id="field" aria-label="Interactive generative particle field"></canvas>

  <header class="topbar">
    <div class="brand">
      <span class="brand-mark"></span>
      <span>RIFT / 001</span>
    </div>
    <button class="icon-button" id="pauseButton" type="button" aria-label="Pause animation">
      <span class="pause-icon"></span>
    </button>
  </header>

  <main>
    <section class="hero">
      <p class="eyebrow"><span></span> GENERATIVE FIELD</p>
      <h1>Order in<br><em>the unknown.</em></h1>
      <p class="intro">Move through the field. Every orbit<br>is drawn from a single moving point.</p>
    </section>

    <aside class="telemetry">
      <div>
        <span class="label">NODES</span>
        <strong id="nodeCount">180</strong>
      </div>
      <div>
        <span class="label">VELOCITY</span>
        <strong id="velocity">0.42</strong>
      </div>
    </aside>

    <button class="drift-button" id="driftButton" type="button">
      <span>SHIFT THE FIELD</span>
      <span class="arrow">↗</span>
    </button>
  </main>

  <footer>
    <span>RANDOM SYSTEM / LIVE</span>
    <span id="coordinates">X 000&nbsp;&nbsp; Y 000</span>
  </footer>
`;

const style = document.createElement("style");
style.textContent = `
  :root {
    color: #f4f1e8;
    background: #09090b;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-synthesis: none;
  }
  * { box-sizing: border-box; }
  html, body, #app { width: 100%; height: 100%; margin: 0; overflow: hidden; }
  body { background: #09090b; }
  #app { position: relative; isolation: isolate; }
  #field {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
  #app::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    pointer-events: none;
    background:
      radial-gradient(circle at 68% 46%, transparent 0 18%, rgba(9,9,11,.12) 48%, rgba(9,9,11,.82) 100%);
  }
  .topbar {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 88px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 56px;
    border-bottom: 1px solid rgba(255,255,255,.09);
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 13px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: .18em;
  }
  .brand-mark {
    width: 16px;
    height: 16px;
    border: 1px solid #ff5a36;
    transform: rotate(45deg);
    box-shadow: inset 5px 0 0 #ff5a36;
  }
  .icon-button {
    width: 42px;
    height: 42px;
    display: grid;
    place-items: center;
    border: 1px solid rgba(255,255,255,.16);
    border-radius: 50%;
    color: white;
    background: transparent;
    cursor: pointer;
    transition: .25s ease;
  }
  .icon-button:hover { border-color: #ff5a36; transform: rotate(8deg); }
  .pause-icon {
    width: 9px;
    height: 12px;
    border-left: 3px solid white;
    border-right: 3px solid white;
  }
  .icon-button.paused .pause-icon {
    width: 0;
    height: 0;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-left: 9px solid white;
    border-right: 0;
  }
  main {
    position: absolute;
    inset: 88px 56px 58px;
  }
  .hero {
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-54%);
  }
  .eyebrow {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 0 0 24px;
    color: #c9c6bd;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: .24em;
  }
  .eyebrow span {
    width: 26px;
    height: 1px;
    background: #ff5a36;
  }
  h1 {
    margin: 0;
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(62px, 7.1vw, 112px);
    line-height: .82;
    font-weight: 400;
    letter-spacing: -.07em;
  }
  h1 em {
    color: #ff5a36;
    font-weight: 400;
  }
  .intro {
    margin: 34px 0 0 8px;
    color: #aaa79f;
    font-size: 13px;
    line-height: 1.65;
  }
  .telemetry {
    position: absolute;
    right: 0;
    top: 54px;
    display: flex;
    flex-direction: column;
    gap: 22px;
  }
  .telemetry div {
    display: grid;
    grid-template-columns: 74px 54px;
    align-items: baseline;
    font-size: 11px;
  }
  .telemetry .label { color: #77746d; letter-spacing: .14em; }
  .telemetry strong {
    font-family: "Courier New", monospace;
    font-size: 12px;
    font-weight: 400;
  }
  .drift-button {
    position: absolute;
    right: 0;
    bottom: 22px;
    width: 182px;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px 0 18px;
    border: 1px solid rgba(255,255,255,.19);
    border-radius: 2px;
    color: #f4f1e8;
    background: rgba(9,9,11,.38);
    backdrop-filter: blur(12px);
    cursor: pointer;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: .14em;
    transition: .25s ease;
  }
  .drift-button:hover {
    background: #ff5a36;
    border-color: #ff5a36;
  }
  .arrow { font-size: 18px; font-weight: 300; }
  footer {
    position: absolute;
    left: 56px;
    right: 56px;
    bottom: 0;
    height: 58px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid rgba(255,255,255,.09);
    color: #77746d;
    font-family: "Courier New", monospace;
    font-size: 9px;
    letter-spacing: .12em;
  }
  @media (max-width: 700px) {
    .topbar { height: 72px; padding: 0 22px; }
    main { inset: 72px 22px 50px; }
    h1 { font-size: clamp(50px, 16vw, 72px); }
    .intro { margin-top: 26px; }
    .telemetry { display: none; }
    .drift-button { width: 160px; bottom: 12px; }
    footer { left: 22px; right: 22px; height: 50px; }
  }
`;
document.head.appendChild(style);

const canvas = document.querySelector("#field");
const ctx = canvas.getContext("2d");
const pauseButton = document.querySelector("#pauseButton");
const driftButton = document.querySelector("#driftButton");
const coordinates = document.querySelector("#coordinates");
const velocityEl = document.querySelector("#velocity");

let width = 0;
let height = 0;
let dpr = 1;
let paused = false;
let time = 0;
let seed = Math.random() * 1000;
let mouse = { x: -1000, y: -1000 };
let nodes = [];

function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  createNodes();
}

function createNodes() {
  const count = width < 700 ? 110 : 180;
  nodes = Array.from({ length: count }, (_, i) => ({
    offset: (i / count) * Math.PI * 14,
    radius: 30 + (i % 23) * 7,
    speed: 0.0005 + (i % 9) * 0.00008,
    size: i % 17 === 0 ? 2 : 0.75,
  }));
  document.querySelector("#nodeCount").textContent = count;
}

function draw() {
  ctx.clearRect(0, 0, width, height);

  const cx = width * (width < 700 ? 0.68 : 0.69);
  const cy = height * 0.51;
  const pointerInfluence = width < 700 ? 0 : 24;

  ctx.save();
  ctx.translate(
    cx + (mouse.x - cx) * 0.018 * pointerInfluence / 24,
    cy + (mouse.y - cy) * 0.018 * pointerInfluence / 24
  );

  ctx.beginPath();
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const angle = node.offset + time * node.speed;
    const wobble = Math.sin(time * 0.0007 + node.offset + seed) * 0.42;
    const rx = node.radius * (1.8 + wobble);
    const ry = node.radius * (0.48 + Math.sin(node.offset) * 0.12);
    const x = Math.cos(angle) * rx;
    const y = Math.sin(angle) * ry + Math.sin(angle * 2.1) * 18;

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.strokeStyle = "rgba(232, 228, 216, 0.16)";
  ctx.lineWidth = 0.65;
  ctx.stroke();

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const angle = node.offset + time * node.speed;
    const wobble = Math.sin(time * 0.0007 + node.offset + seed) * 0.42;
    const rx = node.radius * (1.8 + wobble);
    const ry = node.radius * (0.48 + Math.sin(node.offset) * 0.12);
    const x = Math.cos(angle) * rx;
    const y = Math.sin(angle) * ry + Math.sin(angle * 2.1) * 18;
    const mx = mouse.x - cx;
    const my = mouse.y - cy;
    const dx = x - mx;
    const dy = y - my;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const glow = distance < 110 ? 1 - distance / 110 : 0;

    ctx.beginPath();
    ctx.arc(x, y, node.size + glow * 2.2, 0, Math.PI * 2);
    ctx.fillStyle = glow > 0.2 ? "#ff7958" : "rgba(244,241,232,.72)";
    ctx.fill();
  }
  ctx.restore();

  // Fine orbital rings
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(-0.18);
  ctx.strokeStyle = "rgba(255,255,255,.045)";
  ctx.lineWidth = 0.8;
  for (let r = 80; r < 410; r += 55) {
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 1.55, r * 0.42, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

function animate(now) {
  if (!paused) time = now;
  draw();
  requestAnimationFrame(animate);
}

window.addEventListener("resize", resize);
window.addEventListener("pointermove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
  coordinates.innerHTML =
    `X ${String(Math.round(event.clientX)).padStart(3, "0")}&nbsp;&nbsp; ` +
    `Y ${String(Math.round(event.clientY)).padStart(3, "0")}`;
});

pauseButton.addEventListener("click", () => {
  paused = !paused;
  pauseButton.classList.toggle("paused", paused);
  pauseButton.setAttribute("aria-label", paused ? "Resume animation" : "Pause animation");
});

driftButton.addEventListener("click", () => {
  seed = Math.random() * 1000;
  nodes.forEach((node) => {
    node.offset += (Math.random() - 0.5) * 1.8;
  });
  const speed = (0.32 + Math.random() * 0.36).toFixed(2);
  velocityEl.textContent = speed;
  driftButton.animate(
    [{ transform: "translateX(0)" }, { transform: "translateX(-6px)" }, { transform: "translateX(0)" }],
    { duration: 280, easing: "ease-out" }
  );
});

resize();
requestAnimationFrame(animate);