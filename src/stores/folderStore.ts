import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";
import { ImageStore } from "./imageStore";

class FolderStore {
  folders: { name: string; folder: ImageStore }[] = [
    { name: "default folder", folder: new ImageStore() },
  ];

  constructor() {
    makeAutoObservable(this);
    /*
    makePersistable(this, {
      name: "folderStore",
      properties: [
        {
          key: "folders",
          serialize: (value) => {
            return value.join(",");
          },
          deserialize: (value) => {
            return value.split(",");
          },
        },
      ],
      storage: window.localStorage,
    });
    */
  }

  addFolder(newName: string, newFolder: ImageStore) {
    this.folders.push({ name: newName, folder: newFolder });
  }

  renameFolder(index: number, newName: string) {
    this.folders[index].name = newName;
  }
}

export default new FolderStore();
