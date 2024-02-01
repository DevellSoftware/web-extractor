import { View } from "@web-extractor/view/view";
import { Button } from "@web-extractor/element/button";
import puppeteer, { Page } from "puppeteer";
import { Link } from "@web-extractor/element/link";
import { Image } from "@web-extractor/element/image";

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

  console.log(view.all);

  return view;
};
