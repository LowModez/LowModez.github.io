/* ============================================================
   main.js
   The single entry point for every page
   ------------------------------------------------------------
   Each behavior on this site lives in its own file with one job:

       footer-year.js     updateFooterYear()
       mobile-nav.js      setupMobileNav()
       scroll-reveal.js   setupScrollReveal()

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
    setupMobileNav();
    setupScrollReveal();
}

/* The script tags sit at the bottom of the HTML, so every element
   above them already exists by the time this line runs. */
init();
