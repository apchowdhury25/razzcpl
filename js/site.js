(function () {
  var header = document.querySelector("[data-header]");
  if (header && document.body.classList.contains("has-hero")) {
    var onScroll = function () {
      header.classList.toggle("is-solid", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  var navState = document.getElementById("nav-open");
  if (navState) {
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") navState.checked = false;
    });
    var nav = document.getElementById("site-nav");
    if (nav) {
      nav.addEventListener("click", function (event) {
        if (event.target.closest("a")) navState.checked = false;
      });
    }
  }

  document.querySelectorAll("[data-year]").forEach(function (node) {
    node.textContent = String(new Date().getFullYear());
  });

  var explorer = document.querySelector("[data-explorer]");
  if (explorer) {
    var state = { place: "all", status: "all", type: "all" };
    var cards = Array.prototype.slice.call(explorer.querySelectorAll("[data-project]"));
    var empty = explorer.querySelector("[data-empty]");
    explorer.addEventListener("click", function (event) {
      var button = event.target.closest("[data-filter]");
      if (!button) return;
      var key = button.getAttribute("data-filter");
      state[key] = button.getAttribute("data-value");
      explorer.querySelectorAll('[data-filter="' + key + '"]').forEach(function (chip) {
        chip.classList.toggle("is-on", chip === button);
        chip.setAttribute("aria-pressed", chip === button ? "true" : "false");
      });
      var shown = 0;
      cards.forEach(function (card) {
        var ok =
          (state.place === "all" || card.getAttribute("data-place") === state.place) &&
          (state.status === "all" || card.getAttribute("data-status") === state.status) &&
          (state.type === "all" || card.getAttribute("data-type") === state.type);
        card.hidden = !ok;
        if (ok) shown += 1;
      });
      if (empty) empty.hidden = shown !== 0;
    });
  }

  var note = document.querySelector("[data-form-note]");
  var params = new URLSearchParams(window.location.search);
  if (note && params.get("sent") === "1") {
    note.hidden = false;
    note.textContent = "Thank you. If mail is switched on for this domain, the office has your note. If you do not hear back, write to hello@razzcpl.com.";
  }
  if (note && params.get("sent") === "0") {
    note.hidden = false;
    note.textContent = "The note could not be sent from the server. Please write directly to hello@razzcpl.com.";
  }

  var interest = document.querySelector("[name=interest]");
  var hashMap = {
    "#landowner": "Landowner",
    "#resident": "Future resident",
    "#commercial": "Commercial client"
  };
  if (interest && hashMap[window.location.hash]) {
    interest.value = hashMap[window.location.hash];
  }
})();
