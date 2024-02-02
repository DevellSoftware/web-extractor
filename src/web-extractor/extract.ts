import { View } from "@web-extractor/view/view";
import { Button } from "@web-extractor/element/button";
import puppeteer, { Page } from "puppeteer";
import { Link } from "@web-extractor/element/link";
import { Image } from "@web-extractor/element/image";
import { TextElement } from "@web-extractor/element/text";

const extractTextElements = async (page: Page): Promise<TextElement[]> => {
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

const extractImages = async (page: Page): Promise<Image[]> => {
  const result: Image[] = [];

  const elements = await page.evaluate(() => {
    const result = Array.from(document.querySelectorAll("a"));

    return result.map((element) => {
      const { x, y, width, height } = element.getBoundingClientRect();

      return {
        x,
        y,
        width,
        height,
        text: element.innerHTML,
      };
    });
  });

  elements.forEach((element) => {
    const image = new Image();

    image.setPosition(element.x, element.y);
    image.setSize(element.width, element.height);

    result.push(image);
  });

  return result;
};

const extractLinks = async (page: Page): Promise<Link[]> => {
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

const extractButtons = async (page: Page): Promise<Button[]> => {
  const result: Button[] = [];

  const buttonElements = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));

    return buttons.map((button) => {
      const { x, y, width, height } = button.getBoundingClientRect();

      return {
        x,
        y,
        width,
        height,
        text: button.innerHTML,
      };
    });
  });

  buttonElements.forEach((button) => {
    const buttonElement = new Button();

    buttonElement.setSize(button.width, button.height);
    buttonElement.setPosition(button.x, button.y);
    buttonElement.text = button.text;

    result.push(buttonElement);
  });

  return result;
};

export const extract = async (url: string): Promise<View> => {
  const browser = await puppeteer.launch({
    headless: "new",
    ignoreDefaultArgs: [],
    timeout: 3000,
    dumpio: true,
    args: ["--disable-extentions"],
    executablePath: "/usr/bin/google-chrome-stable",
  });

  const page = await browser.newPage();

  await page.goto(url);

  page.on("console", (message: any) =>
    console.log(
      `${message.type().substr(0, 3).toUpperCase()} ${message.text()}`
    )
  );

  await page.evaluate(() => {
    console.log(document.title);
  });

  const view = new View();

  view.addElements(await extractButtons(page));
  view.addElements(await extractLinks(page));
  view.addElements(await extractImages(page));
  view.addElements(await extractTextElements(page));

  return view;
};
