import { observer } from "mobx-react-lite";
import styled from "styled-components";
import folderStore from "../stores/folderStore";

const StyledSelect = styled.select`
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 180px;
  height: 46px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const FolderSelector = observer(() => {
  return (
    <StyledSelect
      value={folderStore.selectedFolderIndex}
      onChange={(e) =>
        folderStore.setSelectedFolderIndex(Number(e.target.value))
      }
    >
      {folderStore.folders.map((folder, index) => (
        <option value={index} key={index}>
          {folder.name}
        </option>
      ))}
    </StyledSelect>
  );
});

export default FolderSelector;
