/* =============================================
   PRABHASH KUMAR SINGH — Portfolio JavaScript
   3D Particles, Animations, Interactions
   ============================================= */

'use strict';

// ===== LOADER =====
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) { loader.classList.add('hidden'); }
    initAll();
  }, 1200);
});

function initAll() {
  initCursor();
  initNav();
  initHeroCanvas();
  initRoleTyper();
  initStatCounters();
  initProfileOrb();
  initSkillsCanvas();
  initContactCanvas();
  init3DCardTilt();
  initScrollReveal();
  initProjectFilter();
  initContactForm();
  initScrollSpy();
}

// ===== CUSTOM CURSOR =====
function initCursor() {
  const cursor = document.getElementById('cursor');
  const trail = document.getElementById('cursorTrail');
  if (!cursor || !trail || window.innerWidth < 768) return;

  let mx = 0, my = 0, tx = 0, ty = 0;
  let raf;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });

  function animTrail() {
    tx += (mx - tx) * 0.15;
    ty += (my - ty) * 0.15;
    trail.style.left = tx + 'px';
    trail.style.top = ty + 'px';
    raf = requestAnimationFrame(animTrail);
  }
  animTrail();

  document.querySelectorAll('a,button,.skill-chip,.project-card,.filter-btn,.contact-item').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

// ===== NAVIGATION =====
function initNav() {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const links = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  });

  toggle?.addEventListener('click', () => {
    toggle.classList.toggle('open');
    links?.classList.toggle('open');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      toggle?.classList.remove('open');
      links?.classList.remove('open');
    });
  });
}

// ===== HERO CANVAS (Particle Network) =====
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], mouse = { x: null, y: null };
  const COUNT = window.innerWidth < 768 ? 40 : 90;
  const CONNECT_DIST = 140;
  const MOUSE_DIST = 160;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); });

  class Particle {
    constructor() { this.reset(true); }
    reset(rand = false) {
      this.x = Math.random() * W;
      this.y = rand ? Math.random() * H : H + 10;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = -(Math.random() * 0.4 + 0.2);
      this.r = Math.random() * 2 + 0.8;
      this.alpha = Math.random() * 0.6 + 0.2;
      this.color = Math.random() > 0.5 ? '99,102,241' : '6,182,212';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (mouse.x && mouse.y) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < MOUSE_DIST) {
          const force = (MOUSE_DIST - dist) / MOUSE_DIST * 0.8;
          this.x += dx / dist * force;
          this.y += dy / dist * force;
        }
      }
      if (this.y < -10 || this.x < -10 || this.x > W + 10) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < CONNECT_DIST) {
          const opacity = (1 - dist / CONNECT_DIST) * 0.35;
          ctx.strokeStyle = `rgba(99,102,241,${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
  }
  animate();
}

// ===== ROLE TYPER =====
function initRoleTyper() {
  const el = document.getElementById('roleText');
  if (!el) return;
  const roles = [
    'Scalable Web Apps',
    'REST APIs with Java',
    'React Frontends',
    'Blockchain Solutions',
    'Full Stack Systems',
    'Smart Contracts',
  ];
  let ri = 0, ci = 0, deleting = false;
  const SPEED = 80, DELETE_SPEED = 45, PAUSE = 1800;

  function type() {
    const word = roles[ri];
    if (!deleting) {
      el.textContent = word.slice(0, ci + 1);
      ci++;
      if (ci === word.length) { deleting = true; setTimeout(type, PAUSE); return; }
      setTimeout(type, SPEED);
    } else {
      el.textContent = word.slice(0, ci - 1);
      ci--;
      if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
      setTimeout(type, DELETE_SPEED);
    }
  }
  setTimeout(type, 600);
}

// ===== STAT COUNTERS =====
function initStatCounters() {
  const stats = document.querySelectorAll('.stat-number');
  const ob = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-target'));
      const dur = 1800;
      const step = dur / target;
      let cur = 0;
      const timer = setInterval(() => {
        cur++;
        el.textContent = cur;
        if (cur >= target) { clearInterval(timer); el.textContent = target + (target === 200 ? '+' : ''); }
      }, step);
      ob.unobserve(el);
    });
  }, { threshold: 0.5 });
  stats.forEach(s => ob.observe(s));
}

// ===== PROFILE ORB PARTICLE TRAIL =====
function initProfileOrb() {
  const orb = document.querySelector('.profile-orb-inner');
  if (!orb) return;
  orb.addEventListener('mousemove', e => {
    const rect = orb.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rotX = -(e.clientY - cy) / 10;
    const rotY = (e.clientX - cx) / 10;
    orb.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.04)`;
  });
  orb.addEventListener('mouseleave', () => { orb.style.transform = ''; });
}

// ===== SKILLS CANVAS (Floating Dots BG) =====
function initSkillsCanvas() {
  const canvas = document.getElementById('skillsCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }
  resize();
  window.addEventListener('resize', resize);

  const dots = Array.from({ length: 30 }, () => ({
    x: Math.random() * 1200,
    y: Math.random() * 800,
    r: Math.random() * 80 + 30,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    alpha: Math.random() * 0.06 + 0.02,
    color: Math.random() > 0.5 ? '99,102,241' : '6,182,212',
  }));

  function animate() {
    ctx.clearRect(0, 0, W, H);
    dots.forEach(d => {
      d.x += d.vx; d.y += d.vy;
      if (d.x < -d.r) d.x = W + d.r;
      if (d.x > W + d.r) d.x = -d.r;
      if (d.y < -d.r) d.y = H + d.r;
      if (d.y > H + d.r) d.y = -d.r;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${d.color},${d.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
}

// ===== CONTACT CANVAS =====
function initContactCanvas() {
  const canvas = document.getElementById('contactCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H;
  function resize() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }
  resize();
  window.addEventListener('resize', resize);

  const waves = [
    { freq: 0.008, amp: 30, speed: 0.02, phase: 0, color: 'rgba(99,102,241,0.08)' },
    { freq: 0.012, amp: 20, speed: 0.015, phase: 2, color: 'rgba(6,182,212,0.06)' },
    { freq: 0.006, amp: 40, speed: 0.025, phase: 4, color: 'rgba(139,92,246,0.05)' },
  ];
  let time = 0;

  function animate() {
    ctx.clearRect(0, 0, W, H);
    waves.forEach(wave => {
      ctx.beginPath();
      ctx.moveTo(0, H / 2);
      for (let x = 0; x <= W; x++) {
        const y = H / 2 + Math.sin(x * wave.freq + wave.phase + time * wave.speed) * wave.amp;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H); ctx.lineTo(0, H);
      ctx.closePath();
      ctx.fillStyle = wave.color;
      ctx.fill();
    });
    time++;
    requestAnimationFrame(animate);
  }
  animate();
}

// ===== 3D CARD TILT =====
function init3DCardTilt() {
  const cards = document.querySelectorAll('.about-card-3d, .timeline-card, .project-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const rotX = -(dy / rect.height) * 8;
      const rotY = (dx / rect.width) * 8;
      const inner = card.querySelector('.card-3d-inner') || card;
      inner.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      const inner = card.querySelector('.card-3d-inner') || card;
      inner.style.transform = '';
    });
  });
}

// ===== SCROLL REVEAL =====
function initScrollReveal() {
  const elements = document.querySelectorAll(
    '.project-card, .timeline-card, .skill-category, .cert-card, .about-text, .about-card-3d, .section-header'
  );
  elements.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 6) * 0.08}s`;
  });

  const ob = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => ob.observe(el));

  // Animate skill bars
  const bars = document.querySelectorAll('.bar-fill');
  const barOb = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.transition = 'width 1.5s cubic-bezier(0.4,0,0.2,1)';
        barOb.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(b => { b.style.width = '0'; barOb.observe(b); });
  setTimeout(() => {
    bars.forEach(b => { b.style.width = b.style.getPropertyValue('--w') || getComputedStyle(b).getPropertyValue('--w'); });
  }, 400);
}

// ===== PROJECT FILTER =====
function initProjectFilter() {
  const btns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        const cat = card.getAttribute('data-category') || '';
        if (filter === 'all' || cat.includes(filter)) {
          card.style.display = '';
          card.classList.remove('hidden');
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = ''; }, 50);
        } else {
          card.style.opacity = '0';
          setTimeout(() => { card.classList.add('hidden'); }, 200);
        }
      });
    });
  });
}

// ===== CONTACT FORM =====
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('nameInput')?.value.trim();
    const email = document.getElementById('emailInput')?.value.trim();
    const subject = document.getElementById('subjectInput')?.value.trim() || 'Portfolio Inquiry';
    const message = document.getElementById('messageInput')?.value.trim();

    if (!name || !email || !message) {
      showToast('⚠️ Please fill in all required fields.', 3000);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('⚠️ Please enter a valid email address.', 3000);
      return;
    }

    const btn = form.querySelector('.submit-btn');
    const btnText = btn.querySelector('.btn-text');
    btnText.textContent = 'Sending...';
    btn.disabled = true;

    // Compose mailto
    const mailtoLink = `mailto:Prabhashrai17@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    )}`;
    window.location.href = mailtoLink;

    setTimeout(() => {
      showToast('✅ Opening your email client!', 3500);
      form.reset();
      btnText.textContent = 'Send Message';
      btn.disabled = false;
    }, 800);
  });
}

// ===== SCROLL SPY =====
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const ob = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => ob.observe(s));
}

// ===== TOAST =====
function showToast(msg, duration = 3000) {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toastMsg');
  if (!toast || !msgEl) return;
  msgEl.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

// ===== SMOOTH SCROLL for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== Add sparkle on click =====
document.addEventListener('click', e => {
  if (window.innerWidth < 768) return;
  createSparkle(e.clientX, e.clientY);
});

function createSparkle(x, y) {
  const colors = ['#6366f1', '#06b6d4', '#8b5cf6', '#ec4899'];
  for (let i = 0; i < 6; i++) {
    const spark = document.createElement('div');
    const angle = (i / 6) * Math.PI * 2;
    const dist = 30 + Math.random() * 30;
    spark.style.cssText = `
      position:fixed; pointer-events:none; z-index:9997;
      width:5px; height:5px; border-radius:50%;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      left:${x}px; top:${y}px;
      transform:translate(-50%,-50%);
      transition: all 0.6s ease-out; opacity:1;
    `;
    document.body.appendChild(spark);
    requestAnimationFrame(() => {
      spark.style.left = `${x + Math.cos(angle) * dist}px`;
      spark.style.top = `${y + Math.sin(angle) * dist}px`;
      spark.style.opacity = '0';
      spark.style.transform = 'translate(-50%,-50%) scale(0)';
    });
    setTimeout(() => spark.remove(), 650);
  }
}
