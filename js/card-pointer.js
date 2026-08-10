/* ============================================================
   card-pointer.js
   Makes each card respond to where the pointer is over it
   ------------------------------------------------------------
   One job per file. Loaded by every page before js/main.js,
   which is the only file that calls anything.

   WHAT THIS DOES
   Two effects, both driven by the same measurement:

     1. A soft glow that follows the cursor across the card.
     2. A slight three-dimensional lean toward the cursor.

   Both are described entirely in css/animations.css. This file
   measures the pointer and writes four numbers onto the card:

       --mx, --my   pointer position, as percentages of the card
       --rx, --ry   rotation angles for the tilt, in degrees

   WHY IT IS DONE THIS WAY
   CSS cannot read the pointer position, so something has to hand it
   over. But notice what this file does not do: it never sets a
   color, a size, an opacity, or a transform. It writes coordinates.
   Every decision about how the card looks stays in the stylesheet,
   with the rest of the design.

   If this file never loads, all four properties keep the neutral
   defaults declared in the CSS, and the card simply lifts on hover
   as it otherwise would. Nothing looks broken or missing.
   ============================================================ */

"use strict";


/* The furthest the card will lean, in degrees. Small on purpose:
   past about 8 degrees the effect stops looking like a subtle
   response and starts looking like a novelty. */
var CARD_MAX_TILT = 5;


function setupCardPointer() {
    /* Skip entirely if the visitor asked for reduced motion. A card
       that leans and a light that chases the cursor are exactly the
       kind of movement that setting is asking us not to produce. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
    }

    /* Skip where there is no cursor to follow. "(hover: hover)" is
       true only for input that can hover, such as a mouse or a
       trackpad. On a phone, tracking would cost battery for an effect
       nobody can see. */
    if (!window.matchMedia("(hover: hover)").matches) {
        return;
    }

    var cards = document.querySelectorAll(".card--interactive");

    if (cards.length === 0) {
        return;
    }

    /* Measures the pointer against one card and writes the results.

       getBoundingClientRect() gives the card's position and size
       relative to the visible part of the window. event.clientX and
       clientY are measured from the same origin, so subtracting one
       from the other gives the pointer's offset inside the card.
       Dividing by the width or height turns that into a fraction
       between 0 and 1. */
    function trackPointer(card, event) {
        var box = card.getBoundingClientRect();

        var fractionX = (event.clientX - box.left) / box.width;
        var fractionY = (event.clientY - box.top) / box.height;

        /* The glow wants percentages. */
        card.style.setProperty("--mx", (fractionX * 100).toFixed(2) + "%");
        card.style.setProperty("--my", (fractionY * 100).toFixed(2) + "%");

        /* The tilt wants angles. Subtracting 0.5 re-centres the
           fraction so the middle of the card is 0 and the edges are
           -0.5 and +0.5. Multiplying by twice the maximum tilt turns
           that range into -MAX to +MAX degrees.

           rotateX tips the card forward and back, so it is driven by
           vertical position, and it is negated: when the pointer is
           low on the card, the bottom edge should come toward the
           viewer, which is a negative rotation on that axis. */
        var tiltX = -(fractionY - 0.5) * (CARD_MAX_TILT * 2);
        var tiltY = (fractionX - 0.5) * (CARD_MAX_TILT * 2);

        card.style.setProperty("--rx", tiltX.toFixed(2) + "deg");
        card.style.setProperty("--ry", tiltY.toFixed(2) + "deg");
    }

    cards.forEach(function (card) {
        /* pointermove covers mouse, pen, and trackpad with a single
           event rather than one listener per input type.

           The listener sits on the card, not the document, so it only
           runs while the pointer is actually over a card. */
        card.addEventListener("pointermove", function (event) {
            trackPointer(card, event);
        });

        /* On the way out, remove all four properties so the card
           returns to the neutral values in the CSS. Without this it
           would stay frozen at whatever angle the pointer left it. */
        card.addEventListener("pointerleave", function () {
            card.style.removeProperty("--mx");
            card.style.removeProperty("--my");
            card.style.removeProperty("--rx");
            card.style.removeProperty("--ry");
        });
    });
}
