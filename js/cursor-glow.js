/* ============================================================
   cursor-glow.js
   Moves the page-wide glow to follow the pointer
   ------------------------------------------------------------
   One job per file. Loaded by every page before js/main.js,
   which is the only file that calls anything.

   WHAT THIS DOES
   There is one fixed, full-screen element on each page with the
   class .cursor-glow. css/animations.css paints a large soft
   gradient on it, centred on two custom properties. This file keeps
   those properties in step with the pointer, so the light drifts
   around the page as the cursor moves.

   ON PERFORMANCE
   A pointer can fire dozens of events a second, and doing real work
   on each one is how a page starts to feel sluggish. Two things keep
   this cheap:

     1. The only work done per event is storing two numbers. No
        measuring, no reading of layout, no style changes.
     2. The properties are written inside requestAnimationFrame,
        which asks the browser for the moment just before it next
        paints. Several pointer events between two frames collapse
        into a single update, so the work is capped at the screen's
        refresh rate rather than the pointer's report rate.

   If this file never loads, .cursor-glow stays at opacity 0 and is
   invisible. The class that reveals it is only added here, so the
   effect cannot appear in a half-working state.
   ============================================================ */

"use strict";


function setupCursorGlow() {
    // Movement that follows the cursor is exactly what this asks to stop.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
    }

    // No cursor on a touch screen, so there is nothing to follow.
    if (!window.matchMedia("(hover: hover)").matches) {
        return;
    }

    var glow = document.querySelector(".cursor-glow");

    if (glow === null) {
        return;
    }

    // Latest known pointer position, in pixels from the window's corner.
    var pointerX = 0;
    var pointerY = 0;

    /* Tracks whether an update is already booked for the next frame,
       so several pointer events in quick succession only ever queue
       one. Without this, a fast mouse would book dozens of redundant
       callbacks. */
    var updateQueued = false;

    function applyPosition() {
        updateQueued = false;

        glow.style.setProperty("--cursor-x", pointerX + "px");
        glow.style.setProperty("--cursor-y", pointerY + "px");
    }

    document.addEventListener("pointermove", function (event) {
        // Cheap: just remember where the pointer is.
        pointerX = event.clientX;
        pointerY = event.clientY;

        if (!updateQueued) {
            updateQueued = true;
            window.requestAnimationFrame(applyPosition);
        }
    });

    /* Fade the glow out while the pointer is off the page entirely,
       so it does not sit frozen at the edge of the window. */
    document.addEventListener("pointerleave", function () {
        glow.classList.remove("is-active");
    });

    document.addEventListener("pointerenter", function () {
        glow.classList.add("is-active");
    });

    // Reveal it now that we know a real pointer is present.
    glow.classList.add("is-active");
}
