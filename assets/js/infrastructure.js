(() => {
  "use strict";

  const page = document.querySelector(".infrastructure-page");
  const hero = document.querySelector(".infra-hero");

  if (!page || !hero) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

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
