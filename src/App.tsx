import { ChangeEvent, useState } from "react";
import { observer } from "mobx-react-lite";

import AddButton from "./components/AddButton";
import loadImage, { LoadImageResult } from "blueimp-load-image";
import { API_KEY, API_URL, BASE64_IMAGE_HEADER } from "./constants";
import folderStore from "./stores/folderStore";
import { ImageStore } from "./stores/imageStore";

const uploadImageToServer = (file: File, folderIndex: number) => {
  loadImage(file, {
    maxWidth: 400,
    maxHeight: 400,
    canvas: true,
  })
    .then(async (imageData: LoadImageResult) => {
      const image = imageData.image as HTMLCanvasElement;
      const imageBase64 = image.toDataURL("image/png");
      const imageBase64Data = imageBase64.replace(BASE64_IMAGE_HEADER, "");
      const data = {
        image_file_b64: imageBase64Data,
      };
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-api-key": API_KEY,
        },
        body: JSON.stringify(data),
      });

      if (response.status >= 400 && response.status < 600) {
        throw new Error("Bad response from server");
      }

      const result = await response.json();
      const base64Result = BASE64_IMAGE_HEADER + result.result_b64;

      // Add the new image to the default folder
      folderStore.folders[folderIndex].folder.addImage(base64Result);
    })

    .catch((error) => {
      console.error(error);
    });
};

const handleRemoveImage = (imageUrl: string) => {
  folderStore.folders[0].folder.removeImage(imageUrl);
};

const App = observer(() => {
  const [newFolderName, setNewFolderName] = useState("");
  const [selectedFolderIndex, setSelectedFolderIndex] = useState(0);

  const onImageAdd = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadImageToServer(e.target.files[0], selectedFolderIndex);
    } else {
      console.error("No file was picked");
    }
  };

  return (
    <div>
      <div>
        <input
          type="text"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
        />
        <button
          onClick={() => folderStore.addFolder(newFolderName, new ImageStore())}
        >
          Create new folder
        </button>
      </div>
      <select
        value={selectedFolderIndex}
        onChange={(e) => setSelectedFolderIndex(Number(e.target.value))}
      >
        {folderStore.folders.map((folder, index) => (
          <option value={index} key={index}>
            {folder.name}
          </option>
        ))}
      </select>
      <AddButton onImageAdd={onImageAdd} />
      {folderStore.folders[0].folder.images.map((imageUrl, index) => (
        <div
          key={index}
          className="flex items-center justify-center h-screen w-screen"
        >
          <img src={imageUrl} alt={`Uploaded image ${index + 1}`} />
          <button onClick={() => handleRemoveImage(imageUrl)}>X</button>
        </div>
      ))}
    </div>
  );
});

export default App;
