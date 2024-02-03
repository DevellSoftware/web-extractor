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
  }

  const candidatesSorted: Candidate[] = await page.evaluate(() => {
    const elements = Array.from(
      document.querySelectorAll("div > p, td > p, article, body > p")
    );

    elements.forEach((element) => {
      element.querySelectorAll("style").forEach((style) => {
        style.innerHTML = "";
      });
    });

    elements.forEach((element) => {
      element.querySelectorAll("script").forEach((script) => {
        script.innerHTML = "";
      });
    });

    const candidates: Candidate[] = [];

    for (const element of elements) {
      const parentsCount =
        element.parentElement?.querySelectorAll("*").length || 0;
      const textContent = element.textContent?.trim() || "";
      const textContentLength = textContent?.length || 0;

      if (textContentLength > 0) {
        candidates.push({
          parents: parentsCount,
          textLength: textContentLength,
          text: textContent.trim(),
          sentencesCount: textContent.split("\n").join(" ").split(".").length,
          x: element.getBoundingClientRect().x,
          y: element.getBoundingClientRect().y,
          width: element.getBoundingClientRect().width,
          height: element.getBoundingClientRect().height,
        });
      }
    }

    const totalPoints = (candidate: Candidate) => {
      return (
        candidate.sentencesCount * 100 -
        //candidate.textLength * 10 -
        candidate.parents * 30
      );
    };

    const candidatesSorted: Candidate[] = candidates.sort((a, b) => {
      return totalPoints(b) - totalPoints(a);
    });

    return candidatesSorted.slice(0, 10);
  });

  for (const candidate of candidatesSorted) {
    const textElement = new TextElement(candidate.text);
    textElement.setPosition(candidate.x, candidate.y);
    textElement.setSize(candidate.width, candidate.height);

    result.push(textElement);
  }

  return result;
};
