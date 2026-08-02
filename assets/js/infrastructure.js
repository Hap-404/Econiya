(() => {
  "use strict";

  const page = document.querySelector(".infrastructure-page");
  const hero = document.querySelector(".infra-hero");

  if (!page || !hero) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* -------------------------------------------------------
     HERO PARTICLE DOTS
  ------------------------------------------------------- */
  const canvas = document.createElement("canvas");
  canvas.className = "infra-particle-canvas";
  canvas.setAttribute("aria-hidden", "true");
  hero.prepend(canvas);

  {
    const ctx = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles = [];
    let animationFrame = 0;
    let resizeTimer = 0;

    const getParticleCount = () => {
      const area = width * height;
      const base = Math.round(area / 21000);
      return Math.max(38, Math.min(base, 105));
    };

    const createParticles = () => {
      particles = Array.from({ length: getParticleCount() }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.1 + 0.8,
        vx: prefersReducedMotion ? 0 : (Math.random() - 0.5) * 0.22,
        vy: prefersReducedMotion ? 0 : (Math.random() - 0.5) * 0.18,
        alpha: Math.random() * 0.42 + 0.22,
      }));
    };

    const resizeCanvas = () => {
      const rect = hero.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, hero.offsetHeight);
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      createParticles();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < -5) particle.x = width + 5;
        if (particle.x > width + 5) particle.x = -5;
        if (particle.y < -5) particle.y = height + 5;
        if (particle.y > height + 5) particle.y = -5;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(231, 34, 47, ${particle.alpha})`;
        ctx.fill();

        for (let j = index + 1; j < particles.length; j += 1) {
          const other = particles[j];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.hypot(dx, dy);

          if (distance < 105) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(231, 34, 47, ${
              (1 - distance / 105) * 0.07
            })`;
            ctx.lineWidth = 0.65;
            ctx.stroke();
          }
        }
      });

      if (!prefersReducedMotion) {
        animationFrame = window.requestAnimationFrame(draw);
      }
    };

    resizeCanvas();
    draw();

    window.addEventListener(
      "resize",
      () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(resizeCanvas, 140);
      },
      { passive: true }
    );

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        window.cancelAnimationFrame(animationFrame);
      } else if (!prefersReducedMotion) {
        draw();
      }
    });
  }

  /* -------------------------------------------------------
     HERO SCROLL BUTTON
  ------------------------------------------------------- */
  const firstSectionAfterHero = hero.nextElementSibling;

  if (firstSectionAfterHero) {
    const cueWrap = document.createElement("div");
    cueWrap.className = "infra-scroll-cue-wrap";

    const cue = document.createElement("button");
    cue.className = "infra-scroll-cue";
    cue.type = "button";
    cue.setAttribute("aria-label", "Scroll to infrastructure capabilities");
    cue.innerHTML = '<span>Scroll</span><i class="bi bi-chevron-down"></i>';

    cue.addEventListener("click", () => {
      firstSectionAfterHero.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    });

    cueWrap.append(cue);
    hero.querySelector(":scope > .container")?.append(cueWrap);
  }

  /* -------------------------------------------------------
     SCROLL REVEALS FOR ALL PAGE SECTIONS AND DEVICES
  ------------------------------------------------------- */
  const revealGroups = [
    [".infra-content", "left"],
    [".hero-gallery", "right"],
    [".stat-box", "scale"],
    [".section-heading", "up"],
    [".facility-heading", "up"],
    [".capability-card", "up"],
    [".facility-image", "left"],
    [".facility-content", "right"],
    [".production-item", "up"],
    [".responsible-content", "left"],
    [".responsible-card", "up"],
    [".cta-content", "scale"],
    ["footer .newsletter", "up"],
    ["footer .footer-top > div", "up"],
  ];

  const revealElements = [];

  revealGroups.forEach(([selector, direction]) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      if (element.classList.contains("infra-reveal")) return;

      element.classList.add("infra-reveal");
      element.dataset.infraReveal = direction;
      element.style.setProperty(
        "--infra-delay",
        `${Math.min(index % 6, 5) * 75}ms`
      );
      revealElements.push(element);
    });
  });

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    },
    {
      root: null,
      rootMargin: "0px 0px -8% 0px",
      threshold: 0.12,
    }
  );

  revealElements.forEach((element) => observer.observe(element));
})();
