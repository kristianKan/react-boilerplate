import { observer } from "mobx-react-lite";
import folderStore, { Folder } from "../stores/folderStore";
import styled from "styled-components";

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

const ImageList = observer(
  ({ folder, folderIndex }: { folder: Folder; folderIndex: number }) => {
    const handleRemoveImage = (imageUrl: string, folderIndex: number) => {
      folderStore.folders[folderIndex].folder.removeImage(imageUrl);
    };

    return (
      <div>
        {folder.folder.images.map((imageUrl: string, imageIndex: number) => (
          <div key={imageIndex} style={{ position: "relative" }}>
            <StyledButton
              onClick={() => handleRemoveImage(imageUrl, folderIndex)}
            >
              X
            </StyledButton>
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
          </div>
        ))}
      </div>
    );
  }
);

export default ImageList;
