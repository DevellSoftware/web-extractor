import { Image } from "@web-extractor/element/image";
import { Page } from "puppeteer";

export const extractImages = async (page: Page): Promise<Image[]> => {
  const result: Image[] = [];

  const elements = await page.evaluate(() => {
    const result = Array.from(document.querySelectorAll("img"));

    return result.map((element) => {
      const { x, y, width, height } = element.getBoundingClientRect();

      return {
        x,
        y,
        width,
        height,
        text: element.innerHTML,
        src: element.getAttribute("src"),
      };
    });
  });

  elements.forEach((element) => {
    const image = new Image();

    image.setPosition(element.x, element.y);
    image.setSize(element.width, element.height);
    image.setSrc(element.src || "");

    result.push(image);
  });

  return result;
};
