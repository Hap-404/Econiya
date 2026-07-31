(function ($) {
  "use strict";

  function initStickyHeader() {
    const update = () => $("header").toggleClass("sticky-header", $(window).scrollTop() >= 100);
    $(window).on("scroll", update);
    update();
  }

  function initActiveNavigation() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("#navMenu .nav-link").forEach((link) => {
      const href = (link.getAttribute("href") || "").split("#")[0];
      link.classList.toggle("active", href === currentPage);
    });
  }

  function initHeroScroll() {
    const button = document.querySelector(".scroll");
    const target = document.querySelector(".who");
    if (!button || !target) return;
    button.setAttribute("role", "button");
    button.setAttribute("tabindex", "0");
    const go = () => target.scrollIntoView({ behavior: "smooth" });
    button.addEventListener("click", go);
    button.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); go(); }
    });
  }

  function initCounters() {
    const counters = document.querySelectorAll(".counter[data-target]");
    if (!counters.length) return;
    let started = false;
    const run = () => {
      if (started) return;
      const first = counters[0].getBoundingClientRect();
      if (first.top > window.innerHeight) return;
      started = true;
      counters.forEach((counter) => {
        const target = Number(counter.dataset.target || 0);
        const duration = 1800;
        const startTime = performance.now();
        const tick = (now) => {
          const progress = Math.min((now - startTime) / duration, 1);
          counter.textContent = String(Math.floor(target * (1 - Math.pow(1 - progress, 3))));
          if (progress < 1) requestAnimationFrame(tick);
          else counter.textContent = String(target);
        };
        requestAnimationFrame(tick);
      });
    };
    window.addEventListener("scroll", run, { passive: true });
    run();
  }

  function initSwipers() {
    if (typeof Swiper === "undefined") return;
    const storyEl = document.querySelector(".story-slider");
    if (storyEl) {
      const storySwiper = new Swiper(storyEl, {
        slidesPerView: 4, spaceBetween: 80, speed: 700, loop: true,
        navigation: { nextEl: ".story-next", prevEl: ".story-prev" },
        breakpoints: { 320: { slidesPerView: 2, spaceBetween: 30 }, 768: { slidesPerView: 3, spaceBetween: 50 }, 1200: { slidesPerView: 4, spaceBetween: 80 } }
      });
      document.querySelectorAll(".story-year").forEach((item, index) => item.addEventListener("click", () => storySwiper.slideToLoop(index)));
    }
    const productEl = document.querySelector(".productSwiper");
    if (productEl) {
      new Swiper(productEl, {
        slidesPerView: 1.15, spaceBetween: 18, speed: 700,
        navigation: { nextEl: ".product-next", prevEl: ".product-prev" },
        breakpoints: { 576: { slidesPerView: 2 }, 768: { slidesPerView: 2.3 }, 992: { slidesPerView: 3 }, 1200: { slidesPerView: 3 }, 1400: { slidesPerView: 3.25 } }
      });
    }
  }

  function initCtaEffect() {
    const cta = document.querySelector(".cta-content");
    const blob = document.querySelector(".cta-liquid");
    if (!cta || !blob || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    cta.addEventListener("mousemove", function (event) {
      const rect = this.getBoundingClientRect();
      blob.style.left = `${event.clientX - rect.left}px`;
      blob.style.top = `${event.clientY - rect.top}px`;
    });
    cta.addEventListener("mouseleave", () => { blob.style.left = "78%"; blob.style.top = "50%"; });
  }

  function initScrollToTop() {
    const button = $("#return-to-top");
    if (!button.length) return;
    const update = () => button.toggle($(window).scrollTop() >= 50);
    $(window).on("scroll", update);
    update();
    button.on("click", () => $("html, body").animate({ scrollTop: 0 }, 500));
  }

  function initNewsletter() {
    const form = document.querySelector("#newsletterForm");
    if (!form) return;
    const input = form.querySelector('input[type="email"]');
    const message = form.querySelector(".form-message");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      message.className = "form-message";
      if (!input.checkValidity()) {
        message.textContent = "Please enter a valid email address.";
        message.classList.add("error");
        input.focus();
        return;
      }
      message.textContent = "Thank you. The newsletter backend can now be connected.";
      message.classList.add("success");
      form.reset();
    });
  }

  function initCertificatePreview() {
    const modalElement = document.getElementById("certificateModal");
    const modalImage = document.getElementById("certificateModalImage");
    const modalTitle = document.getElementById("certificateModalLabel");
    if (!modalElement || !modalImage || typeof bootstrap === "undefined") return;
    const previewModal = bootstrap.Modal.getOrCreateInstance(modalElement);
    document.querySelectorAll("[data-certificate]").forEach((button) => {
      button.addEventListener("click", () => {
        modalImage.src = button.dataset.certificate || "";
        modalImage.alt = button.dataset.title || "Certificate preview";
        if (modalTitle) modalTitle.textContent = button.dataset.title || "Certificate Preview";
        previewModal.show();
      });
    });
    modalElement.addEventListener("hidden.bs.modal", () => { modalImage.src = ""; });
  }

  function initSiteSearch() {
    const form = document.querySelector("#siteSearchForm");
    if (!form) return;
    const routes = [
      { words: ["about", "company", "story"], url: "about.html" },
      { words: ["product", "radio", "detection"], url: "products.html" },
      { words: ["solution", "service", "industry"], url: "solutions.html" },
      { words: ["insight", "blog", "article", "news"], url: "insights.html" },
      { words: ["contact", "quote", "email", "phone"], url: "contact.html" }
    ];
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const query = String(new FormData(form).get("q") || "").trim().toLowerCase();
      const match = routes.find((route) => route.words.some((word) => query.includes(word)));
      window.location.href = match ? match.url : "index.html";
    });
  }


  function initEconWhoAnimation() {
  const sections = document.querySelectorAll(".econ-who-section");

  if (!sections.length) {
    return;
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  sections.forEach((section) => {
    if (prefersReducedMotion) {
      section.classList.add(
        "is-visible",
        "animation-complete"
      );

      return;
    }

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");

          /*
           * Start the subtle floating movement only after
           * all entrance animations have completed.
           */
          window.setTimeout(() => {
            entry.target.classList.add(
              "animation-complete"
            );
          }, 1600);

          /*
           * Run the entrance animation only once.
           */
          currentObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.17,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    observer.observe(section);
  });
}

  
function initExpertiseParallaxCards() {
  const section = document.querySelector(".expertise-parallax");
  const cards = document.querySelectorAll(".expertise-tilt-card");
  const icons = document.querySelectorAll(".expertise-svg-icon");

  if (!section || !cards.length) {
    return;
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const supportsFinePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;

  /*
   * Keep each icon box visible when its SVG file has not
   * been downloaded yet. This hides only the browser's
   * broken-image symbol.
   */
  icons.forEach((icon) => {
    const hideMissingIcon = () => {
      icon.classList.add("icon-missing");
    };

    const showLoadedIcon = () => {
      icon.classList.remove("icon-missing");
    };

    icon.addEventListener("error", hideMissingIcon);
    icon.addEventListener("load", showLoadedIcon);

    if (icon.complete && icon.naturalWidth === 0) {
      hideMissingIcon();
    }
  });

  /*
   * Section entrance animation.
   */
  if (prefersReducedMotion) {
    section.classList.add("is-visible");
  } else {
    const sectionObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.13,
        rootMargin: "0px 0px -7% 0px"
      }
    );

    sectionObserver.observe(section);
  }

  /*
   * Do not enable pointer tilt on touch devices or when
   * reduced motion is enabled.
   */
  if (prefersReducedMotion || !supportsFinePointer) {
    return;
  }

  cards.forEach((card) => {
    let animationFrame = null;
    let currentRotateX = 0;
    let currentRotateY = 0;
    let targetRotateX = 0;
    let targetRotateY = 0;

    const maximumRotation = 10;

    const renderTilt = () => {
      /*
       * Interpolation produces a soft spring-like motion
       * instead of directly snapping to the cursor.
       */
      currentRotateX +=
        (targetRotateX - currentRotateX) * 0.16;

      currentRotateY +=
        (targetRotateY - currentRotateY) * 0.16;

      card.style.transform = `
        perspective(1000px)
        rotateX(${currentRotateX}deg)
        rotateY(${currentRotateY}deg)
        translateZ(0)
      `;

      const movementRemaining =
        Math.abs(targetRotateX - currentRotateX) +
        Math.abs(targetRotateY - currentRotateY);

      if (movementRemaining > 0.01) {
        animationFrame = requestAnimationFrame(renderTilt);
      } else {
        animationFrame = null;
      }
    };

    const requestRender = () => {
      if (animationFrame === null) {
        animationFrame = requestAnimationFrame(renderTilt);
      }
    };

    card.addEventListener("pointerenter", () => {
      card.classList.remove("is-returning");
    });

    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();

      const pointerX = event.clientX - bounds.left;
      const pointerY = event.clientY - bounds.top;

      const normalizedX = pointerX / bounds.width;
      const normalizedY = pointerY / bounds.height;

      /*
       * Values range approximately between -10 and +10.
       * Vertical rotation is inverted for natural movement.
       */
      targetRotateY =
        (normalizedX - 0.5) * maximumRotation * 2;

      targetRotateX =
        (0.5 - normalizedY) * maximumRotation * 2;

      card.style.setProperty(
        "--mouse-x",
        `${normalizedX * 100}%`
      );

      card.style.setProperty(
        "--mouse-y",
        `${normalizedY * 100}%`
      );

      requestRender();
    });

    card.addEventListener("pointerleave", () => {
      targetRotateX = 0;
      targetRotateY = 0;

      card.classList.add("is-returning");

      card.style.setProperty("--mouse-x", "50%");
      card.style.setProperty("--mouse-y", "50%");

      requestRender();

      window.setTimeout(() => {
        card.classList.remove("is-returning");
      }, 720);
    });
  });
}


function initVantaHeroDots() {
  const heroElements = document.querySelectorAll(
    ".vanta-dots-hero"
  );

  if (!heroElements.length) {
    return;
  }

  /*
   * Do not initialize WebGL animation for users who
   * have requested reduced motion.
   */
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    return;
  }

  /*
   * Fail safely when either CDN script did not load.
   * The hero will continue using its white CSS fallback.
   */
  if (
    typeof window.THREE === "undefined" ||
    typeof window.VANTA === "undefined" ||
    typeof window.VANTA.DOTS !== "function"
  ) {
    console.warn(
      "Vanta DOTS could not start because Three.js or Vanta was not loaded."
    );

    return;
  }

  const vantaEffects = [];

  heroElements.forEach((heroElement) => {
    const effect = window.VANTA.DOTS({
      el: heroElement,

      /*
       * Interaction
       */
      mouseControls: false,
      touchControls: false,
      gyroControls: false,

      /*
       * Required sizing values
       */
      minHeight: 200,
      minWidth: 200,
      scale: 1,
      scaleMobile: 1,

      /*
       * Econiya brand colors
       *
       * --primary:  #e7222f
       * --dark-red: #7b2522
       */
      color: 0xe7222f,
      color2: 0x7b2522,
      backgroundColor: 0xffffff,

      /*
       * DOTS appearance
       */
      size: 5,
      spacing: 30,
      showLines: false
    });

    vantaEffects.push(effect);
  });

  /*
   * Clean up the WebGL canvases when leaving the page.
   */
  window.addEventListener(
    "pagehide",
    () => {
      vantaEffects.forEach((effect) => {
        if (
          effect &&
          typeof effect.destroy === "function"
        ) {
          effect.destroy();
        }
      });
    },
    { once: true }
  );
}

function initGlobalButtonAnimations() {
  /*
   * Apply the Who We Are-style animation to ordinary
   * Bootstrap buttons without manually changing every
   * HTML button.
   */
  const buttons = document.querySelectorAll(
    "a.btn, button.btn"
  );

  buttons.forEach((button) => {
    /*
     * Exclude controls that should remain icon-only or
     * already have their own custom animation.
     */
    if (
      button.matches(
        [
          ".econ-who-button",
          ".icon-btn",
          ".navbar-toggler",
          "#return-to-top",
          ".product-prev",
          ".product-next",
          ".story-prev",
          ".story-next"
        ].join(",")
      )
    ) {
      return;
    }

    if (button.dataset.animationReady === "true") {
      return;
    }

    /*
     * Read only the direct text inside the button.
     * Existing icons are preserved.
     */
    const textNodes = Array.from(button.childNodes).filter(
      (node) =>
        node.nodeType === Node.TEXT_NODE &&
        node.textContent.trim()
    );

    const buttonText = textNodes
      .map((node) => node.textContent.trim())
      .join(" ")
      .trim();

    /*
     * Skip buttons that do not contain direct text.
     */
    if (!buttonText) {
      return;
    }

    textNodes.forEach((node) => {
      node.remove();
    });

    const textWrap = document.createElement("span");
    textWrap.className = "universal-button-text-wrap";

    const firstText = document.createElement("span");
    firstText.className =
      "universal-button-text universal-button-text-one";
    firstText.textContent = buttonText;

    const secondText = document.createElement("span");
    secondText.className =
      "universal-button-text universal-button-text-two";
    secondText.textContent = buttonText;

    textWrap.append(firstText, secondText);

    /*
     * Put the animated text before the existing arrow icon.
     */
    button.insertBefore(textWrap, button.firstChild);

    const overlay = document.createElement("span");
    overlay.className = "universal-button-overlay";
    overlay.setAttribute("aria-hidden", "true");

    button.appendChild(overlay);

    button.classList.add("universal-animated-btn");
    button.dataset.animationReady = "true";
  });
}

  $(function () {
    initStickyHeader(); initActiveNavigation(); initHeroScroll(); initCounters();
    initSwipers(); initCtaEffect(); initScrollToTop(); initNewsletter(); initSiteSearch(); initCertificatePreview();  initEconWhoAnimation();   initExpertiseParallaxCards();  initVantaHeroDots();  initGlobalButtonAnimations();




  });
})(jQuery);
