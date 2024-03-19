import { API_KEY, API_URL, BASE64_IMAGE_HEADER } from "../constants";
import loadImage, { LoadImageResult } from "blueimp-load-image";
import folderStore from "../stores/folderStore";

export const removeBackground = (file: File, folderIndex: number) => {
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
