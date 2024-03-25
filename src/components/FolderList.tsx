import { observer } from "mobx-react-lite";
import FolderRename from "./FolderRename";
import ImageList from "./ImageList";
import folderStore from "../stores/folderStore";
import styled from "styled-components";
import { Bin } from "@styled-icons/icomoon/Bin";

const StyledH1 = styled.h1`
  color: #333;
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const StyledButton = styled.button`
  display: none;
  cursor: pointer;
  color: black;
  width: 22px;
  height: 22px;
  margin-left: 6px;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;

  &:hover ${StyledButton} {
    display: block;
  }
`;

const ImageListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
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
      <StyledH1>Folders</StyledH1>
      <GridContainer>
        {folderStore.folders.map((folder, folderIndex) => (
          <FlexContainer
            key={folder.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDropFolder(e, folder.id)}
          >
            <HeaderContainer>
              <FolderRename folder={folder} folderIndex={folderIndex} />
              <StyledButton onClick={() => handleRemoveFolder(folder.id)}>
                <Bin size={18} />
              </StyledButton>
            </HeaderContainer>
            <ImageListContainer>
              <ImageList folder={folder} />
            </ImageListContainer>
          </FlexContainer>
        ))}
      </GridContainer>
    </>
  );
});

export default FolderList;
