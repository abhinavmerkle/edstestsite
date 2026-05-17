/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-banner
 * Base block: hero
 * Source selector: section.inverse-section
 * Generated: 2026-05-17
 *
 * Source structure:
 *   section.inverse-section > .container > .grid-layout > div
 *     img.cover-image (background image)
 *     .card-body
 *       h2.h1-heading (heading)
 *       p.subheading (subheading)
 *       .button-group > a.button (CTA)
 *
 * Target table (from block library):
 *   Row 1: block name header
 *   Row 2: background image (optional)
 *   Row 3: heading + subheading + CTA buttons
 */
export default function parse(element, { document }) {
  // Extract background image
  // Validated selector: img.cover-image exists in source HTML
  const bgImage = element.querySelector('img.cover-image, img[class*="cover"], img[class*="background"]');

  // Extract heading
  // Validated selector: h2.h1-heading exists in source HTML
  const heading = element.querySelector('h2.h1-heading, h1, h2, [class*="heading"]');

  // Extract subheading / description
  // Validated selector: p.subheading exists in source HTML
  const subheading = element.querySelector('p.subheading, [class*="subheading"], .card-body > p');

  // Extract CTA buttons
  // Validated selector: .button-group > a.button exists in source HTML
  const ctaLinks = Array.from(element.querySelectorAll('.button-group a.button, .button-group a, a.button'));
  // Deduplicate in case selectors overlap
  const uniqueCtas = [...new Set(ctaLinks)];

  // Build cells to match block library structure:
  // Row 1 (optional): background image
  // Row 2: heading + subheading + CTA buttons
  const cells = [];

  // Row for background image (optional - only add if present)
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row for content: heading + subheading + CTA buttons combined in one cell
  // Wrap all content in a single container div so createBlock treats it as one cell
  const contentContainer = document.createElement('div');
  if (heading) contentContainer.append(heading);
  if (subheading) contentContainer.append(subheading);
  if (uniqueCtas.length > 0) uniqueCtas.forEach((cta) => contentContainer.append(cta));
  cells.push([contentContainer]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
