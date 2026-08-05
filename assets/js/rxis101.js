(() => {
  "use strict";
  const revealItems = document.querySelectorAll(".rxis-reveal");
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8%" },
    );
    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min((index % 6) * 55, 275)}ms`;
      observer.observe(item);
    });
  }

  const tabs = document.querySelectorAll("[data-spec-tab]");
  const panels = document.querySelectorAll("[data-spec-panel]");
  tabs.forEach((tab) =>
    tab.addEventListener("click", () => {
      const key = tab.dataset.specTab;
      tabs.forEach((button) =>
        button.classList.toggle("is-active", button === tab),
      );
      panels.forEach((panel) =>
        panel.classList.toggle("is-active", panel.dataset.specPanel === key),
      );
    }),
  );

  if (
    !reduceMotion &&
    window.matchMedia("(hover:hover) and (pointer:fine)").matches
  ) {
    document.querySelectorAll(".rxis-animation-slot").forEach((slot) => {
      slot.addEventListener("pointermove", (event) => {
        const rect = slot.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        slot.classList.add("is-pointer-active");
        slot.style.transform = `perspective(900px) rotateX(${(-y * 3).toFixed(2)}deg) rotateY(${(x * 4).toFixed(2)}deg)`;
      });
      slot.addEventListener("pointerleave", () => {
        slot.style.transform = "";
        slot.classList.remove("is-pointer-active");
      });
    });
  }
})();

/* RxIS101 hero product tilt and floating-pill parallax */
(() => {
  "use strict";
  const heroProduct = document.getElementById("rxisHeroProduct");
  const phoneTilt = document.getElementById("rxisPhoneTilt");
  if (!heroProduct || !phoneTilt) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const finePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)",
  ).matches;
  if (reduceMotion || !finePointer) return;

  const pills = heroProduct.querySelectorAll("[data-float-depth]");
  let frame = 0;

  const reset = () => {
    phoneTilt.style.transform = "";
    pills.forEach((pill) => {
      pill.style.translate = "";
    });
    heroProduct.classList.remove("is-tilting");
  };

  heroProduct.addEventListener("pointermove", (event) => {
    const rect = heroProduct.getBoundingClientRect();
    const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;

    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      heroProduct.classList.add("is-tilting");
      phoneTilt.style.transform = `rotateX(${(-ny * 7).toFixed(2)}deg) rotateY(${(nx * 9).toFixed(2)}deg) translateZ(8px)`;
      pills.forEach((pill) => {
        const depth = Number(pill.dataset.floatDepth || 1);
        pill.style.translate = `${(nx * 8 * depth).toFixed(1)}px ${(ny * 6 * depth).toFixed(1)}px`;
      });
    });
  });

  heroProduct.addEventListener("pointerleave", reset);
  heroProduct.addEventListener("pointercancel", reset);
})();
document.addEventListener("DOMContentLoaded", () => {
  const tabList = document.querySelector(".rxis-specification-tabs");

  if (!tabList) {
    return;
  }

  const tabs = Array.from(tabList.querySelectorAll("[data-specification-tab]"));

  const panels = Array.from(
    document.querySelectorAll("[data-specification-panel]"),
  );

  const activateTab = (selectedTab) => {
    const selectedName = selectedTab.dataset.specificationTab;

    tabs.forEach((tab) => {
      const isSelected = tab === selectedTab;

      tab.classList.toggle("is-active", isSelected);
      tab.setAttribute("aria-selected", String(isSelected));

      tab.tabIndex = isSelected ? 0 : -1;
    });

    panels.forEach((panel) => {
      const isSelected = panel.dataset.specificationPanel === selectedName;

      panel.classList.toggle("is-active", isSelected);

      panel.hidden = !isSelected;
    });
  };

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      activateTab(tab);
    });

    tab.addEventListener("keydown", (event) => {
      if (
        event.key !== "ArrowRight" &&
        event.key !== "ArrowLeft" &&
        event.key !== "Home" &&
        event.key !== "End"
      ) {
        return;
      }

      event.preventDefault();

      let nextIndex = index;

      if (event.key === "ArrowRight") {
        nextIndex = (index + 1) % tabs.length;
      }

      if (event.key === "ArrowLeft") {
        nextIndex = (index - 1 + tabs.length) % tabs.length;
      }

      if (event.key === "Home") {
        nextIndex = 0;
      }

      if (event.key === "End") {
        nextIndex = tabs.length - 1;
      }

      tabs[nextIndex].focus();
      activateTab(tabs[nextIndex]);
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const relatedSlider = document.querySelector(".rxis-related-slider");

  if (!relatedSlider || typeof Swiper === "undefined") {
    return;
  }

  new Swiper(relatedSlider, {
    slidesPerView: 1,
    spaceBetween: 16,

    speed: 600,

    loop: false,
    rewind: false,
    autoplay: false,

    grabCursor: true,
    watchOverflow: true,

    allowTouchMove: true,
    simulateTouch: true,

    navigation: {
      nextEl: ".rxis-related-next",
      prevEl: ".rxis-related-prev",
    },

    breakpoints: {
      576: {
        slidesPerView: 1.35,
        spaceBetween: 18,
      },

      768: {
        slidesPerView: 2,
        spaceBetween: 20,
      },

      992: {
        slidesPerView: 3,
        spaceBetween: 26,
      },
    },
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".rxis-industries-track");
  const group = document.querySelector(".rxis-industries-group");

  if (track && group) {
    // Duplicate the group to create the infinite scroll effect
    const clone = group.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);

    // Dynamically set the ticker distance based on the group's actual width
    const updateDistance = () => {
      track.style.setProperty("--ticker-distance", `${group.offsetWidth}px`);
    };

    updateDistance();

    // Use ResizeObserver to update the distance if the layout changes
    const resizeObserver = new ResizeObserver(() => {
      updateDistance();
    });
    resizeObserver.observe(group);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const flippers = document.querySelectorAll(".rxis-3d-flipper:not(.rxis-related-flipper)");
  if (flippers.length > 0 && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-flip");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 },
    );
    flippers.forEach(flipper => observer.observe(flipper));
  } else if (flippers.length > 0) {
    flippers.forEach(flipper => flipper.classList.add("animate-flip"));
  }
});

(() => {
  "use strict";
  const cards = document.querySelectorAll(".rxis-feature-card");
  if (!cards.length) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  const supportsFinePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)",
  ).matches;

  if (prefersReducedMotion || !supportsFinePointer) {
    return;
  }

  cards.forEach((card) => {
    let animationFrame = null;
    let currentRotateX = 0;
    let currentRotateY = 0;
    let currentLift = 0;
    let targetRotateX = 0;
    let targetRotateY = 0;
    let targetLift = 0;

    const maximumRotation = 10;

    const renderTilt = () => {
      currentRotateX += (targetRotateX - currentRotateX) * 0.16;
      currentRotateY += (targetRotateY - currentRotateY) * 0.16;
      currentLift += (targetLift - currentLift) * 0.16;

      card.style.transform = `perspective(1000px) translateY(${currentLift}px) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg) translateZ(0)`;

      const movementRemaining =
        Math.abs(targetRotateX - currentRotateX) +
        Math.abs(targetRotateY - currentRotateY) +
        Math.abs(targetLift - currentLift);

      if (movementRemaining > 0.01) {
        animationFrame = requestAnimationFrame(renderTilt);
      } else {
        animationFrame = null;
        if (targetLift === 0 && targetRotateX === 0 && targetRotateY === 0) {
          card.style.transform = "";
        }
      }
    };

    const requestRender = () => {
      if (animationFrame === null) {
        animationFrame = requestAnimationFrame(renderTilt);
      }
    };

    card.addEventListener("pointerenter", () => {
      targetLift = -7;
      requestRender();
    });

    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      const pointerX = event.clientX - bounds.left;
      const pointerY = event.clientY - bounds.top;
      const normalizedX = pointerX / bounds.width;
      const normalizedY = pointerY / bounds.height;

      targetRotateY = (normalizedX - 0.5) * maximumRotation * 2;
      targetRotateX = (0.5 - normalizedY) * maximumRotation * 2;
      targetLift = -7;

      requestRender();
    });

    card.addEventListener("pointerleave", () => {
      targetRotateX = 0;
      targetRotateY = 0;
      targetLift = 0;
      requestRender();
    });
  });
})();

/* RxIS101 feature card 3D tilt */
(() => {
  "use strict";
  const cards = document.querySelectorAll(".rxis-feature-card, .rxis-certification-card");
  if (!cards.length) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const supportsFinePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;

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
      currentRotateX += (targetRotateX - currentRotateX) * 0.16;
      currentRotateY += (targetRotateY - currentRotateY) * 0.16;

      card.style.transform = `perspective(1000px) translateY(-7px) rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg) translateZ(0)`;

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
      card.classList.add("is-tilting");
    });

    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      const pointerX = event.clientX - bounds.left;
      const pointerY = event.clientY - bounds.top;
      const normalizedX = pointerX / bounds.width;
      const normalizedY = pointerY / bounds.height;

      targetRotateY = (normalizedX - 0.5) * maximumRotation * 2;
      targetRotateX = (0.5 - normalizedY) * maximumRotation * 2;

      requestRender();
    });

    card.addEventListener("pointerleave", () => {
      card.classList.remove("is-tilting");
      card.classList.add("is-returning");
      
      // Stop the JS loop and clear inline styles to let CSS transition handle the return
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
        animationFrame = null;
      }
      
      targetRotateX = 0;
      targetRotateY = 0;
      currentRotateX = 0;
      currentRotateY = 0;
      
      card.style.transform = "";
    });
  });
})();

