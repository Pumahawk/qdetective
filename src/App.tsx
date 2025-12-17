import "./App.css";
import { GameSetupComponent } from "./components/GameSetupComponent.tsx";

function App() {
  return (
    <>
      <GameSetupComponent mode="create" onConfirm={() => {}} />
    </>
  );
}

export default App;
