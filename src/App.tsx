import DrawingCanvas from "./components/DrawingCanvas";

import { configure } from "mobx";

configure({
  enforceActions: "never",
});

function App() {
  return (
    <div>
      Click to add a rectangle. Move inner bottom right corner to resize.
      Deletion is not yet implemented
      <DrawingCanvas />
    </div>
  );
}

export default App;
