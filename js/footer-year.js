/* ============================================================
   footer-year.js
   Keeps the footer copyright year current
   ------------------------------------------------------------
   One job per file. Loaded by every page before js/main.js,
   which is the only file that calls anything.
   ============================================================ */

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
