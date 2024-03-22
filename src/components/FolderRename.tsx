import { useState, useRef, useEffect } from "react";
import { observer } from "mobx-react-lite";
import folderStore, { Folder } from "../stores/folderStore";
import styled from "styled-components";

const StyledH3 = styled.h3`
  color: #333;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
`;

const StyledInput = styled.input`
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const FolderRename = observer(
  ({ folder, folderIndex }: { folder: Folder; folderIndex: number }) => {
    const [isRenaming, setIsRenaming] = useState(false);
    const [editingFolderName, setEditingFolderName] = useState("");
    const [editingFolderIndex, setEditingFolderIndex] = useState(-1);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        folderStore.renameFolder(editingFolderIndex, editingFolderName);
        setEditingFolderIndex(-1);
        setEditingFolderName("");
        setIsRenaming(false);
      } else if (e.key === "Escape" && inputRef.current) {
        inputRef.current.blur();
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsRenaming(true);
      setEditingFolderName(e.target.value);
    };

    const handleBlur = () => {
      setEditingFolderName(folder.name);
      setEditingFolderIndex(-1);
      setIsRenaming(false);
    };

    const handleClick = () => {
      setEditingFolderIndex(folderIndex);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    useEffect(() => {
      if (editingFolderIndex === folderIndex && inputRef.current) {
        inputRef.current.focus();
      }
    }, [editingFolderIndex, folderIndex]);

    return (
      <div>
        {editingFolderIndex === folderIndex ? (
          <StyledInput
            ref={inputRef}
            type="text"
            value={isRenaming ? editingFolderName : folder.name}
            onChange={(e) => handleChange(e)}
            onKeyDown={(e) => handleKeyDown(e)}
            onBlur={() => handleBlur()}
          />
        ) : (
          <StyledH3 onClick={() => handleClick()}>{folder.name}</StyledH3>
        )}
      </div>
    );
  }
);

export default FolderRename;
