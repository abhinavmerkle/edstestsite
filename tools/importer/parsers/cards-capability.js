/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-capability
 * Base block: cards
 * Source: https://www.merkle.com/
 * Generated: 2026-05-17
 *
 * Extracts capability cards from the Merkle homepage.
 * Each card has an icon/shape image, an H6 heading, and a description paragraph.
 * Source structure: .aem-Grid.aem-Grid--3 container with alternating .image and .text sibling divs.
 * Target: Cards block with 2 columns per row — col 1 = image, col 2 = heading + description.
 */
export default function parse(element, { document }) {
  const cells = [];

  // Get all image containers (each represents one card's icon)
  const imageContainers = element.querySelectorAll(':scope > .image');

  imageContainers.forEach((imageContainer) => {
    // Column 1: Extract the icon image
    const img = imageContainer.querySelector('img.cmp-image__image, img');

    // Column 2: The text container is the next sibling .text div
    const textContainer = imageContainer.nextElementSibling;

    const contentCell = [];

    if (textContainer && textContainer.classList.contains('text')) {
      const heading = textContainer.querySelector('h6, h5, h4, [class*="title"]');
      const description = textContainer.querySelector('p');

      if (heading) contentCell.push(heading);
      if (description) contentCell.push(description);
    }

    // Build the row: [image cell, content cell]
    if (img || contentCell.length > 0) {
      cells.push([img || '', contentCell.length > 0 ? contentCell : '']);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-capability', cells });
  element.replaceWith(block);
}
