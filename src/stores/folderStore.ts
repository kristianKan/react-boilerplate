import { makeAutoObservable } from "mobx";
import { ImageStore } from "./imageStore";

class FolderStore {
  folders: { name: string; folder: ImageStore }[] = [
    { name: "default folder", folder: new ImageStore() },
  ];

  constructor() {
    makeAutoObservable(this);
  }

  addFolder(newName: string, newFolder: ImageStore) {
    this.folders.push({ name: newName, folder: newFolder });
  }

  renameFolder(index: number, newName: string) {
    this.folders[index].name = newName;
  }
}

export default new FolderStore();
