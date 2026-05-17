/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-news variant.
 * Base block: cards
 * Source: https://www.merkle.com/
 * Selector: .teasergallerylist.mer-featured-tgl
 * Generated: 2026-05-17
 *
 * Source structure: Grid of news/press featured cards in a <ul> list.
 *   Each <li> contains a .featuredcard > .mer-featured-card.cmp-teaser
 *   wrapped in an <a> tag with:
 *     - .mer-fc-txt_wrapper > p.cmp-teaser__pretitle (category tag)
 *     - .mer-fc-txt_wrapper > h3.cmp-teaser__title (heading)
 *     - .mer-fc-txt_wrapper > .mer-teaser__action-container (CTA text)
 *     - .mer-fc-img_wrapper > .cmp-teaser__image > img (card image)
 *
 * Target structure (Cards block):
 *   Row per card: col 1 = image, col 2 = text (category, title, link)
 */
export default function parse(element, { document }) {
  const cardItems = element.querySelectorAll('li.cmp-list__item, li');
  const cells = [];

  cardItems.forEach((item) => {
    // Find the wrapping link for the card
    const cardLink = item.querySelector('a.mer-clickabkle-wrapper, a[class*="clickab"], a');
    const cardContainer = item.querySelector('.mer-featured-card, .cmp-teaser, .featuredcard');

    // Column 1: Image
    const imageCell = [];
    const img = item.querySelector('.mer-fc-img_wrapper img, .cmp-teaser__image img, .cmp-image__image, img');
    if (img) {
      imageCell.push(img);
    }

    // Column 2: Text content (category, heading, link)
    const textCell = [];

    // Category / pretitle (e.g. "Press Release", "Event Recap", "Ebook")
    const pretitle = item.querySelector('p.cmp-teaser__pretitle, [class*="pretitle"]');
    if (pretitle) {
      const categoryEl = document.createElement('p');
      categoryEl.textContent = pretitle.textContent.trim();
      textCell.push(categoryEl);
    }

    // Heading / title - use h3 first, then class-based selectors excluding pretitle
    const heading = item.querySelector('h3.cmp-teaser__title, h3, h4')
      || item.querySelector('.cmp-teaser__title');
    if (heading && heading !== pretitle) {
      const headingEl = document.createElement('h3');
      headingEl.textContent = heading.textContent.trim();
      textCell.push(headingEl);
    }

    // Link / CTA - derive href from wrapping <a> tag
    const linkHref = cardLink ? (cardLink.href || cardLink.getAttribute('href')) : null;
    if (linkHref) {
      const link = document.createElement('a');
      link.href = linkHref;
      // Use the CTA text if available, otherwise fall back to "Learn more"
      const ctaText = item.querySelector('.mer-link-text, .mer-teaser__action-container span, [class*="link-text"]');
      link.textContent = ctaText ? ctaText.textContent.trim() : 'Learn more';
      textCell.push(link);
    }

    // Only add the row if we have meaningful content
    if (imageCell.length > 0 || textCell.length > 0) {
      cells.push([imageCell.length > 0 ? imageCell : '', textCell.length > 0 ? textCell : '']);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-news', cells });
  element.replaceWith(block);
}
