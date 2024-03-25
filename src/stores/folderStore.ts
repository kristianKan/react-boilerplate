import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";
import { v4 as uuidv4 } from "uuid";
import { ImageStore, Image } from "./imageStore";

export interface Folder {
  id: string;
  name: string;
  folder: ImageStore;
}

class FolderStore {
  folders: Folder[] = [
    { id: uuidv4(), name: "default folder", folder: new ImageStore() },
  ];
  selectedFolderIndex = 0;

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: "folderStore",
      properties: [
        "selectedFolderIndex",
        {
          key: "folders",
          serialize: (folders) => {
            const foldersData = folders.map((folder) => {
              return {
                id: folder.id,
                name: folder.name,
                images: folder.folder.images,
              };
            });
            return JSON.stringify(foldersData);
          },
          deserialize: (foldersString) => {
            if (foldersString) {
              try {
                const foldersData = JSON.parse(foldersString);
                return foldersData.map(
                  (folder: { id: string; name: string; images: Image[] }) => {
                    const imageStore = new ImageStore();
                    imageStore.images = folder.images;
                    return {
                      id: folder.id,
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

  addFolder(newName: string) {
    this.folders.push({
      id: uuidv4(),
      name: newName,
      folder: new ImageStore(),
    });
  }

  removeFolder(folderId: string) {
    const index = this.folders.findIndex((folder) => folder.id === folderId);
    if (index !== -1) {
      this.folders.splice(index, 1);
      if (this.selectedFolderIndex >= this.folders.length) {
        this.selectedFolderIndex = this.folders.length - 1;
      }
    }
  }

  renameFolder(index: number, newName: string) {
    this.folders[index].name = newName;
  }
}

export default new FolderStore();
