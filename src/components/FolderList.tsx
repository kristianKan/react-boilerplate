import { observer } from "mobx-react-lite";
import FolderRename from "./FolderRename";
import ImageList from "./ImageList";
import folderStore from "../stores/folderStore";
import styled from "styled-components";

const StyledH2 = styled.h2`
  color: #333;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const StyledButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  background-color: #f44336; // Red
  color: white;
  border: none;
  cursor: pointer;
  padding: 10px 15px;
  font-size: 20px;
  line-height: 1;
  z-index: 1;
  &:hover {
    background-color: #d32f2f;
  }
`;

const FolderList = observer(() => {
  const handleDropFolder = (e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData("image"));
    const sourceFolder = folderStore.folders.find(
      (folder) => folder.id === data.sourceFolderId
    );
    const targetFolder = folderStore.folders.find(
      (folder) => folder.id === folderId
    );
    if (sourceFolder && targetFolder) {
      sourceFolder.folder.moveImage(targetFolder.folder, data.image);
    }
  };

  const handleRemoveFolder = (folderId: string) => {
    folderStore.removeFolder(folderId);
  };

  return (
    <>
      <StyledH2>Folders</StyledH2>
      {folderStore.folders.map((folder, folderIndex) => (
        <div key={folder.id} style={{ position: "relative" }}>
          <StyledButton onClick={() => handleRemoveFolder(folder.id)}>
            X
          </StyledButton>
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDropFolder(e, folder.id)}
          >
            <FolderRename folder={folder} folderIndex={folderIndex} />
            <ImageList folder={folder} />
          </div>
        </div>
      ))}
    </>
  );
});

export default FolderList;
