(function() {
  var TICK_MS = 16;
  var TARGET_DURATION_MS = 900;
  var SHUFFLE_ATTEMPTS = 20;

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var widgets = [];

  function parseOrder(value, expectedLength) {
    var parts = (value || "").split(",");
    if (parts.length !== expectedLength) {
      return null;
    }

    var order = [];
    for (var i = 0; i < parts.length; i++) {
      var position = parseInt(parts[i], 10);
      if (isNaN(position)) {
        return null;
      }
      order.push(position);
    }

    return order;
  }

  // An address pattern harvesters can match needs a dot somewhere after the "@".
  function looksHarvestable(value) {
    var at = value.indexOf("@");
    return at !== -1 && value.indexOf(".", at) !== -1;
  }

  function setup(root) {
    var textEl = root.querySelector(".email-scramble__text");
    var toggle = root.querySelector(".email-scramble__toggle");
    if (!textEl) {
      return null;
    }

    var chars = textEl.textContent.replace(/\s+/g, "").split("");
    var order = parseOrder(root.getAttribute("data-order"), chars.length);
    if (!order) {
      return null;
    }

    var timer = null;
    var swapsPerTick = 1;
    var bookmark = 0;
    var swappedThisSweep = false;
    var running = false;
    var finished = false;

    function swapAt(i) {
      var char = chars[i];
      chars[i] = chars[i + 1];
      chars[i + 1] = char;

      var position = order[i];
      order[i] = order[i + 1];
      order[i + 1] = position;
    }

    function render() {
      textEl.textContent = chars.join("");
    }

    function shuffleOnce() {
      for (var i = chars.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));

        var char = chars[i];
        chars[i] = chars[j];
        chars[j] = char;

        var position = order[i];
        order[i] = order[j];
        order[j] = position;
      }
    }

    // Re-scramble on every visit so the arrangement stored in _config.yml is a
    // seed rather than the string people actually see.
    function shuffle() {
      for (var attempt = 0; attempt < SHUFFLE_ATTEMPTS; attempt++) {
        shuffleOnce();
        if (!looksHarvestable(chars.join(""))) {
          return;
        }
      }
    }

    // How many adjacent swaps the sort will make, so the animation can be paced.
    function countInversions() {
      var total = 0;
      for (var i = 0; i < order.length - 1; i++) {
        for (var j = i + 1; j < order.length; j++) {
          if (order[i] > order[j]) {
            total++;
          }
        }
      }
      return total;
    }

    function sortImmediately() {
      for (var pass = 0; pass < order.length; pass++) {
        var swapped = false;
        for (var i = 0; i < order.length - 1; i++) {
          if (order[i] > order[i + 1]) {
            swapAt(i);
            swapped = true;
          }
        }
        if (!swapped) {
          return;
        }
      }
    }

    function finish() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
      running = false;
      finished = true;

      var address = chars.join("");
      var link = document.createElement("a");
      link.setAttribute("href", "mailto:" + address);
      link.className = "email-scramble__address";
      link.textContent = address;

      textEl.textContent = "";
      textEl.appendChild(link);

      if (toggle && toggle.parentNode) {
        toggle.parentNode.removeChild(toggle);
      }

      root.classList.remove("is-running");
      root.classList.add("is-revealed");
    }

    // Advances the sort by a single adjacent swap. A sweep that reaches the end
    // without swapping anything means the positions are back in order, so the
    // address is restored and there is nothing left to advance.
    function advance() {
      if (bookmark >= order.length - 1) {
        if (!swappedThisSweep) {
          return false;
        }
        bookmark = 0;
        swappedThisSweep = false;
      }

      for (var i = bookmark; i < order.length - 1; i++) {
        if (order[i] > order[i + 1]) {
          swapAt(i);
          swappedThisSweep = true;
          bookmark = i;
          return true;
        }
      }

      bookmark = order.length - 1;
      return true;
    }

    // Timers below one animation frame get coalesced, so speed comes from doing
    // several swaps per frame rather than from asking for a shorter interval.
    function tick() {
      for (var n = 0; n < swapsPerTick; n++) {
        if (!advance()) {
          finish();
          return;
        }
      }
      render();
    }

    function start() {
      if (running || finished) {
        return;
      }

      if (reduceMotion) {
        sortImmediately();
        finish();
        return;
      }

      running = true;
      root.classList.add("is-running");

      var ticks = Math.max(1, Math.round(TARGET_DURATION_MS / TICK_MS));
      swapsPerTick = Math.max(1, Math.ceil(countInversions() / ticks));
      timer = window.setInterval(tick, TICK_MS);
    }

    shuffle();
    render();

    if (toggle) {
      toggle.addEventListener("click", start);
    }

    return { root: root, start: start };
  }

  function onJumpClick(event) {
    var widget = widgets[0];
    if (!widget) {
      return;
    }

    event.preventDefault();

    // Scrolling a row that is already on screen is what made this feel like a
    // random jump, so only move the page when the address is genuinely away.
    var rect = widget.root.getBoundingClientRect();
    var viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
    var offScreen = viewportHeight > 0 && (rect.bottom < 0 || rect.top > viewportHeight);

    if (offScreen && widget.root.scrollIntoView) {
      widget.root.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "nearest"
      });
    }

    widget.start();
  }

  var roots = document.querySelectorAll(".email-scramble");
  for (var i = 0; i < roots.length; i++) {
    var widget = setup(roots[i]);
    if (widget) {
      widgets.push(widget);
    }
  }

  var jumpLinks = document.querySelectorAll("[data-email-jump]");
  for (var j = 0; j < jumpLinks.length; j++) {
    jumpLinks[j].addEventListener("click", onJumpClick);
  }
})();
