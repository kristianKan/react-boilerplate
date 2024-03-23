import { makeAutoObservable } from "mobx";
import { v4 as uuidv4 } from "uuid";

export interface Image {
  id: string;
  url: string;
}

export class ImageStore {
  images: Image[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  addImage(imageUrl: string) {
    this.images.push({ id: uuidv4(), url: imageUrl });
  }

  removeImage(imageId: string) {
    const index = this.images.findIndex((image) => image.id === imageId);
    if (index !== -1) {
      this.images.splice(index, 1);
    }
  }

  moveImage(otherStore: ImageStore, image: Image) {
    this.removeImage(image.id);
    otherStore.addImage(image.url);
  }
}

export default new ImageStore();
