/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-feature
 * Base block: columns
 * Source: https://wknd-trendsetters.site
 * Selector: section:has(.breadcrumbs) .grid-layout
 *
 * Source structure:
 *   .grid-layout (2 columns)
 *     Column 1: img.cover-image (featured image)
 *     Column 2: .breadcrumbs + h2 heading + author/date metadata
 *
 * Target: Columns block with 1 data row, 2 cells (image | text content)
 */
export default function parse(element, { document }) {
  // The grid-layout has direct child divs as columns
  const columns = element.querySelectorAll(':scope > div');

  // Column 1: Featured image
  const imageCol = columns[0];
  const image = imageCol ? imageCol.querySelector('img.cover-image, img[class*="cover"], img') : null;

  // Column 2: Text content (breadcrumbs, heading, author info)
  const textCol = columns[1];

  // Build cell content for each column
  const cell1Content = [];
  if (image) {
    cell1Content.push(image);
  }

  const cell2Content = [];
  if (textCol) {
    // Breadcrumbs
    const breadcrumbs = textCol.querySelector('.breadcrumbs');
    if (breadcrumbs) {
      cell2Content.push(breadcrumbs);
    }

    // Heading
    const heading = textCol.querySelector('h2, h1, h3, [class*="heading"]');
    if (heading) {
      cell2Content.push(heading);
    }

    // Author and date metadata divs (the remaining child divs after breadcrumbs and heading)
    const metaDivs = textCol.querySelectorAll(':scope > div:not(.breadcrumbs)');
    metaDivs.forEach((div) => {
      cell2Content.push(div);
    });
  }

  // Build cells: one row with two columns
  const cells = [
    [cell1Content.length ? cell1Content : '', cell2Content.length ? cell2Content : ''],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-feature', cells });
  element.replaceWith(block);
}
