import { extract } from "@web-extractor/extract";
import { describe, it, expect } from "@jest/globals";

describe("Extract method", () => {
  it("should extract buttons", async () => {
    const view = await extract("https://devell.dev");

    expect(view.buttons.length).toBeGreaterThan(0);
  });
});
