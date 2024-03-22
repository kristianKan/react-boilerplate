import { ChangeEvent } from "react";
import { observer } from "mobx-react-lite";
import AddButton from "./components/AddButton";
import { removeBackground } from "./services/removeBackgroundApi";
import FolderList from "./components/FolderList";
import FolderCreator from "./components/FolderCreator";
import FolderSelector from "./components/FolderSelector";
import folderStore from "./stores/folderStore";

const App = observer(() => {
  const onImageAdd = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      removeBackground(e.target.files[0], folderStore.selectedFolderIndex);
    } else {
      console.error("No file was picked");
    }
  };

  return (
    <div>
      <FolderCreator />
      <FolderSelector />
      <AddButton onImageAdd={onImageAdd} />
      <FolderList />
    </div>
  );
});

export default App;
