import { observer } from "mobx-react-lite";
import styled from "styled-components";
import folderStore, { Folder } from "../stores/folderStore";
import { Image } from "../stores/imageStore";

const StyledButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  background-color: #f44336; /* Red */
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
    <div>
      {folder.folder.images.map((image: Image, imageIndex: number) => (
        <div key={imageIndex} style={{ position: "relative" }}>
          <StyledButton onClick={() => handleRemoveImage(image.id, folder.id)}>
            X
          </StyledButton>
          <img
            src={image.url}
            alt={`Uploaded image ${imageIndex + 1}`}
            draggable="true"
            onDragStart={(e) => handleDragImage(e, image)}
          />
        </div>
      ))}
    </div>
  );
});

export default ImageList;
