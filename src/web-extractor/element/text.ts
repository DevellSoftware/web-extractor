import { Element } from "@web-extractor/element/element";

export class TextElement extends Element {
  type = "text";
  textValue: string;

  constructor(text: string) {
    super();
    this.textValue = text;
  }

  get text() {
    return this.textValue;
  }
}
