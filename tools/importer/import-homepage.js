/* eslint-disable */
/* global WebImporter */

import heroHomepageParser from './parsers/hero-homepage.js';
import columnsFeatureParser from './parsers/columns-feature.js';
import columnsGalleryParser from './parsers/columns-gallery.js';
import tabsTestimonialParser from './parsers/tabs-testimonial.js';
import cardsArticleParser from './parsers/cards-article.js';
import accordionFaqParser from './parsers/accordion-faq.js';
import heroBannerParser from './parsers/hero-banner.js';

import cleanupTransformer from './transformers/wknd-trendsetters-cleanup.js';
import sectionsTransformer from './transformers/wknd-trendsetters-sections.js';

const parsers = {
  'hero-homepage': heroHomepageParser,
  'columns-feature': columnsFeatureParser,
  'columns-gallery': columnsGalleryParser,
  'tabs-testimonial': tabsTestimonialParser,
  'cards-article': cardsArticleParser,
  'accordion-faq': accordionFaqParser,
  'hero-banner': heroBannerParser,
};

const transformers = [
  cleanupTransformer,
  sectionsTransformer,
];

const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Fashion blog homepage with hero, featured article, photo gallery, testimonials, article cards, FAQ accordion, and CTA banner',
  urls: [
    'https://wknd-trendsetters.site',
  ],
  blocks: [
    {
      name: 'hero-homepage',
      instances: ['header.section.secondary-section'],
    },
    {
      name: 'columns-feature',
      instances: ['section:has(.breadcrumbs) .grid-layout'],
    },
    {
      name: 'columns-gallery',
      instances: ['.grid-layout.desktop-4-column.grid-gap-sm'],
    },
    {
      name: 'tabs-testimonial',
      instances: ['.tabs-wrapper'],
    },
    {
      name: 'cards-article',
      instances: ['.grid-layout.desktop-4-column.grid-gap-md:has(.article-card)'],
    },
    {
      name: 'accordion-faq',
      instances: ['.faq-list'],
    },
    {
      name: 'hero-banner',
      instances: ['section.inverse-section'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero',
      selector: 'header.section.secondary-section',
      style: 'secondary',
      blocks: ['hero-homepage'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Featured Article',
      selector: 'section:has(.breadcrumbs)',
      style: null,
      blocks: ['columns-feature'],
      defaultContent: [],
    },
    {
      id: 'section-3',
      name: 'Photo Gallery',
      selector: 'section:has(.utility-aspect-1x1)',
      style: 'secondary',
      blocks: ['columns-gallery'],
      defaultContent: [
        'section:has(.utility-aspect-1x1) .utility-text-align-center h2',
        'section:has(.utility-aspect-1x1) .utility-text-align-center p',
      ],
    },
    {
      id: 'section-4',
      name: 'Testimonials',
      selector: 'section:has(.tabs-wrapper)',
      style: null,
      blocks: ['tabs-testimonial'],
      defaultContent: [],
    },
    {
      id: 'section-5',
      name: 'Latest Articles',
      selector: 'section:has(.article-card)',
      style: 'secondary',
      blocks: ['cards-article'],
      defaultContent: [
        'section:has(.article-card) .utility-text-align-center h2',
        'section:has(.article-card) .utility-text-align-center p',
      ],
    },
    {
      id: 'section-6',
      name: 'FAQ',
      selector: 'section:has(.faq-list)',
      style: null,
      blocks: ['accordion-faq'],
      defaultContent: [
        'section:has(.faq-list) h2',
        'section:has(.faq-list) .subheading',
      ],
    },
    {
      id: 'section-7',
      name: 'CTA Banner',
      selector: 'section.inverse-section',
      style: null,
      blocks: ['hero-banner'],
      defaultContent: [],
    },
  ],
};

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    executeTransformers('beforeTransform', main, payload);

    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    executeTransformers('afterTransform', main, payload);

    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
