import { Sequence, SequenceChild } from "@web-extractor/element/sequence";
import { Page } from "puppeteer";

export const extractSequences = async (page: Page): Promise<Sequence[]> => {
  const result: Sequence[] = [];

  const elements = await page.evaluate(() => {
    const elements = Array.from(
      document.querySelectorAll("div > *, ul > li, ol > li, table > tbody > tr")
    );

    const filteredElements = elements
      .filter((element) => {
        const children = element?.parentElement?.querySelectorAll(
          element.tagName
        );

        if (children == undefined) {
          return false;
        }

        return children.length >= 3;
      })
      .filter((element) => {
        const parent = element.parentElement;

        const children = parent?.querySelectorAll(element.tagName);

        if (children == undefined) {
          return false;
        }

        for (const child of children) {
          for (const grandchildIndex in child.children) {
            if (element.children[grandchildIndex] == undefined) {
              return false;
            }

            if (
              child.children[grandchildIndex].tagName !==
              element.children[grandchildIndex].tagName
            ) {
              return false;
            }
          }
        }

        return true;
      });

    interface ResultElement {
      x: number;
      y: number;
      width: number;
      height: number;
      children: Child[];
    }

    interface Child {
      x: number;
      y: number;
      width: number;
      height: number;
      text: string;
      tagName: string;
    }

    return filteredElements.map((element) => {
      const { x, y, width, height } = element.getBoundingClientRect();

      const result: ResultElement = {
        x,
        y,
        width,
        height,
        children: [],
      };

      if (element.parentNode != undefined) {
        result.children = Array.from(element.parentNode.children).map(
          (child) => {
            return {
              x: child.getBoundingClientRect().x,
              y: child.getBoundingClientRect().y,
              width: child.getBoundingClientRect().width,
              height: child.getBoundingClientRect().height,
              text: child.innerHTML,
              tagName: child.tagName,
            };
          }
        );
      }

      return result;
    });
  });

  elements.forEach((element) => {
    const sequence = new Sequence();

    sequence.setPosition(element.x, element.y);
    sequence.setSize(element.width, element.height);

    let prevoiusTagName = element.children[0].tagName;

    element.children.forEach((child) => {
      if (prevoiusTagName !== child.tagName) {
        return;
      }

      const sequenceChild = new SequenceChild();
      sequenceChild.setPosition(child.x, child.y);
      sequenceChild.setSize(child.width, child.height);
      sequenceChild.setText(child.text);
      sequenceChild.setTagName(child.tagName);

      sequence.addChild(sequenceChild);

      prevoiusTagName = child.tagName;
    });

    result.push(sequence);
  });

  return result;
};
