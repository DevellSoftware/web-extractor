import { TextElement } from "@web-extractor/element/text";
import { Page } from "puppeteer";

export const extractTextElements = async (
  page: Page
): Promise<TextElement[]> => {
  const result: TextElement[] = [];

  interface Candidate {
    parents: number;
    textLength: number;
    text: string;
    sentencesCount: number;
    x: number;
    y: number;
    width: number;
    height: number;
    linesCount: number;
    title?: string;
  }

  const candidates: Candidate[] = await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll("p"));
    const candidates: Candidate[] = [];

    for (const element of elements) {
      const systemTags = element.querySelectorAll("script, style");

      for (const systemTag of systemTags) {
        systemTag.innerHTML = "";
      }

      let articleElement = element;

      const parentsCount =
        articleElement.parentElement?.querySelectorAll("*").length || 0;
      let textContent =
        articleElement.textContent?.trim().replaceAll(/\s\s+/g, " ") || "";

      const textContentLength = textContent?.length || 0;
      const lines = textContent.split("\n").length;

      let title = "";
      let sibling: Element | null = articleElement;
      let limit = 3;

      while ((sibling = sibling.previousElementSibling) && limit-- > 0) {
        if (["H1", "H2", "H3", "H4"].includes(sibling.nodeName)) {
          title = sibling.textContent ?? "";

          textContent = title + "\n\n" + textContent;
          break;
        }
      }

      if (textContent.length > 255 && textContent.split(".").length > 3) {
        candidates.push({
          parents: parentsCount,
          textLength: textContentLength,
          text: textContent.trim(),
          sentencesCount: textContent.split("\n").join(" ").split(".").length,
          x: articleElement.getBoundingClientRect().x,
          y: articleElement.getBoundingClientRect().y,
          width: articleElement.getBoundingClientRect().width,
          height: articleElement.getBoundingClientRect().height,
          linesCount: lines,
          title: title.length > 0 ? title : undefined,
        });
      }
    }

    return candidates;
  });

  const candidatesWithTitle = candidates.filter((candidate) => candidate.title);

  const candidatesWithoutTitle = candidates.filter(
    (candidate) => candidate.title == undefined
  );

  let selected: Candidate[] = [];

  selected.push(...candidatesWithTitle);
  for (const candidate of candidatesWithTitle) {
  }

  if (selected.length < candidatesWithoutTitle.length) {
    selected.push(...candidatesWithoutTitle);
  }

  for (const candidate of selected) {
    const textElement = new TextElement(candidate.text);
    textElement.setPosition(candidate.x, candidate.y);
    textElement.setSize(candidate.width, candidate.height);

    result.push(textElement);
  }

  return result;
};
