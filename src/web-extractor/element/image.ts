import { Element } from "@web-extractor/element/element";

export class Image extends Element {
  type = "image";

  private srcValue: string = "";

  setSrc(value: string) {
    this.srcValue = value;
  }

  get src() {
    return this.srcValue;
  }
}
