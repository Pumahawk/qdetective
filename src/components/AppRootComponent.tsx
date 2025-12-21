import { useState } from "react";
import { GameSetupRootComponent } from "./GameSetupRootComponent.tsx";
import { Loading } from "../core/core.tsx";
import { getGame } from "../services/AppService.ts";
import { prepareStartingDeckGameState } from "../core/cards.ts";

export const AppRootController = {
  async startGame(address: string, gameId: string): Promise<void> {
    const gameInfo = await getGame(address, gameId);
    const initialDeks = prepareStartingDeckGameState(
      gameInfo.data.players.length,
    );
    console.log("initial", initialDeks);
  },
};

export function AppRootComponent() {
  const [loading, setLoading] = useState(false);

  function handleOpenGame(address: string, gameId: string) {
    console.log("handleOpenGame", address, gameId);
  }

  function handleStartGame(address: string, gameId: string) {
    setLoading(true);
    AppRootController.startGame(address, gameId).finally(() => {
      setLoading(false);
    });
  }

  return (
    <div>
      <div hidden={!loading}>
        <Loading />
      </div>
      <div hidden={loading}>
        <GameSetupRootComponent
          onOpenGame={(address, gameId) => handleOpenGame(address, gameId)}
          onStartGame={(address, gameId) => handleStartGame(address, gameId)}
        />
      </div>
    </div>
  );
}
