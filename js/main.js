/* ============================================================
   main.js
   The single entry point for every page
   ------------------------------------------------------------
   Each behavior on this site lives in its own file with one job:

       footer-year.js     updateFooterYear()
       email-link.js      setupEmailLink()
       mobile-nav.js      setupMobileNav()
       scroll-reveal.js   setupScrollReveal()
       card-pointer.js    setupCardPointer()

   Those files only define functions. Nothing runs until this file
   calls it, which means there is exactly one place to look to see
   what the page does on load, and one place to change it.

   The <script> tags are plain, in load order, with no module
   system. That is deliberate: it works when the page is opened
   straight off the disk by double-clicking index.html, which ES
   modules do not, because the browser blocks them over file://.

   Each setup function checks for the elements it needs and returns
   quietly if they are missing, so pages without a given feature
   cost nothing.
   ============================================================ */

"use strict";


function init() {
    updateFooterYear();

    /* Before setupScrollReveal, on purpose. This reveals the email
       row, and the reveal observer should be watching a row that is
       already part of the layout. */
    setupEmailLink();

    setupMobileNav();
    setupScrollReveal();
    setupCardPointer();
}

/* The script tags sit at the bottom of the HTML, so every element
   above them already exists by the time this line runs. */
init();
