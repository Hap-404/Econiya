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

  $(function () {
    initStickyHeader(); initActiveNavigation(); initHeroScroll(); initCounters();
    initSwipers(); initCtaEffect(); initScrollToTop(); initNewsletter(); initSiteSearch(); initCertificatePreview();
  });
})(jQuery);
