import { extract } from "./web-extractor/extract";
console.log("Hello world!");

(async () => {
  await extract("https://wikipedia.org");
  console.log("Extracted!");
})();
