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
  const flipper = document.querySelector(".rxis-3d-flipper");
  if (flipper && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            flipper.classList.add("animate-flip");
            observer.unobserve(flipper);
          }
        });
      },
      { threshold: 0.3 },
    );
    observer.observe(flipper);
  } else if (flipper) {
    flipper.classList.add("animate-flip");
  }
});
