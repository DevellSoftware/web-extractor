import { Element } from "@web-extractor/element/element";

export class View {
  private elements: Element[] = [];

  addElement(element: Element) {
    this.elements.push(element);
  }

  addElements(elements: Element[]) {
    this.elements.push(...elements);
  }

  get buttons() {
    return this.elements.filter((element) => element.type === "button");
  }

  get images() {
    return this.elements.filter((element) => element.type === "image");
  }

  get links() {
    return this.elements.filter((element) => element.type === "link");
  }

  get texts() {
    return this.elements.filter((element) => element.type === "text");
  }

  get sequences() {
    return this.elements.filter((element) => element.type === "sequence");
  }

  get all() {
    return this.elements;
  }
}
