/* ============================================================
   Ethan McKinzie — Portfolio Scripts
   ------------------------------------------------------------
   This site is built with HTML and CSS first. JavaScript is only
   used where CSS genuinely cannot do the job, so this file stays
   small and readable on purpose.

   Currently handles:
     - The copyright year in the footer
     - The mobile navigation menu
     - Revealing sections as they scroll into view
   ============================================================ */

/* "use strict" makes the browser reject sloppy mistakes, such as
   assigning to a variable that was never declared. */
"use strict";


/* ------------------------------------------------------------
   Footer year
   ------------------------------------------------------------
   The footer HTML contains a placeholder:

       <span data-current-year>2026</span>

   Rather than hardcoding the year and having to remember to edit
   it every January, we read the real year from the system clock
   and write it into that span.

   The HTML keeps a hardcoded year as a fallback, so if a visitor
   has JavaScript disabled they still see something sensible
   instead of a blank gap.
   ------------------------------------------------------------ */
function updateFooterYear() {
    // Find the placeholder span. querySelector uses the same kind of
    // selector you would write in CSS: here, "any element carrying a
    // data-current-year attribute".
    var yearSpan = document.querySelector("[data-current-year]");

    // Defensive check. If the span is ever renamed or removed, we stop
    // here instead of throwing an error that breaks the rest of the file.
    if (yearSpan === null) {
        return;
    }

    // new Date() is the current date and time. getFullYear() pulls the
    // four-digit year out of it.
    var currentYear = new Date().getFullYear();

    // textContent replaces the text inside the span. We use textContent
    // rather than innerHTML because we are inserting plain text, not markup.
    yearSpan.textContent = currentYear;
}


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


/* ------------------------------------------------------------
   Reveal on scroll
   ------------------------------------------------------------
   Elements marked with data-reveal in the HTML fade and rise into
   place as they scroll into view.

   The important design decision is the order of operations:

     The CSS rule that HIDES these elements is scoped inside a
     .js-reveal class, and this function is the only thing that adds
     that class. So if JavaScript is disabled, blocked, or fails to
     load, the class never appears, the hiding rule never applies,
     and the whole page is simply visible.

   Animating content in should never be able to make content
   disappear. Building it this way means it cannot.

   The work itself is done by IntersectionObserver, a browser API
   that watches elements and reports when they enter the viewport.
   The alternative would be listening to every scroll event and
   measuring positions by hand, which runs constantly and is far
   more expensive.
   ------------------------------------------------------------ */
function setupScrollReveal() {
    // Respect the operating system's "reduce motion" setting. If it
    // is on, leave everything visible and do nothing at all.
    var prefersReducedMotion =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Older browsers without IntersectionObserver also fall through
    // to the plain, always-visible page.
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        return;
    }

    // Only now is it safe to let the CSS hide anything.
    document.documentElement.classList.add("js-reveal");

    var targets = document.querySelectorAll("[data-reveal]");

    /* The observer calls this function with a list of elements whose
       visibility just changed. */
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            // isIntersecting is true when the element has come into
            // view. We ignore the opposite case, so an element that
            // has been revealed stays revealed rather than fading out
            // when scrolled past.
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");

                // Each element only needs to animate once, so stop
                // watching it. This keeps the observer's work
                // shrinking as the visitor scrolls down the page.
                observer.unobserve(entry.target);
            }
        });
    }, {
        // Fire once 10% of the element is showing, rather than
        // waiting for all of it.
        threshold: 0.1,

        // A negative bottom margin shrinks the trigger area upward,
        // so the animation starts just after the element's top edge
        // clears the bottom of the screen instead of the instant it
        // appears.
        rootMargin: "0px 0px -40px 0px"
    });

    targets.forEach(function (target) {
        observer.observe(target);
    });
}


/* ------------------------------------------------------------
   Startup
   ------------------------------------------------------------
   Everything that should run once the page is ready gets called
   from here. Keeping a single entry point means there is exactly
   one place to look to see what this file does on page load.
   ------------------------------------------------------------ */
function init() {
    updateFooterYear();
    setupMobileNav();
    setupScrollReveal();
}

/* The <script> tag sits at the very bottom of the HTML, so the
   elements above it already exist by the time this line runs. */
init();
