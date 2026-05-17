/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: merkle cleanup.
 * Removes non-authorable site chrome, cookie consent, and widgets from merkle.com pages.
 * All selectors verified against captured DOM in migration-work/cleaned.html.
 *
 * Non-authorable elements removed:
 *   - OneTrust cookie consent SDK (#onetrust-consent-sdk, line 1150)
 *   - Google reCAPTCHA badge (.grecaptcha-badge, line 1137)
 *   - Header spacer div (.mer-header-space, line 2)
 *   - Site header with navigation (header.experiencefragment, line 9)
 *   - Site footer (footer.experiencefragment, line 1010)
 *   - Stray iframes, noscript, link elements
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove OneTrust cookie consent SDK (blocks page interaction / parsing)
    // Found in captured HTML: <div id="onetrust-consent-sdk"> (line 1150)
    WebImporter.DOMUtils.remove(element, ['#onetrust-consent-sdk']);

    // Remove Google reCAPTCHA badge (non-authorable widget)
    // Found in captured HTML: <div class="grecaptcha-badge"> (line 1137)
    WebImporter.DOMUtils.remove(element, ['.grecaptcha-badge']);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove header spacer div (non-authorable layout chrome)
    // Found in captured HTML: <div class="mer-header-space"> (line 2)
    WebImporter.DOMUtils.remove(element, ['.mer-header-space']);

    // Remove site header with navigation (experience fragment)
    // Found in captured HTML: <header class="experiencefragment ..."> (line 9)
    WebImporter.DOMUtils.remove(element, ['header.experiencefragment']);

    // Remove site footer (experience fragment)
    // Found in captured HTML: <footer class="experiencefragment ..."> (line 1010)
    WebImporter.DOMUtils.remove(element, ['footer.experiencefragment']);

    // Remove stray iframes (reCAPTCHA, tracking pixels, etc.)
    // Found in captured HTML: <iframe> elements (lines 1139, 1147, 1410)
    WebImporter.DOMUtils.remove(element, ['iframe']);

    // Remove noscript elements (tracking fallbacks)
    WebImporter.DOMUtils.remove(element, ['noscript']);

    // Remove link elements (stylesheets, preloads — not authorable)
    WebImporter.DOMUtils.remove(element, ['link']);
  }
}
