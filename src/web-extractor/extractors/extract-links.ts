import { Page } from "puppeteer";
import { Link } from "@web-extractor/element/link";

export const extractLinks = async (page: Page): Promise<Link[]> => {
  const result: Link[] = [];

  const elements = await page.evaluate(() => {
    const result = Array.from(document.querySelectorAll("a"));

    return result.map((element) => {
      const { x, y } = element.getBoundingClientRect();

      return {
        x,
        y,
        text: element.innerHTML,
      };
    });
  });

  elements.forEach((element) => {
    const link = new Link();

    link.setPosition(element.x, element.y);
    link.text = element.text;

    result.push(link);
  });

  return result;
};
