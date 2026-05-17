/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-homepage
 * Base block: hero
 * Source selector: header.section.secondary-section
 * Generated: 2026-05-17
 *
 * Source structure:
 *   header.section.secondary-section
 *     .container > .grid-layout
 *       div (content): h1.h1-heading, p.subheading, .button-group > a.button
 *       div (images): img.cover-image (multiple)
 *
 * Target table (1 column):
 *   Row 1: block name (auto)
 *   Row 2: images (optional)
 *   Row 3: heading + subheading + CTA buttons
 */
export default function parse(element, { document }) {
  // Extract heading - validated against source: h1.h1-heading
  const heading = element.querySelector('h1, h2, .h1-heading, [class*="heading"]');

  // Extract subheading - validated against source: p.subheading
  const description = element.querySelector('p.subheading, p[class*="subheading"], .subheading');

  // Extract CTA buttons - validated against source: .button-group > a.button
  const ctaLinks = Array.from(
    element.querySelectorAll('.button-group a.button, .button-group a, a.button')
  );

  // Extract images - validated against source: img.cover-image (multiple)
  const images = Array.from(
    element.querySelectorAll('img.cover-image, img[class*="cover"], img')
  );

  const cells = [];

  // Row 2 (optional): images - present in source as multiple cover images
  if (images.length > 0) {
    cells.push([images]);
  }

  // Row 3: heading + subheading + CTA buttons in a single cell
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  if (ctaLinks.length > 0) contentCell.push(...ctaLinks);
  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-homepage', cells });
  element.replaceWith(block);
}
