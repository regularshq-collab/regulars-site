/* ==========================================================================
   REGULARS — shared site script
   Plain ES5-compatible-ish ES2015. No build step, no dependencies.
   Every feature is guarded: a page missing the markup must never throw.
   ========================================================================== */

/* ==========================================================================
   !!  THE ONE THING YOU CHANGE WHEN THE BOOKING LINK GOES LIVE  !!
   --------------------------------------------------------------------------
   Put the real scheduling URL here (Calendly, Cal.com, SavvyCal, whatever)
   and EVERY "Book a Free Call" button on EVERY page updates itself on load.
   Leave it as "#booking-link" until that URL exists. Do not paste the URL
   into any page's HTML — there is exactly one place it belongs, and this
   is it.
   ========================================================================== */
var BOOKING_URL = "https://calendly.com/regularshq/15-minute-meeting";
/* ========================================================================== */


(function () {
  "use strict";

  /* Mark the document as script-enabled before first paint so the CSS can
     safely hide .reveal elements. Without JS they simply stay visible. */
  document.documentElement.classList.add("js");

  var prefersReducedMotion = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }
  function on(el, type, fn, opts) { if (el) el.addEventListener(type, fn, opts); }

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }


  /* ------------------------------------------------------------------------
     1 · BOOKING LINKS
     Rewrite every .js-booking href from the single constant above.
     target=_blank + rel=noopener are added ONLY when the value becomes a real
     http(s) URL — an in-page "#booking-link" anchor must not open a new tab.
     --------------------------------------------------------------------- */
  function initBookingLinks() {
    var links = $$("a.js-booking");
    if (!links.length) return;

    var isExternal = /^https?:\/\//i.test(BOOKING_URL);

    links.forEach(function (a) {
      a.setAttribute("href", BOOKING_URL);
      if (isExternal) {
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener");
      } else {
        a.removeAttribute("target");
        a.removeAttribute("rel");
      }
    });
  }


  /* ------------------------------------------------------------------------
     2 · ACTIVE NAV STATE
     Derived from location.pathname so the header markup stays byte-identical
     on every page. "", "/" and "/index.html" all mean home.
     --------------------------------------------------------------------- */
  function normalisePath(path) {
    if (!path) return "/";
    // strip a trailing "index.html" and any trailing slash (except root)
    var p = path.replace(/index\.html?$/i, "");
    if (p.length > 1) p = p.replace(/\/+$/, "");
    if (p === "" || p === "/") return "/";
    return p;
  }

  function initActiveNav() {
    var current = normalisePath(window.location.pathname);
    var marked = [];

    $$("[data-nav]").forEach(function (link) {
      var target = normalisePath(link.getAttribute("data-nav"));
      if (target === current) {
        link.classList.add("is-active");
        link.setAttribute("aria-current", "page");
        marked.push(link);
      } else {
        link.classList.remove("is-active");
        link.removeAttribute("aria-current");
      }
    });

    // If a pillar page is active, light up the "The System" disclosure too.
    if (!marked.length) return;
    var insideMenu = marked.some(function (l) { return !!l.closest(".nav-menu"); });
    if (insideMenu) {
      var disclosure = $(".nav__disclosure");
      if (disclosure) disclosure.classList.add("is-active");
    }
  }


  /* ------------------------------------------------------------------------
     3 · "THE SYSTEM" DISCLOSURE (desktop dropdown)
     Works with mouse, touch and keyboard. It is a <button>, so Enter/Space
     already toggle it; we add hover-open on pointer devices, Escape to close,
     arrow keys to walk the items, and click-outside to dismiss.
     --------------------------------------------------------------------- */
  function initDisclosure() {
    var btn = $(".nav__disclosure");
    var menu = btn && document.getElementById(btn.getAttribute("aria-controls") || "");
    if (!btn || !menu) return;

    var wrap = btn.closest(".nav__item--group") || btn.parentNode;
    var hoverCapable = window.matchMedia
      ? window.matchMedia("(hover: hover) and (pointer: fine)").matches
      : false;
    var closeTimer = null;

    function open() {
      window.clearTimeout(closeTimer);
      menu.hidden = false;
      btn.setAttribute("aria-expanded", "true");
    }
    function close(refocus) {
      window.clearTimeout(closeTimer);
      menu.hidden = true;
      btn.setAttribute("aria-expanded", "false");
      if (refocus) btn.focus();
    }
    function isOpen() { return btn.getAttribute("aria-expanded") === "true"; }

    on(btn, "click", function (e) {
      e.preventDefault();
      if (isOpen()) { close(false); } else { open(); }
    });

    if (hoverCapable) {
      on(wrap, "mouseenter", open);
      on(wrap, "mouseleave", function () {
        closeTimer = window.setTimeout(function () { close(false); }, 120);
      });
    }

    on(wrap, "focusout", function (e) {
      if (!wrap.contains(e.relatedTarget)) close(false);
    });

    on(document, "keydown", function (e) {
      if (e.key === "Escape" && isOpen()) close(true);
    });

    on(document, "click", function (e) {
      if (isOpen() && !wrap.contains(e.target)) close(false);
    });

    on(btn, "keydown", function (e) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        open();
        var first = $(".nav-menu__link", menu);
        if (first) first.focus();
      }
    });

    on(menu, "keydown", function (e) {
      var items = $$(".nav-menu__link", menu);
      if (!items.length) return;
      var i = items.indexOf(document.activeElement);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        items[(i + 1 + items.length) % items.length].focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (i <= 0) { btn.focus(); } else { items[i - 1].focus(); }
      } else if (e.key === "Home") {
        e.preventDefault(); items[0].focus();
      } else if (e.key === "End") {
        e.preventDefault(); items[items.length - 1].focus();
      } else if (e.key === "Tab" && !e.shiftKey && i === items.length - 1) {
        close(false);
      }
    });
  }


  /* ------------------------------------------------------------------------
     4 · MOBILE NAV PANEL
     --------------------------------------------------------------------- */
  function initMobileNav() {
    var toggle = $("#nav-toggle");
    var panel = $("#nav-panel");
    if (!toggle || !panel) return;

    var lastFocus = null;

    function openPanel() {
      lastFocus = document.activeElement;
      panel.hidden = false;
      toggle.setAttribute("aria-expanded", "true");
      document.body.classList.add("nav-open");
      var first = panel.querySelector("a, button, input");
      if (first) first.focus();
    }

    function closePanel(refocus) {
      panel.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
      if (refocus) {
        (lastFocus && document.contains(lastFocus) ? lastFocus : toggle).focus();
      }
    }

    function isOpen() { return toggle.getAttribute("aria-expanded") === "true"; }

    on(toggle, "click", function () {
      if (isOpen()) { closePanel(true); } else { openPanel(); }
    });

    on(document, "keydown", function (e) {
      if (e.key === "Escape" && isOpen()) { closePanel(true); }
    });

    // Close on navigation to an in-page anchor, and trap nothing else.
    on(panel, "click", function (e) {
      var link = e.target.closest ? e.target.closest("a") : null;
      if (link) closePanel(false);
    });

    // Rudimentary focus containment while the panel owns the screen.
    on(panel, "keydown", function (e) {
      if (e.key !== "Tab" || !isOpen()) return;
      var focusables = $$("a[href], button:not([disabled]), input, select, textarea", panel)
        .filter(function (el) { return el.offsetParent !== null; });
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); toggle.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); toggle.focus();
      }
    });

    // If the viewport grows past the mobile breakpoint, put things back.
    if (window.matchMedia) {
      var mq = window.matchMedia("(min-width: 1001px)");
      var handler = function (ev) { if (ev.matches && isOpen()) closePanel(false); };
      if (mq.addEventListener) { mq.addEventListener("change", handler); }
      else if (mq.addListener) { mq.addListener(handler); }
    }
  }


  /* ------------------------------------------------------------------------
     5 · HEADER CONDENSE ON SCROLL
     No shadow — a 2px amber rule and a shorter masthead. That is the whole
     effect. rAF-throttled.
     --------------------------------------------------------------------- */
  function initHeaderScroll() {
    var head = $("#site-head");
    if (!head) return;
    var ticking = false;

    /* Hysteresis, and it is load-bearing.
       The header is position:sticky, so it sits in normal flow. Condensing it
       collapses the rail and shortens the masthead — roughly 74px of layout —
       which nudges the scroll position. With a single 24px threshold the class
       could switch off, the header grow, the threshold be recrossed, and the
       whole bar oscillate every frame. That is the shaking.
       Two thresholds with a wide dead zone make a flip-flop impossible: it
       condenses at 96px and only relaxes again below 32px. */
    var ON_AT = 96;
    var OFF_AT = 32;

    function update() {
      ticking = false;
      var y = window.pageYOffset || document.documentElement.scrollTop || 0;
      var on = head.classList.contains("is-scrolled");
      if (!on && y > ON_AT) head.classList.add("is-scrolled");
      else if (on && y < OFF_AT) head.classList.remove("is-scrolled");
    }

    on(window, "scroll", function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }, { passive: true });

    update();
  }


  /* ------------------------------------------------------------------------
     6 · FAQ ACCORDION
     Buttons carry aria-expanded; the panel is a grid-rows transition so it
     animates without measuring anything.
     --------------------------------------------------------------------- */
  function initFaq() {
    var items = $$(".faq__item");
    if (!items.length) return;

    items.forEach(function (item) {
      var btn = $(".faq__q", item);
      var panel = $(".faq__a", item);
      if (!btn || !panel) return;

      if (!panel.id) {
        panel.id = "faq-panel-" + Math.random().toString(36).slice(2, 9);
      }
      btn.setAttribute("aria-controls", panel.id);
      if (!btn.hasAttribute("aria-expanded")) {
        btn.setAttribute("aria-expanded", item.classList.contains("is-open") ? "true" : "false");
      }
      if (!btn.id) {
        btn.id = panel.id + "-label";
      }
      panel.setAttribute("role", "region");
      if (!panel.hasAttribute("aria-label")) {
        panel.setAttribute("aria-labelledby", btn.id);
      }

      on(btn, "click", function () {
        var open = item.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });
  }


  /* ------------------------------------------------------------------------
     7 · SCROLL REVEAL
     Skipped entirely under prefers-reduced-motion or without IO support:
     in both cases the elements are simply shown.
     --------------------------------------------------------------------- */
  function initReveal() {
    var els = $$(".reveal");
    if (!els.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    els.forEach(function (el) { io.observe(el); });
  }


  /* ------------------------------------------------------------------------
     8 · FOOTER YEAR
     --------------------------------------------------------------------- */
  function initYear() {
    var year = String(new Date().getFullYear());
    $$(".js-year").forEach(function (el) { el.textContent = year; });
  }


  /* ------------------------------------------------------------------------
     9 · MISSED-CALL REVENUE CALCULATOR
     The owner's own numbers, run through the owner's own arithmetic.
     monthly = job value × missed calls/week × close rate × 4.33 weeks
     annual  = monthly × 12
     This is an ESTIMATE and every page that embeds it must say so in visible
     copy (.calc__caveat). See DESIGN-SYSTEM.md.
     --------------------------------------------------------------------- */
  var WEEKS_PER_MONTH = 4.33;

  var money0 = new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD",
    minimumFractionDigits: 0, maximumFractionDigits: 0
  });

  function clampNum(value, min, max, fallback) {
    var n = parseFloat(value);
    if (!isFinite(n)) n = fallback;
    if (n < min) n = min;
    if (n > max) n = max;
    return n;
  }

  function initCalculator() {
    var jobEl = document.getElementById("calc-job-value");
    var missedEl = document.getElementById("calc-missed-calls");
    var rateEl = document.getElementById("calc-close-rate");
    var rateOut = document.getElementById("calc-close-rate-out");
    var monthlyEl = document.getElementById("calc-monthly");
    var annualEl = document.getElementById("calc-annual");

    // Nothing to do on pages that do not carry the calculator.
    if (!jobEl || !missedEl || !rateEl || !monthlyEl || !annualEl) return;

    function recalc() {
      var jobValue = clampNum(jobEl.value, 0, 1000000, 0);
      var missed = clampNum(missedEl.value, 0, 500, 0);
      var rate = clampNum(rateEl.value, 0, 100, 25);

      var monthly = jobValue * missed * (rate / 100) * WEEKS_PER_MONTH;
      var annual = monthly * 12;

      monthlyEl.textContent = money0.format(Math.round(monthly));
      annualEl.textContent = money0.format(Math.round(annual));
      if (rateOut) rateOut.textContent = Math.round(rate) + "%";
    }

    [jobEl, missedEl, rateEl].forEach(function (el) {
      on(el, "input", recalc);
      on(el, "change", recalc);
    });

    recalc();
  }


  /* ------------------------------------------------------------------------
     10 · CONTACT FORM
     Validates client-side and composes a mailto:. Nothing is posted anywhere.
     Swap CONTACT_EMAIL when the real inbox exists.
     --------------------------------------------------------------------- */
  var CONTACT_EMAIL = "regularshq@gmail.com";

  function setFieldState(input, valid, message) {
    var field = input.closest(".field");
    if (!field) return;
    field.classList.toggle("is-invalid", !valid);
    field.classList.toggle("is-valid", valid && !!input.value);
    input.setAttribute("aria-invalid", valid ? "false" : "true");
    var err = $(".field__error", field);
    if (err && message) err.textContent = message;
  }

  function validateInput(input) {
    var value = (input.value || "").trim();
    var required = input.hasAttribute("required");

    if (required && !value) {
      setFieldState(input, false, input.dataset.errorRequired || "This one is required.");
      return false;
    }
    if (input.type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      setFieldState(input, false, input.dataset.errorFormat || "That email address does not look right.");
      return false;
    }
    if (input.type === "tel" && value && value.replace(/[^0-9]/g, "").length < 7) {
      setFieldState(input, false, input.dataset.errorFormat || "That phone number looks too short.");
      return false;
    }
    setFieldState(input, true, "");
    return true;
  }

  function initContactForm() {
    var form = $("#contact-form");
    if (!form) return;

    var status = $(".form-status", form) || $("#form-status");
    var fields = $$("input, select, textarea", form).filter(function (el) {
      return el.type !== "hidden" && el.type !== "submit";
    });

    fields.forEach(function (el) {
      on(el, "blur", function () { if (el.value || el.hasAttribute("required")) validateInput(el); });
      on(el, "input", function () {
        var field = el.closest(".field");
        if (field && field.classList.contains("is-invalid")) validateInput(el);
      });
    });

    on(form, "submit", function (e) {
      e.preventDefault();

      var firstBad = null;
      fields.forEach(function (el) {
        var ok = validateInput(el);
        if (!ok && !firstBad) firstBad = el;
      });

      if (firstBad) {
        if (status) {
          status.textContent = "Check the marked fields and send again.";
          status.classList.add("is-visible");
        }
        firstBad.focus();
        return;
      }

      var get = function (name) {
        var el = form.elements[name];
        return el && el.value ? String(el.value).trim() : "";
      };

      var name = get("name");
      var business = get("business");
      var trade = get("trade");
      var email = get("email");
      var phone = get("phone");
      var message = get("message");

      var subject = "Regulars enquiry" + (business ? " — " + business : "");
      var bodyLines = [
        "Name: " + name,
        "Business: " + business,
        "Trade: " + trade,
        "Email: " + email,
        "Phone: " + phone,
        "",
        message
      ];

      var href = "mailto:" + CONTACT_EMAIL +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(bodyLines.join("\n"));

      if (status) {
        status.textContent = "Opening your email app with this message ready to send to " +
          CONTACT_EMAIL + ". Nothing was submitted to a server.";
        status.classList.add("is-visible");
      }

      window.location.href = href;
    });
  }


  /* ------------------------------------------------------------------------
     BOOT
     --------------------------------------------------------------------- */
  ready(function () {
    initBookingLinks();
    initActiveNav();
    initDisclosure();
    initMobileNav();
    initHeaderScroll();
    initFaq();
    initReveal();
    initYear();
    initCalculator();
    initContactForm();
  });
})();
