(function() {
  var DEFAULT_DURATION = 1500;
  var EXIT_DURATION = 280;
  var ACTIVE_CLASS = "welcome-intro-active";

  var introEl = document.getElementById("welcome-intro");
  if (!introEl) {
    return;
  }

  var skipButton = document.getElementById("welcome-intro-skip");
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var duration = parseInt(introEl.getAttribute("data-duration-ms"), 10);
  if (!duration || duration < 0) {
    duration = DEFAULT_DURATION;
  }

  var autoTimer = null;
  var removeTimer = null;
  var finished = false;

  function cleanupIntro() {
    if (removeTimer) {
      window.clearTimeout(removeTimer);
      removeTimer = null;
    }
    if (autoTimer) {
      window.clearTimeout(autoTimer);
      autoTimer = null;
    }
    document.documentElement.classList.remove(ACTIVE_CLASS);
    document.removeEventListener("keydown", onKeydown);
    if (introEl && introEl.parentNode) {
      introEl.parentNode.removeChild(introEl);
    }
  }

  function finishIntro(immediate) {
    if (finished) {
      return;
    }
    finished = true;
    if (autoTimer) {
      window.clearTimeout(autoTimer);
      autoTimer = null;
    }

    if (immediate) {
      cleanupIntro();
      return;
    }

    introEl.classList.add("is-exiting");
    removeTimer = window.setTimeout(cleanupIntro, EXIT_DURATION);
  }

  function onKeydown(event) {
    if (event.key === "Escape") {
      finishIntro(false);
    }
  }

  function startIntro() {
    if (finished || !introEl) {
      return;
    }

    document.documentElement.classList.add(ACTIVE_CLASS);
    introEl.classList.add("is-active");
    document.addEventListener("keydown", onKeydown);

    if (skipButton) {
      skipButton.focus();
    }

    autoTimer = window.setTimeout(function() {
      finishIntro(false);
    }, duration);
  }

  if (skipButton) {
    skipButton.addEventListener("click", function() {
      finishIntro(false);
    });
  }

  if (reduceMotion) {
    finishIntro(true);
    return;
  }

  if (document.readyState === "complete") {
    startIntro();
  } else {
    window.addEventListener("load", startIntro, { once: true });
  }
})();
