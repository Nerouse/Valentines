(function () {
  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function ensureOverlay() {
    var overlay = qs("#fx-overlay");
    if (overlay) return overlay;

    overlay = document.createElement("div");
    overlay.id = "fx-overlay";

    var hearts = document.createElement("div");
    hearts.id = "fx-hearts";

    var confetti = document.createElement("div");
    confetti.id = "fx-confetti";

    overlay.appendChild(confetti);
    overlay.appendChild(hearts);
    document.body.appendChild(overlay);

    return overlay;
  }

  function clearLayer(id) {
    var el = qs(id);
    if (!el) return;
    while (el.firstChild) el.removeChild(el.firstChild);
  }

  function spawnHearts(opts) {
    var overlay = ensureOverlay();
    var layer = qs("#fx-hearts", overlay);
    clearLayer("#fx-hearts");

    var count = (opts && opts.count) || 18;

    for (var i = 0; i < count; i += 1) {
      var h = document.createElement("span");
      h.className = "fx-heart";

      var left = Math.random() * 100;
      var size = 8 + Math.random() * 28;
      var delay = Math.random() * 0.18;
      var dur = 0.9 + Math.random() * 0.7;
      var drift = (Math.random() * 2 - 1) * 26;
      var tint = Math.random() < 0.75 ? "pink" : "black";

      h.style.setProperty("--x", left.toFixed(2) + "vw");
      h.style.setProperty("--s", size.toFixed(2) + "px");
      h.style.setProperty("--d", delay.toFixed(3) + "s");
      h.style.setProperty("--t", dur.toFixed(3) + "s");
      h.style.setProperty("--dx", drift.toFixed(2) + "px");
      h.setAttribute("data-tint", tint);

      layer.appendChild(h);
    }

    overlay.classList.add("active");
    overlay.classList.add("hearts");

    window.setTimeout(function () {
      overlay.classList.remove("hearts");
      clearLayer("#fx-hearts");
      if (!overlay.classList.contains("confetti")) overlay.classList.remove("active");
    }, 820);
  }

  function spawnConfetti(opts) {
    var overlay = ensureOverlay();
    var layer = qs("#fx-confetti", overlay);
    clearLayer("#fx-confetti");

    var count = (opts && opts.count) || 180;
    var colors = ["#ff4da6", "#ff78c6", "#111111"]; 

    for (var i = 0; i < count; i += 1) {
      var c = document.createElement("span");
      c.className = "fx-confetti";

      var left = Math.random() * 100;
      var sizeW = 6 + Math.random() * 7;
      var sizeH = 10 + Math.random() * 10;
      var delay = Math.random() * 0.15;
      var dur = 0.9 + Math.random() * 0.55;
      var rot = Math.random() * 360;
      var drift = (Math.random() * 2 - 1) * 120;
      var color = colors[Math.floor(Math.random() * colors.length)];

      c.style.setProperty("--x", left.toFixed(2) + "vw");
      c.style.setProperty("--w", sizeW.toFixed(2) + "px");
      c.style.setProperty("--h", sizeH.toFixed(2) + "px");
      c.style.setProperty("--d", delay.toFixed(3) + "s");
      c.style.setProperty("--t", dur.toFixed(3) + "s");
      c.style.setProperty("--r", rot.toFixed(1) + "deg");
      c.style.setProperty("--dx", drift.toFixed(1) + "px");
      c.style.setProperty("--c", color);

      layer.appendChild(c);
    }

    overlay.classList.add("active");
    overlay.classList.add("confetti");

    window.setTimeout(function () {
      overlay.classList.remove("confetti");
      clearLayer("#fx-confetti");
      if (!overlay.classList.contains("hearts")) overlay.classList.remove("active");
    }, 1600);
  }

  function navigateWithHearts(url, opts) {
    var o = opts || {};
    if (o.confetti) spawnConfetti({ count: 220 });
    spawnHearts({ count: 40 });

    // dramatic final heart: expand a single heart to cover screen
    var overlay = ensureOverlay();
    var layer = qs("#fx-hearts", overlay);
    var final = document.createElement('div');
    final.className = 'fx-final-heart';
    overlay.appendChild(final);
    overlay.classList.add('active');
    // allow animation then navigate
    window.setTimeout(function () {
      final.classList.add('expand');
    }, 280);

    window.setTimeout(function () {
      window.location.href = url;
    }, 1050);
  }

  function bindNav() {
    document.addEventListener("click", function (e) {
      var target = e.target.closest("[data-nav]");
      if (!target) return;

      e.preventDefault();

      var url = target.getAttribute("data-nav");
      var confetti = target.getAttribute("data-confetti") === "true";

      navigateWithHearts(url, { confetti: confetti });
    });
  }

  window.FX = {
    navigateWithHearts: navigateWithHearts,
    spawnConfetti: spawnConfetti,
    spawnHearts: spawnHearts
  };

  document.addEventListener("DOMContentLoaded", function () {
    ensureOverlay();
    bindNav();

    var overlay = document.getElementById("fx-overlay");
    if (overlay) overlay.classList.remove("active", "hearts", "confetti");
  });
})();
