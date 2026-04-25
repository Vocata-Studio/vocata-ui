/**
 * Vocata UI Toolbar — Injected preview switcher
 *
 * This script is inlined into Astro preview pages.
 * For React/Next.js, the toolbar is a React component (see SKILL.md).
 *
 * Usage: Variations must be wrapped in elements with
 * data-vocata-variation="1" through data-vocata-variation="N".
 * Only variation 1 is visible by default. The toolbar detects N
 * automatically from the number of data-vocata-variation elements.
 */
(function () {
  "use strict";

  let active = 1;
  let count = 0;

  function switchVariation(n) {
    if (n < 1 || n > count) return;
    active = n;

    for (let i = 1; i <= count; i++) {
      const el = document.querySelector(`[data-vocata-variation="${i}"]`);
      if (el) {
        el.style.display = i === active ? "" : "none";
      }
    }

    const buttons = document.querySelectorAll("[data-vocata-btn]");
    buttons.forEach((btn) => {
      const num = parseInt(btn.getAttribute("data-vocata-btn"), 10);
      btn.style.border =
        num === active
          ? "2px solid #fff"
          : "1px solid rgba(255, 255, 255, 0.15)";
      btn.style.background =
        num === active ? "rgba(255, 255, 255, 0.15)" : "transparent";
      btn.style.color =
        num === active ? "#fff" : "rgba(255, 255, 255, 0.5)";
      btn.style.fontWeight = num === active ? "700" : "400";
    });
  }

  function createToolbar() {
    const bar = document.createElement("div");
    bar.id = "vocata-toolbar";
    Object.assign(bar.style, {
      position: "fixed",
      bottom: "0",
      left: "0",
      right: "0",
      zIndex: "2147483647",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      padding: "12px 20px",
      background: "rgba(10, 10, 10, 0.92)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      borderTop: "1px solid rgba(255, 255, 255, 0.08)",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      fontSize: "13px",
      color: "rgba(255, 255, 255, 0.7)",
    });

    // Label
    const label = document.createElement("span");
    Object.assign(label.style, {
      marginRight: "12px",
      fontWeight: "600",
      color: "rgba(255, 255, 255, 0.4)",
      letterSpacing: "0.05em",
      textTransform: "uppercase",
      fontSize: "11px",
    });
    label.textContent = "Vocata UI";
    bar.appendChild(label);

    // Buttons — one per detected variation
    for (let i = 1; i <= count; i++) {
      const btn = document.createElement("button");
      btn.setAttribute("data-vocata-btn", String(i));
      btn.textContent = String(i);
      Object.assign(btn.style, {
        width: "32px",
        height: "32px",
        borderRadius: "6px",
        border:
          i === 1
            ? "2px solid #fff"
            : "1px solid rgba(255, 255, 255, 0.15)",
        background: i === 1 ? "rgba(255, 255, 255, 0.15)" : "transparent",
        color: i === 1 ? "#fff" : "rgba(255, 255, 255, 0.5)",
        cursor: "pointer",
        fontWeight: i === 1 ? "700" : "400",
        fontSize: "14px",
        fontFamily: "inherit",
        transition: "all 0.15s ease",
        padding: "0",
        lineHeight: "1",
      });
      btn.addEventListener("click", () => switchVariation(i));
      bar.appendChild(btn);
    }

    // Hint
    const hint = document.createElement("span");
    Object.assign(hint.style, {
      marginLeft: "12px",
      color: "rgba(255, 255, 255, 0.3)",
      fontSize: "11px",
    });
    hint.textContent = "Press 1–" + count + " to switch";
    bar.appendChild(hint);

    document.body.appendChild(bar);

    // Add bottom padding so toolbar doesn't obscure content
    document.body.style.paddingBottom = "56px";
  }

  function init() {
    count = document.querySelectorAll("[data-vocata-variation]").length;
    createToolbar();

    // Keyboard support
    document.addEventListener("keydown", function (e) {
      // Don't capture if user is typing in an input
      if (
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA" ||
        e.target.isContentEditable
      ) {
        return;
      }
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= count) {
        switchVariation(n);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
