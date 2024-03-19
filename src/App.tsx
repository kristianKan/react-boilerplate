import { ChangeEvent, useState } from "react";
import { observer } from "mobx-react-lite";
import AddButton from "./components/AddButton";
import folderStore from "./stores/folderStore";
import { ImageStore } from "./stores/imageStore";
import { removeBackground } from "./services/removeBackgroundApi";
import styled from "styled-components";

const StyledButton = styled.button`
  background-color: #4caf50; /* Green */
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
`;

const StyledInput = styled.input`
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const StyledSelect = styled.select`
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const StyledH2 = styled.h2`
  color: #333;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const StyledH3 = styled.h3`
  color: #333;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
`;

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

  const handleAddFolder = () => {
    folderStore.addFolder(newFolderName, new ImageStore());
    setSelectedFolderIndex(folderStore.folders.length - 1);
    setNewFolderName(""); // Set newFolderName to null
  };

  return (
    <div>
      <div>
        <StyledInput
          type="text"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
        />
        <StyledButton onClick={() => handleAddFolder()}>
          Create new folder
        </StyledButton>
      </div>
      <StyledSelect
        value={selectedFolderIndex}
        onChange={(e) => setSelectedFolderIndex(Number(e.target.value))}
      >
        {folderStore.folders.map((folder, index) => (
          <option value={index} key={index}>
            {folder.name}
          </option>
        ))}
      </StyledSelect>
      <AddButton onImageAdd={onImageAdd} />
      <StyledH2>Folders</StyledH2>
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
            <StyledInput
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
            <StyledH3 onClick={() => setEditingFolderIndex(folderIndex)}>
              {folder.name}
            </StyledH3>
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
              <StyledButton
                onClick={() => handleRemoveImage(imageUrl, folderIndex)}
              >
                Remove
              </StyledButton>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
});

export default App;
