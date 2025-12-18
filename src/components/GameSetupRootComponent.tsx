import { useEffect, useRef, useState } from "react";
import { GameInfoComponent } from "./GameInfoComponent.tsx";
import { GameListComponent } from "./GameListComponent.tsx";
import { GameSetupComponent } from "./GameSetupComponent.tsx";
import { ServerSetupComponent } from "./ServerSetupComponent.tsx";
import { getGamesFromServer } from "../services/AppService.ts";
import { Loading } from "../core/core.tsx";

type ViewState =
  | ServerSetupState
  | GameListState
  | GameInfoState
  | GameSetupState;

interface ServerSetupState {
  state: "server-setup";
}

interface GameListState {
  state: "game-list";
  games: GameInfo[];
}

interface GameInfoState {
  state: "game-info";
  name: string;
  players: {
    id: string;
    name: string;
  }[];
}

interface GameSetupState {
  state: "game-setup";
  mode: "create" | "join";
}

interface GameInfo {
  id: string;
  name: string;
}

export function GameSetupRootComponent() {
  const [view, setView] = useState<ViewState | null>(null);
  const [loading, setLoading] = useState(true);
  const address = useRef<string | null>(null);

  useEffect(() => {
    getInitialState().then((s) => {
      setView(s);
      setLoading(false);
    });
  }, []);

  async function getInitialState(): Promise<ViewState> {
    address.current = getAddressFromUrl();
    if (address.current) {
      return {
        state: "game-list",
        games: await getGamesInfoForComponent(address.current),
      };
    } else {
      return { state: "server-setup" };
    }
  }

  function handleOnServerSelected(address: string) {
    console.log("Handle on server selected", address);
    if (address) {
      setLoading(true);
      getGamesInfoForComponent(address).then((games) => {
        const url = new URL(globalThis.window.location.href);
        url.searchParams.set("address", address);
        history.pushState({}, "", url.toString());
        setView({ state: "game-list", games });
        setLoading(false);
      }).catch(() => {
        setLoading(false);
        setView(view);
      });
    }
  }

  function handleOnNewGameAction() {
    console.log("Hansle on new game action");
  }

  function handleOnOpenGame() {
    console.log("Handle handleOnOpenGame");
  }

  function handleOnJoin() {
    console.log("Handle handleOnJoin");
  }

  function handleOnShare() {
    console.log("Handle handleOnShare");
  }

  function handleOnConfirm() {
    console.log("Handle handleOnConfirm");
  }

  return (
    <div>
      <div hidden={!loading}>
        <Loading />
      </div>
      <div hidden={loading}>
        {view != null && (
          <div>
            {view.state === "server-setup" && (
              <ServerSetupComponent
                onServerSelected={(address) => handleOnServerSelected(address)}
              />
            )}

            {view.state === "game-list" && (
              <GameListComponent
                games={view.games}
                onNewGameAction={() => handleOnNewGameAction()}
                onOpenGame={() => handleOnOpenGame()}
              />
            )}

            {view.state === "game-info" && (
              <GameInfoComponent
                name={view.name}
                players={view.players}
                onJoin={() => handleOnJoin()}
                onShare={() => handleOnShare()}
              />
            )}

            {view.state === "game-setup" && (
              <GameSetupComponent
                mode={view.mode}
                onConfirm={() => handleOnConfirm()}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function getAddressFromUrl(): string | null {
  const url = new URL(globalThis.window.location.href);
  return url.searchParams.get("address");
}

async function getGamesInfoForComponent(address: string): Promise<GameInfo[]> {
  const games = await getGamesFromServer(address);
  return (games.status || []).map((s) => ({ id: s.id, name: s.id }));
}
