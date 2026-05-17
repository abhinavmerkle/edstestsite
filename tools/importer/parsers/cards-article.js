/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-article variant.
 * Base block: cards
 * Source: https://wknd-trendsetters.site
 * Selector: .grid-layout.desktop-4-column.grid-gap-md:has(.article-card)
 * Generated: 2026-05-17
 *
 * Source structure: Grid of article cards, each wrapped in an <a> tag with:
 *   - .article-card-image > img.cover-image
 *   - .article-card-body > .article-card-meta (tag + date) + h3.h4-heading
 *
 * Target structure (from library description):
 *   Row 1: block name (cards-article)
 *   Subsequent rows: col 1 = image, col 2 = text (tag, date, title, link)
 */
export default function parse(element, { document }) {
  const cards = element.querySelectorAll('a.article-card, a.card-link, .article-card');
  const cells = [];

  cards.forEach((card) => {
    // Column 1: Image
    const img = card.querySelector('.article-card-image img, img.cover-image, img');
    const imageCell = [];
    if (img) {
      imageCell.push(img);
    }

    // Column 2: Text content (tag, date, heading, link)
    const textCell = [];

    // Tag / category
    const tag = card.querySelector('.article-card-meta .tag, .tag');
    if (tag) {
      const tagEl = document.createElement('p');
      tagEl.textContent = tag.textContent.trim();
      textCell.push(tagEl);
    }

    // Date
    const date = card.querySelector('.article-card-meta .paragraph-sm, .article-card-meta span:not(.tag)');
    if (date) {
      const dateEl = document.createElement('p');
      dateEl.textContent = date.textContent.trim();
      textCell.push(dateEl);
    }

    // Heading / title
    const heading = card.querySelector('h3, h4, .h4-heading, [class*="heading"]');
    if (heading) {
      textCell.push(heading);
    }

    // Link / CTA - the card itself is typically the link
    const linkHref = card.tagName === 'A' ? card.href || card.getAttribute('href') : null;
    if (linkHref) {
      const link = document.createElement('a');
      link.href = linkHref;
      link.textContent = heading ? heading.textContent.trim() : 'Read more';
      textCell.push(link);
    }

    if (imageCell.length > 0 || textCell.length > 0) {
      cells.push([imageCell.length > 0 ? imageCell : '', textCell.length > 0 ? textCell : '']);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
