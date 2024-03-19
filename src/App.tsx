import { ChangeEvent, useState } from "react";
import { observer } from "mobx-react-lite";
import AddButton from "./components/AddButton";
import folderStore from "./stores/folderStore";
import { ImageStore } from "./stores/imageStore";
import { removeBackground } from "./services/removeBackgroundApi";

const App = observer(() => {
  const [newFolderName, setNewFolderName] = useState("");
  const [editingFolderIndex, setEditingFolderIndex] = useState(-1);
  const [selectedFolderIndex, setSelectedFolderIndex] = useState(0);

  const onImageAdd = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      removeBackground(e.target.files[0], selectedFolderIndex);
    } else {
      console.error("No file was picked");
    }
  };

  const handleRemoveImage = (imageUrl: string, folderIndex: number) => {
    folderStore.folders[folderIndex].folder.removeImage(imageUrl);
  };

  return (
    <div>
      <div>
        <input
          type="text"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
        />
        <button
          onClick={() => folderStore.addFolder(newFolderName, new ImageStore())}
        >
          Create new folder
        </button>
      </div>
      <select
        value={selectedFolderIndex}
        onChange={(e) => setSelectedFolderIndex(Number(e.target.value))}
      >
        {folderStore.folders.map((folder, index) => (
          <option value={index} key={index}>
            {folder.name}
          </option>
        ))}
      </select>
      <AddButton onImageAdd={onImageAdd} />
      {folderStore.folders.map((folder, folderIndex) => (
        <div
          key={folderIndex}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            const data = JSON.parse(e.dataTransfer.getData("image"));
            folderStore.folders[data.sourceFolderIndex].folder.moveImage(
              folder.folder,
              data.imageUrl
            );
          }}
        >
          {editingFolderIndex === folderIndex ? (
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  folderStore.renameFolder(editingFolderIndex, newFolderName);
                  setEditingFolderIndex(-1);
                }
              }}
            />
          ) : (
            <h2 onClick={() => setEditingFolderIndex(folderIndex)}>
              {folder.name}
            </h2>
          )}
          {folder.folder.images.map((imageUrl, imageIndex) => (
            <div key={imageIndex}>
              <img
                src={imageUrl}
                alt={`Uploaded image ${imageIndex + 1}`}
                draggable="true"
                onDragStart={(e) => {
                  e.dataTransfer.setData(
                    "image",
                    JSON.stringify({ imageUrl, sourceFolderIndex: folderIndex })
                  );
                }}
              />
              <button onClick={() => handleRemoveImage(imageUrl, folderIndex)}>
                X
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
});

export default App;
