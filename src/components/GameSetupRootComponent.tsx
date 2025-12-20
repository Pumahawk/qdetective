import { useEffect, useRef, useState } from "react";
import { GameInfoComponent } from "./GameInfoComponent.tsx";
import { GameListComponent } from "./GameListComponent.tsx";
import {
  GameSetupComponent,
  type OnConfirmEvent,
} from "./GameSetupComponent.tsx";
import { ServerSetupComponent } from "./ServerSetupComponent.tsx";
import {
  createGame,
  getGame,
  getGamesFromServer,
  joinGame,
} from "../services/AppService.ts";
import { Loading } from "../core/core.tsx";

type ViewState =
  | ServerSetupState
  | GameListState
  | GameInfoState
  | GameSetupJoinState
  | GameSetupCreateState;

interface ServerSetupState {
  state: "server-setup";
}

interface GameListState {
  state: "game-list";
  games: GameInfo[];
}

interface GameInfoState {
  id: string;
  state: "game-info";
  name: string;
  players: {
    id: string;
    name: string;
  }[];
}

interface GameSetupJoinState {
  state: "game-setup";
  mode: "join";
  gameId: string;
}

interface GameSetupCreateState {
  state: "game-setup";
  mode: "create";
}

interface GameInfo {
  id: string;
  name: string;
}

export function GameSetupRootComponent() {
  const [view, setView] = useState<ViewState | null>(null);
  const [loading, setLoading] = useState(true);
  const addressRef = useRef<string | null>(null);

  useEffect(() => {
    getInitialState().then((s) => {
      setView(s);
      setLoading(false);
    });
  }, []);

  async function getInitialState(): Promise<ViewState> {
    addressRef.current = getAddressFromUrl();
    if (addressRef.current) {
      return {
        state: "game-list",
        games: await getGamesInfoForComponent(addressRef.current),
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
        addressRef.current = address;
      }).finally(() => {
        setLoading(false);
      });
    }
  }

  function handleOnNewGameAction() {
    console.log("Hansle on new game action");
    setView({
      state: "game-setup",
      mode: "create",
    });
  }

  function handleOnOpenGame(gameId: string) {
    console.log("Handle handleOnOpenGame");
    if (addressRef.current) {
      setLoading(true);
      getGame(addressRef.current, gameId).then((response) => {
        setView({
          state: "game-info",
          id: gameId,
          name: response.data.name,
          players: response.data.players,
        });
      }).finally(() => {
        setLoading(false);
      });
    }
  }

  function handleOnJoin(gameId: string) {
    if (addressRef.current) {
      setView({
        state: "game-setup",
        mode: "join",
        gameId: gameId,
      });
    }
  }

  function handleOnShare() {
    console.log("Handle handleOnShare");
  }

  function handleOnConfirm(e: OnConfirmEvent) {
    if (!addressRef.current) {
      console.log("Invalid address value.", addressRef.current);
      return;
    }

    switch (e.mode) {
      case "create":
        createGame(addressRef.current, {
          gameName: e.gameName,
          playerAsset: e.playerAsset,
          playerName: e.playerName,
        }).then((response) => {
          setView({
            state: "game-info",
            id: response.id,
            name: response.data.name,
            players: response.data.players,
          });
        });
        break;

      case "join":
        joinGame(addressRef.current, {
          gameId: e.gameId,
          playerAsset: e.playerAsset,
          playerName: e.playerName,
        }).then((response) => {
          setView({
            state: "game-info",
            id: response.id,
            name: response.data.name,
            players: response.data.players,
          });
        });
        break;
    }
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
                onOpenGame={(gameId) => handleOnOpenGame(gameId)}
              />
            )}

            {view.state === "game-info" && (
              <GameInfoComponent
                name={view.name}
                id={view.id}
                players={view.players}
                onJoin={(gameId) => handleOnJoin(gameId)}
                onShare={() => handleOnShare()}
              />
            )}

            {view.state === "game-setup" && view.mode === "join" && (
              <GameSetupComponent
                mode={{ mode: "join", gameId: view.gameId }}
                onConfirm={(e) => handleOnConfirm(e)}
              />
            )}

            {view.state === "game-setup" && view.mode === "create" && (
              <GameSetupComponent
                mode={{ mode: "create" }}
                onConfirm={(e) => handleOnConfirm(e)}
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
