import { Element } from "@web-extractor/element/element";

export class Link extends Element {
  type = "link";
  textValue: string;

  set text(text: string) {
    this.textValue = text;
  }

  get text() {
    return this.textValue;
  }
}
