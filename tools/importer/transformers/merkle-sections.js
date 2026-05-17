/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: merkle sections.
 * Inserts section breaks (<hr>) and Section Metadata blocks based on template sections.
 * Runs in afterTransform only. Processes sections in reverse order.
 * All selectors from page-templates.json (merkle-homepage template),
 * verified against captured DOM in migration-work/cleaned.html.
 *
 * Template sections (5 total, 4 <hr> expected, 3 Section Metadata expected):
 *   1. Hero Carousel       — selector: .teasercarousel.carousel                          — style: null
 *   2. Latest and Greatest — selector: .teasergallerylist.mer-featured-tgl               — style: null
 *   3. Experience Economy  — selector: .container.responsivegrid:has(.aem-Grid--3)       — style: dark
 *   4. Partnering w/ Brands — selector: .cmp-video                                       — style: dark
 *   5. Our Work in Action  — selector: .listcards.teasergallerylist.black-background     — style: dark
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { template } = payload;
    if (!template || !template.sections || template.sections.length < 2) return;

    const document = element.ownerDocument;
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
        sectionEl.after(sectionMetadata);
      }

      // Insert <hr> before section element (except for the first section)
      if (i > 0) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
