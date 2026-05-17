/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: wknd-trendsetters sections.
 * Inserts section breaks (<hr>) and Section Metadata blocks based on template sections.
 * Runs in afterTransform only. Processes sections in reverse order.
 * All selectors from page-templates.json, verified against captured DOM in migration-work/cleaned.html.
 *
 * Template sections (7 total, 6 <hr> expected, 3 Section Metadata expected):
 *   1. Hero           — selector: header.section.secondary-section — style: secondary
 *   2. Featured Article — selector: section:has(.breadcrumbs)      — style: null
 *   3. Photo Gallery  — selector: section:has(.utility-aspect-1x1) — style: secondary
 *   4. Testimonials   — selector: section:has(.tabs-wrapper)       — style: null
 *   5. Latest Articles — selector: section:has(.article-card)      — style: secondary
 *   6. FAQ            — selector: section:has(.faq-list)           — style: null
 *   7. CTA Banner     — selector: section.inverse-section          — style: null
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { template } = payload;
    if (!template || !template.sections || template.sections.length < 2) return;

    const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
    const sections = template.sections;

    // Process sections in reverse order to preserve DOM positions
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const sectionEl = element.querySelector(section.selector);
      if (!sectionEl) continue;

      // Add Section Metadata block if section has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.append(sectionMetadata);
      }

      // Insert <hr> before section element (except for the first section)
      if (i > 0) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
