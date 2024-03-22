import { useState } from "react";
import styled from "styled-components";
import folderStore from "../stores/folderStore";
import { ImageStore } from "../stores/imageStore";

const StyledInput = styled.input`
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const StyledButton = styled.button`
  background-color: #4caf50; /* Green */
  border: none;
  border-radius: 10px;
  color: white;
  padding: 12px 24px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
`;

const FolderCreator = () => {
  const [newFolderName, setNewFolderName] = useState("");

  const handleAddFolder = () => {
    folderStore.addFolder(newFolderName, new ImageStore());
    folderStore.setSelectedFolderIndex(folderStore.folders.length - 1);
    setNewFolderName(""); // Set newFolderName to null
  };

  return (
    <div>
      <StyledInput
        type="text"
        placeholder="enter folder name"
        value={newFolderName}
        onChange={(e) => setNewFolderName(e.target.value)}
      />
      <StyledButton onClick={() => handleAddFolder()}>
        Create New Folder
      </StyledButton>
    </div>
  );
};

export default FolderCreator;
