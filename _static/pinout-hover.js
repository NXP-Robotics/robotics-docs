/*
 * pinout-hover.js — interactive SVG pinout cards for the MR-NavQ95 hardware
 * reference page.
 *
 * Copyright 2026 NXP
 * SPDX-License-Identifier: Apache-2.0
 *
 * The content page authors each pinout/overview figure as raw HTML:
 *
 *     <figure class="pinout-figure" data-pinout>
 *       <picture>
 *         <source media="(prefers-color-scheme: dark)" srcset="resources/img/<name>-dark.svg">
 *         <img alt="..." src="resources/img/<name>.svg" width="..." height="...">
 *       </picture>
 *     </figure>
 *
 * On load, this script finds those figures, fetches the referenced SVG, inlines
 * it into the DOM and wires per-element interactivity so that:
 *   - hovering a pin group (<g data-pin>) or a board callout (<g data-callout>)
 *     highlights it (via the `.hl` class; styling lives in custom.css),
 *   - clicking a pin group copies its net/pad name to the clipboard, and
 *   - clicking a board callout that carries a data-href navigates to the
 *     matching connector card on the page.
 *
 * The dark-mode SVG variant is used when the Furo theme is in dark mode, and the
 * inlined SVGs are swapped live when the reader toggles the theme.
 *
 * This mirrors the behaviour of the upstream single-page hardware reference. It
 * is a no-op on any page that has no `figure.pinout-figure` element, so it can be
 * loaded site-wide harmlessly, but in practice only the hardware page uses it.
 */
(function () {
  "use strict";

  // Cache fetched SVG text so a light/dark swap does not refetch.
  var svgCache = {};

  function currentThemeIsDark() {
    var t = document.body.getAttribute("data-theme");
    if (t === "dark") return true;
    if (t === "light") return false;
    // "auto" (or unset): follow the OS preference.
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  }

  function fetchSvg(url) {
    if (svgCache[url]) return Promise.resolve(svgCache[url]);
    return fetch(url)
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status + " for " + url);
        return r.text();
      })
      .then(function (txt) {
        svgCache[url] = txt;
        return txt;
      });
  }

  function wireSvg(svg) {
    // Pin groups: hover highlight + click-to-copy the net/pad name.
    svg.querySelectorAll("g[data-pin]").forEach(function (g) {
      g.addEventListener("mouseenter", function () {
        g.classList.add("hl");
      });
      g.addEventListener("mouseleave", function () {
        g.classList.remove("hl");
      });
      g.addEventListener("click", function () {
        var texts = Array.prototype.map.call(
          g.querySelectorAll("text"),
          function (t) {
            return t.textContent;
          }
        );
        var name = texts[texts.length - 1];
        if (name && navigator.clipboard) {
          navigator.clipboard.writeText(name).catch(function () {});
        }
      });
    });
    // Board callouts (overview figures): hover highlight, plus click/keyboard
    // navigation to the matching connector card when a data-href is present.
    svg.querySelectorAll("g[data-callout]").forEach(function (g) {
      g.addEventListener("mouseenter", function () {
        g.classList.add("hl");
      });
      g.addEventListener("mouseleave", function () {
        g.classList.remove("hl");
      });
      var href = g.getAttribute("data-href");
      if (href) {
        g.classList.add("callout-link");
        g.setAttribute("tabindex", "0");
        g.setAttribute("role", "link");
        g.addEventListener("click", function () {
          navigateToAnchor(href);
        });
        g.addEventListener("keydown", function (ev) {
          if (ev.key === "Enter" || ev.key === " " || ev.key === "Spacebar") {
            ev.preventDefault();
            navigateToAnchor(href);
          }
        });
      }
    });
  }

  // Resolve a callout's data-href (an upstream GitHub-style slug such as
  // "#esc-pwr-battery") to the matching Sphinx/MyST heading on the page and
  // scroll to it. MyST and GitHub slug rules differ slightly (e.g. underscores
  // vs hyphens, and MyST inserts a hyphen between a letter and a digit), so this
  // tries the href verbatim, then an underscore->hyphen variant, then a fuzzy
  // match that compares the ids with all "-"/"_" removed.
  function navigateToAnchor(href) {
    if (!href) return;
    var want = href.charAt(0) === "#" ? href.slice(1) : href;

    function find(id) {
      if (!id) return null;
      try {
        return (
          document.getElementById(id) ||
          document.querySelector(
            'section[id="' + id + '"], [id="' + id + '"]'
          )
        );
      } catch (e) {
        return null;
      }
    }

    var el = find(want) || find(want.replace(/_/g, "-"));
    if (!el) {
      var squash = function (s) {
        return s.toLowerCase().replace(/[-_]/g, "");
      };
      var target = squash(want);
      var candidates = document.querySelectorAll(
        "h1[id], h2[id], h3[id], h4[id], section[id], [id]"
      );
      for (var i = 0; i < candidates.length; i++) {
        if (squash(candidates[i].id) === target) {
          el = candidates[i];
          break;
        }
      }
    }
    if (!el) return;

    if (el.scrollIntoView) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, "", "#" + el.id);
    } else {
      window.location.hash = el.id;
    }
  }

  function inlineFigure(fig) {
    var img = fig.querySelector("img");
    if (!img) return;
    var lightSrc = img.getAttribute("src");
    if (!lightSrc) return;
    var darkSrc = null;
    var source = fig.querySelector(
      'source[media*="prefers-color-scheme: dark"]'
    );
    if (source && source.getAttribute("srcset")) {
      darkSrc = source.getAttribute("srcset");
    }
    // Resolve relative URLs against the page so fetch() works from any depth.
    var base = document.baseURI;
    var light = new URL(lightSrc, base).href;
    var dark = darkSrc ? new URL(darkSrc, base).href : light;
    // Preserve the intended max display width so the inlined SVG matches the
    // <img width> (SVGs otherwise render at their intrinsic viewBox size).
    var maxW = img.getAttribute("width");

    fig.setAttribute("data-svg-light", light);
    fig.setAttribute("data-svg-dark", dark);
    if (maxW) fig.setAttribute("data-svg-maxwidth", maxW);

    render(fig);
  }

  function render(fig) {
    var url = currentThemeIsDark()
      ? fig.getAttribute("data-svg-dark")
      : fig.getAttribute("data-svg-light");
    if (!url) return;
    fetchSvg(url)
      .then(function (txt) {
        var doc = new DOMParser().parseFromString(txt, "image/svg+xml");
        var svg = doc.documentElement;
        if (!svg || svg.nodeName.toLowerCase() !== "svg") return;
        // Adopt the parsed <svg> into this document.
        svg = document.importNode(svg, true);
        svg.classList.add("pinout-svg");
        var maxW = fig.getAttribute("data-svg-maxwidth");
        // Make the SVG scale responsively up to its natural width.
        svg.removeAttribute("width");
        svg.removeAttribute("height");
        svg.style.height = "auto";
        svg.style.maxWidth = maxW ? maxW + "px" : "100%";
        svg.style.width = "100%";
        // Replace any previously rendered content (initial <picture> or a
        // previously inlined SVG after a theme swap).
        var old = fig.querySelector("svg.pinout-svg");
        if (old) {
          old.replaceWith(svg);
        } else {
          var pic = fig.querySelector("picture");
          if (pic) pic.replaceWith(svg);
          else fig.appendChild(svg);
        }
        wireSvg(svg);
      })
      .catch(function () {
        /* leave the <picture> fallback in place on error */
      });
  }

  function init() {
    var figures = document.querySelectorAll("figure.pinout-figure[data-pinout]");
    if (!figures.length) return;
    figures.forEach(inlineFigure);

    // Re-render inlined SVGs when the Furo theme toggle flips data-theme.
    var observer = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        if (mutations[i].attributeName === "data-theme") {
          document
            .querySelectorAll("figure.pinout-figure[data-pinout]")
            .forEach(render);
          break;
        }
      }
    });
    observer.observe(document.body, { attributes: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
