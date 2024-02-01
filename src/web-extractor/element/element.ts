export abstract class Element {
  abstract type: string;
  width: number;
  height: number;
  x: number;
  y: number;

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  setSize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
}
