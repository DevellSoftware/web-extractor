import { Element } from "@web-extractor/element/element";

export class Button extends Element {
  type = "button";
  textValue: string;

  set text(text: string) {
    this.textValue = text;
  }

  get text() {
    return this.textValue;
  }
}
