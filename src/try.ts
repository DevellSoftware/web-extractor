import { extract } from "./web-extractor/extract";

const url = "https://en.wikipedia.org/wiki/AC/DC";

console.log("Trying to extract: " + url);

(async () => {
  const view = await extract(url);

  console.log(`FOUND ${view.all.length} ELEMENTS`);

  process.exit(0);
})();
