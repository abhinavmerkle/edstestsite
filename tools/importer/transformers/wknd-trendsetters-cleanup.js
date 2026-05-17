/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: wknd-trendsetters cleanup.
 * Removes non-authorable site chrome and widgets.
 * All selectors verified against captured DOM in migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove skip-to-content link (non-authorable accessibility chrome)
    // Found in captured HTML: <a href="#main-content" class="skip-link">
    WebImporter.DOMUtils.remove(element, ['.skip-link']);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove site navigation bar
    // Found in captured HTML: <div class="navbar">
    WebImporter.DOMUtils.remove(element, ['.navbar']);

    // Remove site footer
    // Found in captured HTML: <footer class="footer inverse-footer">
    WebImporter.DOMUtils.remove(element, ['footer.footer']);

    // Remove breadcrumb navigation (non-authorable, within Featured Article section)
    // Found in captured HTML: <div class="breadcrumbs">
    WebImporter.DOMUtils.remove(element, ['.breadcrumbs']);
  }
}
