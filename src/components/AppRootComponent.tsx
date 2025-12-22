import { useEffect, useState } from "react";
import { Loading } from "../core/core.tsx";
import { getGlobalServerAddress, startGame } from "../services/AppService.ts";
import { GameSetupRootComponent } from "./GameSetupRootComponent.tsx";
import { ServerSetupComponent } from "./ServerSetupComponent.tsx";
import { getUrlParameters, redirectUrl } from "../core/utils.ts";

type ViewState =
  | ServerSetupState
  | GameSetupViewState
  | PlayGameViewState
  | LoadingViewState;

interface ServerSetupState {
  mode: "server-setup";
}

interface GameSetupViewState {
  mode: "game-setup";
  gameId?: string;
}

interface PlayGameViewState {
  mode: "play";
  gameId: string;
}

interface LoadingViewState {
  mode: "loading";
}

export function AppRootComponent() {
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<ViewState>({ mode: "loading" });

  useEffect(() => {
    const address = getGlobalServerAddress();
    const { mode, gameId } = getUrlParameters();
    if (address) {
      if (gameId && mode === "play") {
        setView({
          mode: "play",
          gameId: gameId,
        });
      } else {
        setView({
          mode: "game-setup",
          gameId: gameId ?? undefined,
        });
      }
    } else {
      setView({
        mode: "server-setup",
      });
    }
  }, []);

  function handleOpenGame(gameId: string) {
    redirectUrl({
      gameId,
      mode: "play",
    });
  }

  function handleStartGame(gameId: string) {
    setLoading(true);
    startGame(gameId).then(() => {
      redirectUrl({ gameId });
    }).finally(() => {
      setLoading(false);
    });
  }

  function handleOnServerSelected(address: string) {
    redirectUrl({ address, gameId: null });
  }

  return (
    <div>
      <div hidden={!loading && view.mode !== "loading"}>
        <Loading />
      </div>

      {view.mode === "server-setup" && (
        <div hidden={loading}>
          <ServerSetupComponent
            onServerSelected={(address) => handleOnServerSelected(address)}
          />
        </div>
      )}

      {view.mode === "game-setup" && (
        <div hidden={loading}>
          <GameSetupRootComponent
            gameId={view.gameId}
            onOpenGame={(gameId) => handleOpenGame(gameId)}
            onStartGame={(gameId) => handleStartGame(gameId)}
          />
        </div>
      )}

      {view.mode === "play" && <div>Starting game...</div>}
    </div>
  );
}
