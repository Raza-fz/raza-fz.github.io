/* ===============================================================
   Mushahid Raza — Personal Site · interactions
   =============================================================== */

/* ---------- Footer year ---------- */
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- Sticky nav shadow ---------- */
const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 40);
});

/* ---------- Mobile nav ---------- */
const burger = document.getElementById("nav-burger");
const links = document.getElementById("nav-links");
burger.addEventListener("click", () => {
  burger.classList.toggle("open");
  links.classList.toggle("open");
});
links.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    burger.classList.remove("open");
    links.classList.remove("open");
  })
);

/* ---------- Scroll reveal ---------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        revealObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 6) * 60}ms`;
  revealObserver.observe(el);
});

/* ---------- Animated counters ---------- */
function animateCount(el) {
  const target = parseFloat(el.dataset.target);
  const decimals = parseInt(el.dataset.decimals || "0", 10);
  const suffix = el.dataset.suffix || "";
  const dur = 1600;
  const start = performance.now();

  function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    // easeOutExpo
    const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
    const val = target * eased;
    let out;
    if (decimals > 0) {
      out = val.toFixed(decimals);
    } else if (target >= 1000) {
      out = Math.round(val).toLocaleString("en-US");
    } else {
      out = Math.round(val).toString();
    }
    el.textContent = out + suffix;
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        animateCount(e.target);
        countObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.5 }
);
document.querySelectorAll(".count").forEach((el) => countObserver.observe(el));

/* ---------- Particle network background ---------- */
(function () {
  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ctx = canvas.getContext("2d");
  let w, h, particles, raf;

  const CONFIG = {
    density: 0.00009, // particles per pixel
    maxParticles: 120,
    linkDist: 130,
    speed: 0.35,
  };

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const count = Math.min(CONFIG.maxParticles, Math.floor(w * h * CONFIG.density));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * CONFIG.speed,
      vy: (Math.random() - 0.5) * CONFIG.speed,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(34,211,238,0.7)";
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.hypot(dx, dy);
        if (dist < CONFIG.linkDist) {
          const alpha = (1 - dist / CONFIG.linkDist) * 0.25;
          ctx.strokeStyle = `rgba(139,92,246,${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }
    raf = requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener("resize", () => {
    cancelAnimationFrame(raf);
    resize();
    if (!prefersReduced) draw();
  });

  if (prefersReduced) {
    // draw a single static frame
    draw();
    cancelAnimationFrame(raf);
  } else {
    draw();
  }
})();
