/* ============================================================
   scroll-reveal.js
   Fades sections in as they scroll into view
   ------------------------------------------------------------
   One job per file. Loaded by every page before js/main.js,
   which is the only file that calls anything.
   ============================================================ */

"use strict";


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
