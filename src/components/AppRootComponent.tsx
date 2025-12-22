import { useState } from "react";
import { Loading } from "../core/core.tsx";
import { startGame } from "../services/AppService.ts";
import { GameSetupRootComponent } from "./GameSetupRootComponent.tsx";

type ViewState = GameSetupViewState | PlayGameViewState;

interface GameSetupViewState {
  mode: "game-setup";
}

interface PlayGameViewState {
  mode: "play";
  address: string;
  gameId: string;
}

export function AppRootComponent() {
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<ViewState>({ mode: "game-setup" });

  function handleOpenGame(address: string, gameId: string) {
    setView({
      mode: "play",
      address,
      gameId,
    });
  }

  function handleStartGame(address: string, gameId: string) {
    setLoading(true);
    startGame(address, gameId).then(() => {
      setView({
        mode: "play",
        gameId,
        address,
      });
    }).finally(() => {
      setLoading(false);
    });
  }

  return (
    <div>
      <div hidden={!loading}>
        <Loading />
      </div>

      {view.mode === "game-setup" && (
        <div hidden={loading}>
          <GameSetupRootComponent
            onOpenGame={(address, gameId) => handleOpenGame(address, gameId)}
            onStartGame={(address, gameId) => handleStartGame(address, gameId)}
          />
        </div>
      )}

      {view.mode === "play" && <div>Starting game...</div>}
    </div>
  );
}
