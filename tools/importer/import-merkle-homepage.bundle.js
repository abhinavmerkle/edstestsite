/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-merkle-homepage.js
  var import_merkle_homepage_exports = {};
  __export(import_merkle_homepage_exports, {
    default: () => import_merkle_homepage_default
  });

  // tools/importer/parsers/carousel-hero.js
  function parse(element, { document }) {
    const slides = element.querySelectorAll(".cmp-carousel__item");
    const cells = [];
    slides.forEach((slide) => {
      const img = slide.querySelector("img.cmp-image__image");
      const contentCell = [];
      const pretitle = slide.querySelector(".cmp-teaser__pretitle");
      if (pretitle) {
        contentCell.push(pretitle);
      }
      const heading = slide.querySelector("h2.cmp-teaser__title");
      if (heading) {
        contentCell.push(heading);
      }
      const description = slide.querySelector(".cmp-teaser__description p");
      if (description) {
        contentCell.push(description);
      }
      const ctaLinks = slide.querySelectorAll(".cmp-teaser__action-container a.cmp-teaser__action-link");
      ctaLinks.forEach((link) => {
        contentCell.push(link);
      });
      if (img || contentCell.length > 0) {
        cells.push([img || "", contentCell.length > 0 ? contentCell : ""]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-news.js
  function parse2(element, { document }) {
    const cardItems = element.querySelectorAll("li.cmp-list__item, li");
    const cells = [];
    cardItems.forEach((item) => {
      const cardLink = item.querySelector('a.mer-clickabkle-wrapper, a[class*="clickab"], a');
      const cardContainer = item.querySelector(".mer-featured-card, .cmp-teaser, .featuredcard");
      const imageCell = [];
      const img = item.querySelector(".mer-fc-img_wrapper img, .cmp-teaser__image img, .cmp-image__image, img");
      if (img) {
        imageCell.push(img);
      }
      const textCell = [];
      const pretitle = item.querySelector('p.cmp-teaser__pretitle, [class*="pretitle"]');
      if (pretitle) {
        const categoryEl = document.createElement("p");
        categoryEl.textContent = pretitle.textContent.trim();
        textCell.push(categoryEl);
      }
      const heading = item.querySelector("h3.cmp-teaser__title, h3, h4") || item.querySelector(".cmp-teaser__title");
      if (heading && heading !== pretitle) {
        const headingEl = document.createElement("h3");
        headingEl.textContent = heading.textContent.trim();
        textCell.push(headingEl);
      }
      const linkHref = cardLink ? cardLink.href || cardLink.getAttribute("href") : null;
      if (linkHref) {
        const link = document.createElement("a");
        link.href = linkHref;
        const ctaText = item.querySelector('.mer-link-text, .mer-teaser__action-container span, [class*="link-text"]');
        link.textContent = ctaText ? ctaText.textContent.trim() : "Learn more";
        textCell.push(link);
      }
      if (imageCell.length > 0 || textCell.length > 0) {
        cells.push([imageCell.length > 0 ? imageCell : "", textCell.length > 0 ? textCell : ""]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-news", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-capability.js
  function parse3(element, { document }) {
    const cells = [];
    const imageContainers = element.querySelectorAll(":scope > .image");
    imageContainers.forEach((imageContainer) => {
      const img = imageContainer.querySelector("img.cmp-image__image, img");
      const textContainer = imageContainer.nextElementSibling;
      const contentCell = [];
      if (textContainer && textContainer.classList.contains("text")) {
        const heading = textContainer.querySelector('h6, h5, h4, [class*="title"]');
        const description = textContainer.querySelector("p");
        if (heading) contentCell.push(heading);
        if (description) contentCell.push(description);
      }
      if (img || contentCell.length > 0) {
        cells.push([img || "", contentCell.length > 0 ? contentCell : ""]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-capability", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/video-featured.js
  function parse4(element, { document }) {
    const sourceEl = element.querySelector('source.cmp-video-source, source[src*=".mp4"], video source');
    const videoSrc = sourceEl ? sourceEl.getAttribute("src") : null;
    const videoEl = element.querySelector("video.cmp-video__player__video, video");
    const videoDirectSrc = videoEl ? videoEl.getAttribute("src") : null;
    const finalVideoUrl = videoSrc || videoDirectSrc;
    const cells = [];
    if (finalVideoUrl) {
      const videoLink = document.createElement("a");
      videoLink.href = finalVideoUrl;
      videoLink.textContent = finalVideoUrl;
      cells.push([videoLink]);
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "video-featured", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-casestudy.js
  function parse5(element, { document }) {
    const cardItems = element.querySelectorAll("li.cmp-list__item, ul.mer-carousel-items > li");
    const cells = [];
    cardItems.forEach((item) => {
      const cardLink = item.querySelector('a.mer-clickabkle-wrapper, a[class*="clickab"], .cmp-teaser > a');
      const href = cardLink ? cardLink.href || cardLink.getAttribute("href") : null;
      const imageCell = [];
      const img = item.querySelector(".cmp-image__image, .mer-fc-img_wrapper img, .cmp-teaser__image img");
      if (img) {
        imageCell.push(img);
      }
      const textCell = [];
      const pretitle = item.querySelector("p.cmp-teaser__pretitle, .cmp-teaser__pretitle");
      if (pretitle) {
        const pretitleEl = document.createElement("p");
        pretitleEl.textContent = pretitle.textContent.trim();
        textCell.push(pretitleEl);
      }
      const heading = item.querySelector("h3.cmp-teaser__title, h3, .cmp-teaser__title");
      if (heading) {
        const h3 = document.createElement("h3");
        h3.textContent = heading.textContent.trim();
        textCell.push(h3);
      }
      const ctaText = item.querySelector(".mer-link-text, .mer-teaser__action-container span");
      if (href) {
        const link = document.createElement("a");
        link.href = href;
        link.textContent = ctaText ? ctaText.textContent.trim() : "Read case";
        textCell.push(link);
      }
      if (imageCell.length > 0 || textCell.length > 0) {
        cells.push([
          imageCell.length > 0 ? imageCell : "",
          textCell.length > 0 ? textCell : ""
        ]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-casestudy", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/merkle-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, ["#onetrust-consent-sdk"]);
      WebImporter.DOMUtils.remove(element, [".grecaptcha-badge"]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [".mer-header-space"]);
      WebImporter.DOMUtils.remove(element, ["header.experiencefragment"]);
      WebImporter.DOMUtils.remove(element, ["footer.experiencefragment"]);
      WebImporter.DOMUtils.remove(element, ["iframe"]);
      WebImporter.DOMUtils.remove(element, ["noscript"]);
      WebImporter.DOMUtils.remove(element, ["link"]);
    }
  }

  // tools/importer/transformers/merkle-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) return;
      const document = element.ownerDocument;
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetadata);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-merkle-homepage.js
  var parsers = {
    "carousel-hero": parse,
    "cards-news": parse2,
    "cards-capability": parse3,
    "video-featured": parse4,
    "carousel-casestudy": parse5
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "merkle-homepage",
    description: "Merkle corporate homepage with hero carousel, news cards, capability cards, video, and case study carousel",
    urls: ["https://www.merkle.com/"],
    blocks: [
      { name: "carousel-hero", instances: [".teasercarousel.carousel"] },
      { name: "cards-news", instances: [".teasergallerylist.mer-featured-tgl"] },
      { name: "cards-capability", instances: [".aem-Grid.aem-Grid--3"] },
      { name: "video-featured", instances: [".cmp-video"] },
      { name: "carousel-casestudy", instances: [".listcards.teasergallerylist.black-background"] }
    ],
    sections: [
      { id: "merkle-section-1", name: "Hero Carousel", selector: ".teasercarousel.carousel", style: null, blocks: ["carousel-hero"], defaultContent: [] },
      { id: "merkle-section-2", name: "Latest and Greatest", selector: ".teasergallerylist.mer-featured-tgl", style: null, blocks: ["cards-news"], defaultContent: [] },
      { id: "merkle-section-3", name: "Experience Economy", selector: ".container.responsivegrid:has(.aem-Grid--3)", style: "dark", blocks: ["cards-capability"], defaultContent: [] },
      { id: "merkle-section-4", name: "Partnering with Brands", selector: ".cmp-video", style: "dark", blocks: ["video-featured"], defaultContent: [] },
      { id: "merkle-section-5", name: "Our Work in Action", selector: ".listcards.teasergallerylist.black-background", style: "dark", blocks: ["carousel-casestudy"], defaultContent: [] }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_merkle_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath || "/merkle");
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_merkle_homepage_exports);
})();
