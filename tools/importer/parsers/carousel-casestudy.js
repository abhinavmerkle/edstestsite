/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-casestudy variant.
 * Base block: carousel
 * Source: https://www.merkle.com/
 * Selector: .listcards.teasergallerylist.black-background
 * Generated: 2026-05-17
 *
 * Source structure: Horizontal scrolling carousel of case study cards inside
 *   ul.mer-carousel-items > li.cmp-list__item, each containing:
 *   - a.mer-clickabkle-wrapper (card link)
 *     - p.cmp-teaser__pretitle (company name)
 *     - h3.cmp-teaser__title (case study title)
 *     - .mer-teaser__action-container > .mer-link-text (CTA text, e.g. "Read case")
 *     - .mer-fc-img_wrapper img.cmp-image__image (square image)
 *
 * Target structure (carousel block):
 *   Row 1: block name (carousel-casestudy)
 *   Subsequent rows: col 1 = image, col 2 = text (pretitle, heading, CTA link)
 *   Each row represents one carousel slide/card.
 */
export default function parse(element, { document }) {
  // Select all card items from the carousel list
  const cardItems = element.querySelectorAll('li.cmp-list__item, ul.mer-carousel-items > li');
  const cells = [];

  cardItems.forEach((item) => {
    // Find the wrapping link for this card
    const cardLink = item.querySelector('a.mer-clickabkle-wrapper, a[class*="clickab"], .cmp-teaser > a');
    const href = cardLink ? (cardLink.href || cardLink.getAttribute('href')) : null;

    // Column 1: Image
    const imageCell = [];
    const img = item.querySelector('.cmp-image__image, .mer-fc-img_wrapper img, .cmp-teaser__image img');
    if (img) {
      imageCell.push(img);
    }

    // Column 2: Text content (pretitle, heading, CTA link)
    const textCell = [];

    // Pretitle (company name)
    const pretitle = item.querySelector('p.cmp-teaser__pretitle, .cmp-teaser__pretitle');
    if (pretitle) {
      const pretitleEl = document.createElement('p');
      pretitleEl.textContent = pretitle.textContent.trim();
      textCell.push(pretitleEl);
    }

    // Heading (case study title)
    const heading = item.querySelector('h3.cmp-teaser__title, h3, .cmp-teaser__title');
    if (heading) {
      const h3 = document.createElement('h3');
      h3.textContent = heading.textContent.trim();
      textCell.push(h3);
    }

    // CTA link - use the card link href with the CTA text
    const ctaText = item.querySelector('.mer-link-text, .mer-teaser__action-container span');
    if (href) {
      const link = document.createElement('a');
      link.href = href;
      link.textContent = ctaText ? ctaText.textContent.trim() : 'Read case';
      textCell.push(link);
    }

    // Only add the row if we have content
    if (imageCell.length > 0 || textCell.length > 0) {
      cells.push([
        imageCell.length > 0 ? imageCell : '',
        textCell.length > 0 ? textCell : '',
      ]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-casestudy', cells });
  element.replaceWith(block);
}
