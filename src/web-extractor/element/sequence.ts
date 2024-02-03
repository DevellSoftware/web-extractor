import { Element } from "@web-extractor/element/element";

export class Sequence extends Element {
  type = "sequence";

  private childrenValue: SequenceChild[] = [];

  addChild(child: SequenceChild) {
    this.childrenValue.push(child);
  }

  get children() {
    return this.childrenValue;
  }
}

export class SequenceChild extends Element {
  type = "sequence-child";

  private textValue: string = "";
  private tagNameValue: string = "";

  setText(value: string) {
    this.textValue = value;
  }

  setTagName(value: string) {
    this.tagNameValue = value;
  }

  get text() {
    return this.textValue;
  }

  get tagName() {
    return this.tagNameValue;
  }
}
