/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-gallery variant.
 * Base block: columns
 * Source selector: .grid-layout.desktop-4-column.grid-gap-sm
 * Extracts gallery images from a 4-column grid layout and arranges them
 * into a Columns block table with 4 cells per row.
 */
export default function parse(element, { document }) {
  // Extract all gallery images from the grid items
  const gridItems = Array.from(element.querySelectorAll(':scope > .utility-aspect-1x1, :scope > div'));
  const images = gridItems
    .map((item) => item.querySelector('img'))
    .filter(Boolean);

  // Build cells: 4 images per row to match the 4-column layout
  const columnsPerRow = 4;
  const cells = [];

  for (let i = 0; i < images.length; i += columnsPerRow) {
    const row = [];
    for (let j = 0; j < columnsPerRow; j++) {
      if (images[i + j]) {
        row.push(images[i + j]);
      }
    }
    if (row.length > 0) {
      cells.push(row);
    }
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-gallery', cells });
  element.replaceWith(block);
}
