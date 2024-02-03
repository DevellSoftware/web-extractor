import { extract } from "@web-extractor/extract";
import { describe, it, expect } from "@jest/globals";
import { Sequence, SequenceChild } from "@web-extractor/element/sequence";

describe("Extract method", () => {
  it("should extract buttons", async () => {
    const view = await extract("https://www.w3.org/standards/");

    expect(view.buttons.length).toBeGreaterThan(0);
  });

  it("should find sequences", async () => {
    const view = await extract("https://www.w3.org/standards/");

    expect(view.sequences.length).toBeGreaterThan(0);

    let previousElement: SequenceChild | undefined;

    for (const sequence of view.sequences as Sequence[]) {
      previousElement = undefined;

      for (const element of sequence.children) {
        if (previousElement) {
          expect(element.tagName).toBe(previousElement.tagName);
        }

        previousElement = element;
      }
    }
  });
});
