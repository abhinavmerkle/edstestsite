/* eslint-disable */
/* global WebImporter */

/**
 * Parser for video-featured
 * Base block: video
 * Source: https://www.merkle.com/
 * Selector: .cmp-video
 * Generated: 2026-05-17
 *
 * Extracts the video MP4 source URL from the source HTML and produces
 * a single-row Video block with the video URL as a link.
 *
 * Source structure:
 *   .cmp-video
 *     .cmp-video__player
 *       video.cmp-video__player__video
 *         source.cmp-video-source[src="...mp4"]
 *       .cmp-video__player__controls
 *         img (poster/thumbnail)
 *         .cmp-video__player__controls__playbtn
 *     .cmp-video__caption
 */
export default function parse(element, { document }) {
  // Extract the video source URL from <source> element
  const sourceEl = element.querySelector('source.cmp-video-source, source[src*=".mp4"], video source');
  const videoSrc = sourceEl ? sourceEl.getAttribute('src') : null;

  // Fallback: check for a <video> element with a src attribute directly
  const videoEl = element.querySelector('video.cmp-video__player__video, video');
  const videoDirectSrc = videoEl ? videoEl.getAttribute('src') : null;

  const finalVideoUrl = videoSrc || videoDirectSrc;

  const cells = [];

  if (finalVideoUrl) {
    // Create an anchor link for the video URL (block expects a link)
    const videoLink = document.createElement('a');
    videoLink.href = finalVideoUrl;
    videoLink.textContent = finalVideoUrl;
    cells.push([videoLink]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'video-featured', cells });
  element.replaceWith(block);
}
