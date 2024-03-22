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

const handleOnDrop = (e: React.DragEvent, folderIndex: number) => {
  e.preventDefault();
  const data = JSON.parse(e.dataTransfer.getData("image"));
  folderStore.folders[data.sourceFolderIndex].folder.moveImage(
    folderStore.folders[folderIndex].folder,
    data.imageUrl
  );
};

const FolderList = observer(() => {
  return (
    <>
      <StyledH2>Folders</StyledH2>
      {folderStore.folders.map((folder, folderIndex) => (
        <div
          key={folderIndex}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleOnDrop(e, folderIndex)}
        >
          <FolderRename folder={folder} folderIndex={folderIndex} />
          <ImageList folder={folder} folderIndex={folderIndex} />
        </div>
      ))}
    </>
  );
});

export default FolderList;
