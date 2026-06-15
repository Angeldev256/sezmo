document.addEventListener("DOMContentLoaded", () => {
  document.documentElement.setAttribute("data-theme", "dark");

  const body = document.body;
  const page = body.dataset.page || "home";
  const navbar = document.getElementById("navbar");
  const progressBar = document.getElementById("scroll-progress");
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.getElementById("primary-menu");

  document.querySelectorAll(`[data-page-link="${page}"]`).forEach((link) => {
    link.classList.add("active");
  });

  function updateScrollUI() {
    const scrollTop = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar) {
      progressBar.style.width = `${maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0}%`;
    }
    navbar?.classList.toggle("scrolled", scrollTop > 30);
  }

  updateScrollUI();
  window.addEventListener("scroll", updateScrollUI, { passive: true });

  menuToggle?.addEventListener("click", () => {
    const isOpen = navbar?.classList.toggle("is-open");
    body.classList.toggle("is-menu-open", Boolean(isOpen));
    menuToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
    menuToggle.innerHTML = isOpen ? '<i class="fas fa-xmark"></i>' : '<i class="fas fa-bars"></i>';
  });

  navMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navbar?.classList.remove("is-open");
      body.classList.remove("is-menu-open");
      menuToggle?.setAttribute("aria-expanded", "false");
      if (menuToggle) menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    });
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.45 }
  );

  document.querySelectorAll("[data-count]").forEach((el) => counterObserver.observe(el));

  function animateCounter(el) {
    const target = Number(el.dataset.count || 0);
    const start = performance.now();
    const duration = 1400;

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  document.querySelectorAll(".tilt-card").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.animation = "none";
      card.style.transform = `rotateX(${-y * 9}deg) rotateY(${x * 9}deg) translateY(-6px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
      card.style.animation = "";
    });
  });

  const showcaseStage = document.querySelector(".showcase-stage");
  if (showcaseStage) {
    window.addEventListener(
      "mousemove",
      (event) => {
        const x = event.clientX / window.innerWidth - 0.5;
        const y = event.clientY / window.innerHeight - 0.5;
        showcaseStage.style.setProperty("--stage-y", `${x * 10}deg`);
        showcaseStage.style.setProperty("--stage-x", `${-y * 8}deg`);
      },
      { passive: true }
    );
  }

  const homeShowcaseStage = document.querySelector(".home-showcase-stage");
  const homeShowcaseBg = document.querySelector(".home-showcase-bg video");
  if (homeShowcaseStage || homeShowcaseBg) {
    window.addEventListener(
      "mousemove",
      (event) => {
        const x = event.clientX / window.innerWidth - 0.5;
        const y = event.clientY / window.innerHeight - 0.5;
        if (homeShowcaseStage) {
          homeShowcaseStage.style.setProperty("--home-stage-y", `${x * 6}deg`);
          homeShowcaseStage.style.setProperty("--home-stage-x", `${-y * 5}deg`);
        }
        if (homeShowcaseBg) {
          homeShowcaseBg.style.transform = `translate3d(${x * -4}%, ${y * -4}%, 0) scale(1.12)`;
        }
      },
      { passive: true }
    );
  }

  document.querySelectorAll(".filter-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter || "all";
      document.querySelectorAll(".filter-btn").forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      document.querySelectorAll(".project-card").forEach((card) => {
        const shouldShow = filter === "all" || card.dataset.category === filter;
        if (shouldShow) {
          card.classList.remove("hidden");
          requestAnimationFrame(() => {
            card.style.opacity = "1";
            card.style.transform = "";
          });
        } else {
          card.style.opacity = "0";
          card.style.transform = "scale(0.94)";
          window.setTimeout(() => card.classList.add("hidden"), 180);
        }
      });
    });
  });

  initParticles("showcase-particles");
  initContactForm();
});

function initParticles(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const particles = [];
  const count = 54;

  function resize() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.floor(rect.width * window.devicePixelRatio);
    canvas.height = Math.floor(rect.height * window.devicePixelRatio);
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  }

  function resetParticle(particle) {
    const rect = canvas.getBoundingClientRect();
    particle.x = Math.random() * rect.width;
    particle.y = Math.random() * rect.height;
    particle.vx = (Math.random() - 0.5) * 0.45;
    particle.vy = (Math.random() - 0.5) * 0.45;
    particle.size = 1 + Math.random() * 2.2;
    particle.alpha = 0.2 + Math.random() * 0.55;
  }

  function seed() {
    particles.length = 0;
    for (let index = 0; index < count; index += 1) {
      const particle = {};
      resetParticle(particle);
      particles.push(particle);
    }
  }

  function draw() {
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    particles.forEach((particle, index) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < -20 || particle.x > rect.width + 20 || particle.y < -20 || particle.y > rect.height + 20) {
        resetParticle(particle);
      }

      ctx.beginPath();
      ctx.fillStyle = `rgba(244, 210, 63, ${particle.alpha})`;
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();

      for (let next = index + 1; next < particles.length; next += 1) {
        const other = particles[next];
        const dx = particle.x - other.x;
        const dy = particle.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 120) {
          ctx.strokeStyle = `rgba(19, 162, 147, ${(1 - distance / 120) * 0.16})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(other.x, other.y);
          ctx.stroke();
        }
      }
    });

    requestAnimationFrame(draw);
  }

  resize();
  seed();
  draw();
  window.addEventListener("resize", () => {
    resize();
    seed();
  });
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  const notification = document.getElementById("form-notification");
  if (!form || !notification) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const fields = ["name", "email", "subject", "message"].map((id) => document.getElementById(id));
    const email = document.getElementById("email");
    const isFilled = fields.every((field) => field && field.value.trim().length > 0);
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());

    if (!isFilled || !isEmail) {
      showNotification("Please fill every field with a valid email address.", "error");
      return;
    }

    showNotification("Message sent. I will get back to you within 24 hours.", "success");
    form.reset();
  });

  function showNotification(message, type) {
    notification.textContent = message;
    notification.className = `form-notification ${type}`;
    notification.hidden = false;
    window.setTimeout(() => {
      notification.hidden = true;
    }, 4500);
  }
}
