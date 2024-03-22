import { makeAutoObservable } from "mobx";

export interface Image {
  images: Array<string>;
}

export class ImageStore {
  images: string[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  addImage(imageUrl: string) {
    this.images.push(imageUrl);
  }

  removeImage(imageUrl: string) {
    const index = this.images.indexOf(imageUrl);
    if (index !== -1) {
      this.images.splice(index, 1);
    }
  }

  moveImage(otherStore: ImageStore, imageUrl: string) {
    this.removeImage(imageUrl);
    otherStore.addImage(imageUrl);
  }
}

export default new ImageStore();
