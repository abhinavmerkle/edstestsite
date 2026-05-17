/* eslint-disable */
/* global WebImporter */

/**
 * Parser for tabs-testimonial
 * Base block: tabs
 * Source: https://wknd-trendsetters.site
 * Selector: .tabs-wrapper
 *
 * Source structure:
 *   .tabs-wrapper > .tabs-content > .tab-pane (multiple)
 *     Each tab-pane contains: image, name (strong), role, quote paragraph
 *   .tabs-wrapper > .tab-menu > button.tab-menu-link (multiple)
 *     Each button contains: avatar image, name, role
 *
 * Target structure (tabs block):
 *   Row 1: block name
 *   Subsequent rows: col 1 = tab label, col 2 = tab content
 */
export default function parse(element, { document }) {
  // Extract tab panes (content panels)
  const tabPanes = element.querySelectorAll('.tab-pane');

  // Extract tab menu buttons (labels)
  const tabButtons = element.querySelectorAll('.tab-menu-link, .tab-menu button');

  const cells = [];

  // Build one row per tab: [label, content]
  tabPanes.forEach((pane, index) => {
    // --- Column 1: Tab label ---
    // Get the label from the corresponding tab button, fall back to name in pane
    let labelText = '';
    if (tabButtons[index]) {
      const labelStrong = tabButtons[index].querySelector('strong');
      if (labelStrong) {
        labelText = labelStrong.textContent.trim();
      } else {
        labelText = tabButtons[index].textContent.trim().split('\n')[0].trim();
      }
    }
    // Fallback: extract name from the pane itself
    if (!labelText) {
      const paneStrong = pane.querySelector('.paragraph-xl strong, strong');
      if (paneStrong) {
        labelText = paneStrong.textContent.trim();
      }
    }

    // --- Column 2: Tab content ---
    // Build content elements: image, name, role, testimonial quote
    const contentContainer = document.createElement('div');

    // Image
    const img = pane.querySelector('img.cover-image, img');
    if (img) {
      const imgClone = img.cloneNode(true);
      contentContainer.append(imgClone);
    }

    // Name (bold)
    const nameEl = pane.querySelector('.paragraph-xl strong, strong');
    if (nameEl) {
      const p = document.createElement('p');
      const strong = document.createElement('strong');
      strong.textContent = nameEl.textContent.trim();
      p.append(strong);
      contentContainer.append(p);
    }

    // Role/title (text after the name)
    const nameWrapper = pane.querySelector('.paragraph-xl.utility-margin-bottom-0');
    if (nameWrapper) {
      const roleEl = nameWrapper.parentElement
        ? nameWrapper.parentElement.querySelector('div:not(.paragraph-xl)')
        : null;
      if (roleEl && roleEl.textContent.trim()) {
        const roleP = document.createElement('p');
        roleP.textContent = roleEl.textContent.trim();
        contentContainer.append(roleP);
      }
    }

    // Testimonial quote
    const quote = pane.querySelector('p.paragraph-xl');
    if (quote) {
      const quoteP = document.createElement('p');
      quoteP.textContent = quote.textContent.trim();
      contentContainer.append(quoteP);
    }

    cells.push([labelText || `Tab ${index + 1}`, contentContainer]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'tabs-testimonial', cells });
  element.replaceWith(block);
}
