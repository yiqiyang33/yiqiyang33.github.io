(function() {
  var STEP_INTERVAL_MS = 12;
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

    // One swap per tick. A sweep that reaches the end without swapping anything
    // means the positions are back in order, so the address is restored.
    function step() {
      if (bookmark >= order.length - 1) {
        if (!swappedThisSweep) {
          finish();
          return;
        }
        bookmark = 0;
        swappedThisSweep = false;
      }

      for (var i = bookmark; i < order.length - 1; i++) {
        if (order[i] > order[i + 1]) {
          swapAt(i);
          render();
          swappedThisSweep = true;
          bookmark = i;
          return;
        }
      }

      bookmark = order.length - 1;
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
      timer = window.setInterval(step, STEP_INTERVAL_MS);
    }

    shuffle();
    render();

    if (toggle) {
      toggle.addEventListener("click", function(event) {
        event.preventDefault();
        start();
      });
    }

    return { root: root, start: start };
  }

  function onJumpClick(event) {
    var widget = widgets[0];
    if (!widget) {
      return;
    }

    event.preventDefault();
    if (widget.root.scrollIntoView) {
      widget.root.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "center"
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
