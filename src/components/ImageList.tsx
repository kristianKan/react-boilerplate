import { observer } from "mobx-react-lite";
import styled from "styled-components";
import { Bin } from "@styled-icons/icomoon/Bin";
import folderStore, { Folder } from "../stores/folderStore";
import { Image } from "../stores/imageStore";

const StyledButton = styled.button`
  display: none;
  position: absolute;
  top: 0;
  right: 0;
  color: white;
  width: 22px;
  height: 22px;
  line-height: 10px;
  margin: 6px;
  cursor: pointer;
`;

const StyledMask = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s ease;
`;

const ImageContainer = styled.div`
  position: relative;

  &:hover ${StyledButton}, &:hover ${StyledMask} {
    display: block;
    opacity: 1;
  }
`;

const StyledImage = styled.img`
  width: 100%;
  height: auto;
`;

const ImageList = observer(({ folder }: { folder: Folder }) => {
  const handleRemoveImage = (imageId: string, folderId: string) => {
    const folder = folderStore.folders.find((folder) => folder.id === folderId);
    folder && folder.folder.removeImage(imageId);
  };

  const handleDragImage = (e: React.DragEvent, image: Image) => {
    e.dataTransfer.setData(
      "image",
      JSON.stringify({ image, sourceFolderId: folder.id })
    );
  };

  return (
    <>
      {folder.folder.images.map((image: Image) => (
        <ImageContainer key={image.id}>
          <StyledImage src={image.url} alt={`Uploaded image ${image.id}`} />
          <StyledMask
            draggable="true"
            onDragStart={(e) => handleDragImage(e, image)}
          />
          <StyledButton onClick={() => handleRemoveImage(image.id, folder.id)}>
            <Bin size={18} />
          </StyledButton>
        </ImageContainer>
      ))}
    </>
  );
});

export default ImageList;
