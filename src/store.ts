import { makeAutoObservable } from "mobx";

class Store {
  value = 0;
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

  // dummy methods for example
  increment() {
    this.value++;
  }

  decrement() {
    this.value--;
  }
}

export default new Store();
