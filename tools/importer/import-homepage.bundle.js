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

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-homepage.js
  function parse(element, { document }) {
    const heading = element.querySelector('h1, h2, .h1-heading, [class*="heading"]');
    const description = element.querySelector('p.subheading, p[class*="subheading"], .subheading');
    const ctaLinks = Array.from(
      element.querySelectorAll(".button-group a.button, .button-group a, a.button")
    );
    const images = Array.from(
      element.querySelectorAll('img.cover-image, img[class*="cover"], img')
    );
    const cells = [];
    if (images.length > 0) {
      cells.push([images]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    if (ctaLinks.length > 0) contentCell.push(...ctaLinks);
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-homepage", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-feature.js
  function parse2(element, { document }) {
    const columns = element.querySelectorAll(":scope > div");
    const imageCol = columns[0];
    const image = imageCol ? imageCol.querySelector('img.cover-image, img[class*="cover"], img') : null;
    const textCol = columns[1];
    const cell1Content = [];
    if (image) {
      cell1Content.push(image);
    }
    const cell2Content = [];
    if (textCol) {
      const breadcrumbs = textCol.querySelector(".breadcrumbs");
      if (breadcrumbs) {
        cell2Content.push(breadcrumbs);
      }
      const heading = textCol.querySelector('h2, h1, h3, [class*="heading"]');
      if (heading) {
        cell2Content.push(heading);
      }
      const metaDivs = textCol.querySelectorAll(":scope > div:not(.breadcrumbs)");
      metaDivs.forEach((div) => {
        cell2Content.push(div);
      });
    }
    const cells = [
      [cell1Content.length ? cell1Content : "", cell2Content.length ? cell2Content : ""]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-gallery.js
  function parse3(element, { document }) {
    const gridItems = Array.from(element.querySelectorAll(":scope > .utility-aspect-1x1, :scope > div"));
    const images = gridItems.map((item) => item.querySelector("img")).filter(Boolean);
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
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/tabs-testimonial.js
  function parse4(element, { document }) {
    const tabPanes = element.querySelectorAll(".tab-pane");
    const tabButtons = element.querySelectorAll(".tab-menu-link, .tab-menu button");
    const cells = [];
    tabPanes.forEach((pane, index) => {
      let labelText = "";
      if (tabButtons[index]) {
        const labelStrong = tabButtons[index].querySelector("strong");
        if (labelStrong) {
          labelText = labelStrong.textContent.trim();
        } else {
          labelText = tabButtons[index].textContent.trim().split("\n")[0].trim();
        }
      }
      if (!labelText) {
        const paneStrong = pane.querySelector(".paragraph-xl strong, strong");
        if (paneStrong) {
          labelText = paneStrong.textContent.trim();
        }
      }
      const contentContainer = document.createElement("div");
      const img = pane.querySelector("img.cover-image, img");
      if (img) {
        const imgClone = img.cloneNode(true);
        contentContainer.append(imgClone);
      }
      const nameEl = pane.querySelector(".paragraph-xl strong, strong");
      if (nameEl) {
        const p = document.createElement("p");
        const strong = document.createElement("strong");
        strong.textContent = nameEl.textContent.trim();
        p.append(strong);
        contentContainer.append(p);
      }
      const nameWrapper = pane.querySelector(".paragraph-xl.utility-margin-bottom-0");
      if (nameWrapper) {
        const roleEl = nameWrapper.parentElement ? nameWrapper.parentElement.querySelector("div:not(.paragraph-xl)") : null;
        if (roleEl && roleEl.textContent.trim()) {
          const roleP = document.createElement("p");
          roleP.textContent = roleEl.textContent.trim();
          contentContainer.append(roleP);
        }
      }
      const quote = pane.querySelector("p.paragraph-xl");
      if (quote) {
        const quoteP = document.createElement("p");
        quoteP.textContent = quote.textContent.trim();
        contentContainer.append(quoteP);
      }
      cells.push([labelText || `Tab ${index + 1}`, contentContainer]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "tabs-testimonial", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse5(element, { document }) {
    const cards = element.querySelectorAll("a.article-card, a.card-link, .article-card");
    const cells = [];
    cards.forEach((card) => {
      const img = card.querySelector(".article-card-image img, img.cover-image, img");
      const imageCell = [];
      if (img) {
        imageCell.push(img);
      }
      const textCell = [];
      const tag = card.querySelector(".article-card-meta .tag, .tag");
      if (tag) {
        const tagEl = document.createElement("p");
        tagEl.textContent = tag.textContent.trim();
        textCell.push(tagEl);
      }
      const date = card.querySelector(".article-card-meta .paragraph-sm, .article-card-meta span:not(.tag)");
      if (date) {
        const dateEl = document.createElement("p");
        dateEl.textContent = date.textContent.trim();
        textCell.push(dateEl);
      }
      const heading = card.querySelector('h3, h4, .h4-heading, [class*="heading"]');
      if (heading) {
        textCell.push(heading);
      }
      const linkHref = card.tagName === "A" ? card.href || card.getAttribute("href") : null;
      if (linkHref) {
        const link = document.createElement("a");
        link.href = linkHref;
        link.textContent = heading ? heading.textContent.trim() : "Read more";
        textCell.push(link);
      }
      if (imageCell.length > 0 || textCell.length > 0) {
        cells.push([imageCell.length > 0 ? imageCell : "", textCell.length > 0 ? textCell : ""]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-faq.js
  function parse6(element, { document }) {
    const faqItems = element.querySelectorAll("details.faq-item, details");
    const cells = [];
    faqItems.forEach((item) => {
      const questionSpan = item.querySelector("summary.faq-question span, summary span");
      const summaryEl = item.querySelector("summary.faq-question, summary");
      const answerDiv = item.querySelector("div.faq-answer, .faq-answer");
      let questionCell;
      if (questionSpan) {
        questionCell = questionSpan;
      } else if (summaryEl) {
        questionCell = summaryEl;
      }
      let answerCell;
      if (answerDiv) {
        const answerChildren = Array.from(answerDiv.children);
        if (answerChildren.length === 1) {
          answerCell = answerChildren[0];
        } else if (answerChildren.length > 1) {
          answerCell = answerChildren;
        } else {
          answerCell = answerDiv.textContent.trim();
        }
      }
      if (questionCell && answerCell) {
        cells.push([questionCell, answerCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "accordion-faq", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-banner.js
  function parse7(element, { document }) {
    const bgImage = element.querySelector('img.cover-image, img[class*="cover"], img[class*="background"]');
    const heading = element.querySelector('h2.h1-heading, h1, h2, [class*="heading"]');
    const subheading = element.querySelector('p.subheading, [class*="subheading"], .card-body > p');
    const ctaLinks = Array.from(element.querySelectorAll(".button-group a.button, .button-group a, a.button"));
    const uniqueCtas = [...new Set(ctaLinks)];
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentContainer = document.createElement("div");
    if (heading) contentContainer.append(heading);
    if (subheading) contentContainer.append(subheading);
    if (uniqueCtas.length > 0) uniqueCtas.forEach((cta) => contentContainer.append(cta));
    cells.push([contentContainer]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/wknd-trendsetters-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [".skip-link"]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [".navbar"]);
      WebImporter.DOMUtils.remove(element, ["footer.footer"]);
      WebImporter.DOMUtils.remove(element, [".breadcrumbs"]);
    }
  }

  // tools/importer/transformers/wknd-trendsetters-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) return;
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
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
          sectionEl.append(sectionMetadata);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-homepage": parse,
    "columns-feature": parse2,
    "columns-gallery": parse3,
    "tabs-testimonial": parse4,
    "cards-article": parse5,
    "accordion-faq": parse6,
    "hero-banner": parse7
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Fashion blog homepage with hero, featured article, photo gallery, testimonials, article cards, FAQ accordion, and CTA banner",
    urls: [
      "https://wknd-trendsetters.site"
    ],
    blocks: [
      {
        name: "hero-homepage",
        instances: ["header.section.secondary-section"]
      },
      {
        name: "columns-feature",
        instances: ["section:has(.breadcrumbs) .grid-layout"]
      },
      {
        name: "columns-gallery",
        instances: [".grid-layout.desktop-4-column.grid-gap-sm"]
      },
      {
        name: "tabs-testimonial",
        instances: [".tabs-wrapper"]
      },
      {
        name: "cards-article",
        instances: [".grid-layout.desktop-4-column.grid-gap-md:has(.article-card)"]
      },
      {
        name: "accordion-faq",
        instances: [".faq-list"]
      },
      {
        name: "hero-banner",
        instances: ["section.inverse-section"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero",
        selector: "header.section.secondary-section",
        style: "secondary",
        blocks: ["hero-homepage"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Featured Article",
        selector: "section:has(.breadcrumbs)",
        style: null,
        blocks: ["columns-feature"],
        defaultContent: []
      },
      {
        id: "section-3",
        name: "Photo Gallery",
        selector: "section:has(.utility-aspect-1x1)",
        style: "secondary",
        blocks: ["columns-gallery"],
        defaultContent: [
          "section:has(.utility-aspect-1x1) .utility-text-align-center h2",
          "section:has(.utility-aspect-1x1) .utility-text-align-center p"
        ]
      },
      {
        id: "section-4",
        name: "Testimonials",
        selector: "section:has(.tabs-wrapper)",
        style: null,
        blocks: ["tabs-testimonial"],
        defaultContent: []
      },
      {
        id: "section-5",
        name: "Latest Articles",
        selector: "section:has(.article-card)",
        style: "secondary",
        blocks: ["cards-article"],
        defaultContent: [
          "section:has(.article-card) .utility-text-align-center h2",
          "section:has(.article-card) .utility-text-align-center p"
        ]
      },
      {
        id: "section-6",
        name: "FAQ",
        selector: "section:has(.faq-list)",
        style: null,
        blocks: ["accordion-faq"],
        defaultContent: [
          "section:has(.faq-list) h2",
          "section:has(.faq-list) .subheading"
        ]
      },
      {
        id: "section-7",
        name: "CTA Banner",
        selector: "section.inverse-section",
        style: null,
        blocks: ["hero-banner"],
        defaultContent: []
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
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
  var import_homepage_default = {
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
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
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
  return __toCommonJS(import_homepage_exports);
})();
