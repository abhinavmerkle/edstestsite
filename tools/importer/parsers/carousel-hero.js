/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-hero
 * Base block: carousel
 * Source: https://www.merkle.com/
 * Generated: 2026-05-17
 *
 * Extracts a hero carousel with multiple slides. Each slide has:
 *   - Image (column 1)
 *   - Text content: optional eyebrow, H2 heading, optional description, optional CTA links (column 2)
 *
 * Source selectors validated against migration-work/block-context/carousel-hero/source.html
 */
export default function parse(element, { document }) {
  // Find all carousel slide items
  const slides = element.querySelectorAll('.cmp-carousel__item');

  const cells = [];

  slides.forEach((slide) => {
    // Column 1: Image
    const img = slide.querySelector('img.cmp-image__image');

    // Column 2: Text content
    const contentCell = [];

    // Optional eyebrow/pretitle
    const pretitle = slide.querySelector('.cmp-teaser__pretitle');
    if (pretitle) {
      contentCell.push(pretitle);
    }

    // Heading (h2)
    const heading = slide.querySelector('h2.cmp-teaser__title');
    if (heading) {
      contentCell.push(heading);
    }

    // Optional description
    const description = slide.querySelector('.cmp-teaser__description p');
    if (description) {
      contentCell.push(description);
    }

    // CTA links
    const ctaLinks = slide.querySelectorAll('.cmp-teaser__action-container a.cmp-teaser__action-link');
    ctaLinks.forEach((link) => {
      contentCell.push(link);
    });

    // Only add a row if we have an image or content
    if (img || contentCell.length > 0) {
      cells.push([img || '', contentCell.length > 0 ? contentCell : '']);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-hero', cells });
  element.replaceWith(block);
}
