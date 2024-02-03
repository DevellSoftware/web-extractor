import { View } from "@web-extractor/view/view";
import puppeteer, { Page } from "puppeteer";
import { extractButtons } from "@web-extractor/extractors/extract-buttons";
import { extractLinks } from "@web-extractor/extractors/extract-links";
import { extractImages } from "@web-extractor/extractors/extract-images";
import { extractTextElements } from "@web-extractor/extractors/extract-text-elements";
import { extractSequences } from "@web-extractor/extractors/extract-sequences";

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
  view.addElements(await extractSequences(page));

  return view;
};
