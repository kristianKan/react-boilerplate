import { makeAutoObservable } from "mobx";

export class Rectangle {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(id: number, x: number, y: number, width: number, height: number) {
    makeAutoObservable(this);
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}

export class RectangleStore {
  rectangles: Rectangle[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  addRectangle(x: number, y: number, width: number, height: number) {
    const id = Math.random() * 1000000;
    const rectangle = new Rectangle(id, x, y, width, height);
    this.rectangles.push(rectangle);
  }

  removeRectangle(id: number) {
    this.rectangles = this.rectangles.filter((rect) => rect.id !== id);
  }
}

export const store = new RectangleStore();
