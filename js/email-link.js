/* ============================================================
   email-link.js
   Builds the mailto link without publishing the address
   ------------------------------------------------------------
   One job per file. Loaded by every page before js/main.js,
   which is the only file that calls anything.
   ============================================================ */

"use strict";


/* ------------------------------------------------------------
   Email link

   The problem this solves: this repository is public, and the
   rendered page is public. An address written into either one as
   plain text gets collected by address harvesters, which are
   programs that crawl pages and repositories looking for anything
   shaped like name@domain and add what they find to spam lists.

   So the address is never written down in one piece. It is stored
   here as two reversed fragments with no "@" between them, and
   assembled at the moment the page loads. A harvester matching on
   the shape of an address finds nothing to match, because until
   this function runs there is no address anywhere in the file, and
   the page never displays it: the link reads "Send me an email".

   What this does NOT do, stated plainly: it is not encryption, and
   it is not a secret. Anyone who reads this file can see how the
   pieces go together, and any crawler that runs JavaScript gets the
   finished link like a normal visitor does. The aim is narrower
   than hiding the address, and worth being honest about: it defeats
   bulk automated collection, which is what actually generates spam,
   at zero cost to a real person trying to get in touch.

   The row is marked hidden in the HTML and revealed here, once the
   link actually works. Without JavaScript there is no way to build
   the address, so rather than leave a contact row that looks
   clickable and does nothing, the page simply offers GitHub and
   LinkedIn instead.
   ------------------------------------------------------------ */
function setupEmailLink() {
    // The anchor is marked in the HTML with data-email-link.
    var link = document.querySelector("[data-email-link]");

    // Defensive check. Only the home page has a contact section, so
    // on every other page there is nothing to do and we stop here.
    if (link === null) {
        return;
    }

    // The two halves, each written backwards. Neither is a valid
    // address, and there is no "@" anywhere in this file.
    var userReversed = "401eiznikcmnahte";
    var domainReversed = "moc.liamg";

    // split("") turns a string into an array of single characters,
    // reverse() flips the order of that array in place, and join("")
    // glues it back into a string. Three steps, because a JavaScript
    // string cannot be reversed directly.
    var user = userReversed.split("").reverse().join("");
    var domain = domainReversed.split("").reverse().join("");

    // String.fromCharCode(64) is the "@" character, built from its
    // code number so the symbol itself never appears in this file.
    // A harvester scanning the raw source has nothing to find.
    var address = user + String.fromCharCode(64) + domain;

    // Setting href on a real anchor, rather than handling a click,
    // is what keeps everything a link normally does working: tab to
    // it with a keyboard, open it with Enter, right-click to copy
    // the address, or middle-click it.
    link.setAttribute("href", "mailto:" + address);

    // Reveal the row now that the link leads somewhere. closest()
    // walks up from the anchor to the nearest matching ancestor,
    // which is the list item wrapping it.
    var row = link.closest("li");

    if (row !== null) {
        // Removing the attribute is what makes it visible again:
        // browsers style [hidden] as display: none by default, and
        // css/base.css restates that rule so a display value set
        // elsewhere cannot override it by accident.
        row.removeAttribute("hidden");
    }
}
