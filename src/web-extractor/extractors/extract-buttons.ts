import { Page } from "puppeteer";
import { Button } from "@web-extractor/element/button";

export const extractButtons = async (page: Page): Promise<Button[]> => {
  const result: Button[] = [];

  interface ButtonElement {
    x: number;
    y: number;
    width: number;
    height: number;
    text: string;
  }

  const buttonElements = await page.evaluate(() => {
    const buttons = Array.from(
      document.querySelectorAll("button, a.button, div.button")
    );

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

  buttonElements.forEach((button: ButtonElement) => {
    const buttonElement = new Button();

    buttonElement.setSize(button.width, button.height);
    buttonElement.setPosition(button.x, button.y);
    buttonElement.text = button.text;

    result.push(buttonElement);
  });

  return result;
};
