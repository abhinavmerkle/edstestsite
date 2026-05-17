/* eslint-disable */
/* global WebImporter */

import carouselHeroParser from './parsers/carousel-hero.js';
import cardsNewsParser from './parsers/cards-news.js';
import cardsCapabilityParser from './parsers/cards-capability.js';
import videoFeaturedParser from './parsers/video-featured.js';
import carouselCasestudyParser from './parsers/carousel-casestudy.js';

import cleanupTransformer from './transformers/merkle-cleanup.js';
import sectionsTransformer from './transformers/merkle-sections.js';

const parsers = {
  'carousel-hero': carouselHeroParser,
  'cards-news': cardsNewsParser,
  'cards-capability': cardsCapabilityParser,
  'video-featured': videoFeaturedParser,
  'carousel-casestudy': carouselCasestudyParser,
};

const transformers = [
  cleanupTransformer,
  sectionsTransformer,
];

const PAGE_TEMPLATE = {
  name: 'merkle-homepage',
  description: 'Merkle corporate homepage with hero carousel, news cards, capability cards, video, and case study carousel',
  urls: ['https://www.merkle.com/'],
  blocks: [
    { name: 'carousel-hero', instances: ['.teasercarousel.carousel'] },
    { name: 'cards-news', instances: ['.teasergallerylist.mer-featured-tgl'] },
    { name: 'cards-capability', instances: ['.aem-Grid.aem-Grid--3'] },
    { name: 'video-featured', instances: ['.cmp-video'] },
    { name: 'carousel-casestudy', instances: ['.listcards.teasergallerylist.black-background'] },
  ],
  sections: [
    { id: 'merkle-section-1', name: 'Hero Carousel', selector: '.teasercarousel.carousel', style: null, blocks: ['carousel-hero'], defaultContent: [] },
    { id: 'merkle-section-2', name: 'Latest and Greatest', selector: '.teasergallerylist.mer-featured-tgl', style: null, blocks: ['cards-news'], defaultContent: [] },
    { id: 'merkle-section-3', name: 'Experience Economy', selector: '.container.responsivegrid:has(.aem-Grid--3)', style: 'dark', blocks: ['cards-capability'], defaultContent: [] },
    { id: 'merkle-section-4', name: 'Partnering with Brands', selector: '.cmp-video', style: 'dark', blocks: ['video-featured'], defaultContent: [] },
    { id: 'merkle-section-5', name: 'Our Work in Action', selector: '.listcards.teasergallerylist.black-background', style: 'dark', blocks: ['carousel-casestudy'], defaultContent: [] },
  ],
};

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
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

    const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath || '/merkle');

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
