/* eslint-disable */
/* global WebImporter */

/**
 * Parser for accordion-faq
 * Base block: accordion
 * Source selector: .faq-list
 * Source structure: details.faq-item > summary.faq-question > span (question),
 *                   details.faq-item > div.faq-answer > p (answer)
 * Target: 2-column table — col 1: question/title, col 2: answer/content
 * Generated: 2026-05-17
 */
export default function parse(element, { document }) {
  // Extract all FAQ items from the source element
  // Each details.faq-item contains a question (summary > span) and answer (div.faq-answer)
  const faqItems = element.querySelectorAll('details.faq-item, details');

  const cells = [];

  faqItems.forEach((item) => {
    // Extract question text from summary > span, falling back to summary text content
    const questionSpan = item.querySelector('summary.faq-question span, summary span');
    const summaryEl = item.querySelector('summary.faq-question, summary');

    // Extract answer content from div.faq-answer, preserving semantic HTML
    const answerDiv = item.querySelector('div.faq-answer, .faq-answer');

    // Build question cell - use the span element directly if available, otherwise summary text
    let questionCell;
    if (questionSpan) {
      questionCell = questionSpan;
    } else if (summaryEl) {
      questionCell = summaryEl;
    }

    // Build answer cell - use the answer div children to preserve paragraph structure
    let answerCell;
    if (answerDiv) {
      const answerChildren = Array.from(answerDiv.children);
      if (answerChildren.length === 1) {
        answerCell = answerChildren[0];
      } else if (answerChildren.length > 1) {
        answerCell = answerChildren;
      } else {
        // Fallback: use text content if no child elements
        answerCell = answerDiv.textContent.trim();
      }
    }

    // Only add row if we have both question and answer content
    if (questionCell && answerCell) {
      cells.push([questionCell, answerCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-faq', cells });
  element.replaceWith(block);
}
