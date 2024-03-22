import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";
import { ImageStore } from "./imageStore";
import { Image } from "./imageStore";

export interface Folder {
  name: string;
  folder: Image;
}

class FolderStore {
  folders: { name: string; folder: ImageStore }[] = [
    { name: "default folder", folder: new ImageStore() },
  ];
  selectedFolderIndex = 0;

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: "folderStore",
      properties: [
        {
          key: "folders",
          serialize: (folders) => {
            const foldersData = folders.map((folder) => {
              const name = folder.name;
              const images = folder.folder.images;
              return { name, images };
            });
            return JSON.stringify(foldersData);
          },
          deserialize: (foldersString) => {
            if (foldersString) {
              try {
                const foldersData = JSON.parse(foldersString);
                return foldersData.map(
                  (folder: { name: string; images: Array<string> }) => {
                    const imageStore = new ImageStore();
                    imageStore.images = folder.images;
                    return {
                      name: folder.name,
                      folder: imageStore,
                    };
                  }
                );
              } catch (error) {
                console.error("Error in folderStore deserialiser:", error);
                return [];
              }
            } else {
              return [];
            }
          },
        },
      ],
      storage: window.localStorage,
    });
  }

  setSelectedFolderIndex(index: number) {
    this.selectedFolderIndex = index;
  }

  addFolder(newName: string, newFolder: ImageStore) {
    this.folders.push({ name: newName, folder: newFolder });
  }

  renameFolder(index: number, newName: string) {
    this.folders[index].name = newName;
  }
}

export default new FolderStore();
