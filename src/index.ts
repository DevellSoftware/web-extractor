import { extract } from "./web-extractor/extract";
console.log("Hello world!");

(async () => {
  await extract("https://devell.dev");
  console.log("Extracted!");
})();
