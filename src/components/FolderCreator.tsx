import React, { useState } from "react";
import styled from "styled-components";
import folderStore from "../stores/folderStore";

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledInput = styled.input`
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;

const StyledButton = styled.button`
  background-color: black;
  border-radius: 50%;
  color: white;
  width: 36px;
  height: 36px;
  text-decoration: none;
  margin: 4px 2px;
  cursor: pointer;
`;

const FolderCreator = () => {
  const [newFolderName, setNewFolderName] = useState("");
  const [error, setError] = useState("");

  const handleAddFolder = () => {
    if (newFolderName.trim() === "") {
      setError("name can't be blank");
    } else {
      folderStore.addFolder(newFolderName);
      folderStore.setSelectedFolderIndex(folderStore.folders.length - 1);
      setNewFolderName("");
      setError("");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (newFolderName.trim() === "") {
      setError("name can't be blank");
    }
    setNewFolderName(e.target.value);
    setError("");
  };

  return (
    <StyledDiv>
      <div>
        <StyledInput
          type="text"
          placeholder="enter folder name"
          value={newFolderName}
          onChange={(e) => handleChange(e)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddFolder();
            }
          }}
          style={error ? { borderColor: "red" } : {}}
        />
        <StyledButton onClick={() => handleAddFolder()}>+</StyledButton>
      </div>
      {error && <div style={{ color: "red", fontSize: "10px" }}>{error}</div>}
    </StyledDiv>
  );
};

export default FolderCreator;
