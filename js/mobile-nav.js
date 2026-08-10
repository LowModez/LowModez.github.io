/* ============================================================
   mobile-nav.js
   The narrow-screen navigation menu
   ------------------------------------------------------------
   One job per file. Loaded by every page before js/main.js,
   which is the only file that calls anything.
   ============================================================ */

"use strict";


/* ------------------------------------------------------------
   Mobile navigation menu
   ------------------------------------------------------------
   On narrow screens the CSS hides the navigation and shows a
   hamburger button instead. CSS alone cannot remember whether the
   menu is open, so this is the one place the site genuinely needs
   JavaScript.

   Two things have to change together every time the menu opens
   or closes:

     1. The class "is-open" on the <nav>, which the CSS uses to
        show or hide the panel.
     2. The aria-expanded attribute on the button, which is what a
        screen reader reads out. The CSS also draws the X icon from
        this attribute, so the visual state and the announced state
        come from a single source and cannot disagree.

   Both are handled by setMenuOpen() below, so there is no way to
   update one and forget the other.
   ------------------------------------------------------------ */
function setupMobileNav() {
    var toggle = document.querySelector(".nav-toggle");
    var menu = document.querySelector("#site-menu");

    // If either element is missing, do nothing rather than error.
    if (toggle === null || menu === null) {
        return;
    }

    /* Opens or closes the menu.
       "shouldOpen" is true to open, false to close. */
    function setMenuOpen(shouldOpen) {
        // classList.toggle's second argument forces the class on
        // (true) or off (false), instead of flipping it.
        menu.classList.toggle("is-open", shouldOpen);

        // setAttribute writes a string, so the boolean is converted.
        toggle.setAttribute("aria-expanded", String(shouldOpen));
    }

    /* Reads the current state back off the button rather than
       tracking it in a separate variable. One source of truth. */
    function isMenuOpen() {
        return toggle.getAttribute("aria-expanded") === "true";
    }

    // --- Clicking the hamburger flips the menu ---
    toggle.addEventListener("click", function () {
        setMenuOpen(!isMenuOpen());
    });

    /* --- Tapping a link closes the menu ---
       The nav links are anchors that jump to sections on this same
       page. Without this, the panel would stay open covering the
       section the visitor just asked to see.

       The listener sits on the <nav> rather than on each link. The
       click bubbles up from whichever link was pressed, so one
       listener covers them all, including any links added later.
       event.target is the element actually clicked. */
    menu.addEventListener("click", function (event) {
        if (event.target.closest("a") !== null) {
            setMenuOpen(false);
        }
    });

    /* --- Escape closes the menu ---
       Standard behavior for anything that opens over the page, and
       expected by keyboard users. Focus is returned to the button
       so tabbing continues from a sensible place. */
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && isMenuOpen()) {
            setMenuOpen(false);
            toggle.focus();
        }
    });

    /* --- Widening the window resets the menu ---
       Above 48rem the CSS shows the navigation as a normal
       horizontal row and hides the hamburger. If the menu was left
       open on a phone-sized window and the window is then widened,
       aria-expanded would still say "true" while the button is no
       longer visible. Clearing it keeps the state honest.

       matchMedia asks the browser the same question the CSS media
       query asks, so the breakpoint only has to be changed in two
       obvious places if it ever moves. */
    var narrowScreen = window.matchMedia("(max-width: 48rem)");

    narrowScreen.addEventListener("change", function (event) {
        // event.matches is true while the screen is still narrow.
        if (!event.matches) {
            setMenuOpen(false);
        }
    });
}
