import { useEffect, useRef, useState } from "react";
import { Loading } from "../core/core.tsx";
import type {
  GetStatusResponseDto,
  NewStatusResponseDTO,
} from "../core/dto.ts";
import {
  createGame,
  getGame,
  getGamesFromServer,
  getStoreGamePlayerInfo,
  joinGame,
  setStoreGamePlayerInfo,
  watchGame,
} from "../services/AppService.ts";
import {
  GameInfoComponent,
  type GameStatusMode,
  type PlayerRoleMode,
} from "./GameInfoComponent.tsx";
import { GameListComponent } from "./GameListComponent.tsx";
import {
  GameSetupComponent,
  type OnConfirmEvent,
} from "./GameSetupComponent.tsx";
import { ServerSetupComponent } from "./ServerSetupComponent.tsx";

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

interface PlayerInfo {
  id: string;
  name: string;
  assetId: number;
}

interface GameInfoState {
  state: "game-info";
  id: string;
  name: string;
  mode: PlayerRoleMode;
  gameStatus: GameStatusMode;
  players: PlayerInfo[];
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

const GameSetupRootController = {
  async joinGame(address: string, joinInfo: {
    gameId: string;
    playerAsset: number;
    playerName: string;
  }): Promise<GetStatusResponseDto> {
    const playerId = crypto.randomUUID();

    const result = await joinGame(address, {
      playerId,
      gameId: joinInfo.gameId,
      playerAsset: joinInfo.playerAsset,
      playerName: joinInfo.playerName,
    });

    setStoreGamePlayerInfo(joinInfo.gameId, playerId, false);

    return result;
  },

  async createGame(address: string, createInfo: {
    playerName: string;
    playerAssetId: number;
    gameName: string;
  }): Promise<NewStatusResponseDTO> {
    const playerId = crypto.randomUUID();
    const result = await createGame(address, {
      playerId,
      ...createInfo,
    });

    setStoreGamePlayerInfo(result.id, playerId, true);

    return result;
  },
};

export interface GameSetupRootProps {
  onStartGame?: (address: string, gameId: string) => void;
  onOpenGame?: (address: string, gameId: string) => void;
}

export function GameSetupRootComponent(
  { onOpenGame, onStartGame }: GameSetupRootProps,
) {
  const [view, setView] = useState<ViewState | null>(null);
  const [loading, setLoading] = useState(true);
  const addressRef = useRef<string | null>(null);

  const gameId = view?.state === "game-info" && view.id;

  useEffect(() => {
    getInitialState().then((s) => {
      setView(s);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (view?.state === "game-info" && gameId && addressRef.current) {
      const { controller } = watchGame(
        addressRef.current,
        gameId,
        (message) => {
          if (message.type === "status-update") {
            if (
              view.gameStatus === "open" && message.message.status === "running"
            ) {
              onOpenGame && addressRef.current &&
                onOpenGame(addressRef.current, gameId);
            }
            setView((prev) =>
              prev && {
                ...prev,
                players: message.message.players,
              }
            );
          }
        },
      );
      return () => {
        controller.abort();
      };
    }
  }, [gameId]);

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
      const storeInfo = getStoreGamePlayerInfo(gameId);
      const mode = storeInfo
        ? (storeInfo.admin ? "admin" : "not-admin")
        : "no-role";

      console.log("storeInfo: ", storeInfo);
      console.log("admin: ", storeInfo?.admin);
      console.log("mode: ", mode);
      getGame(addressRef.current, gameId).then((response) => {
        setView({
          state: "game-info",
          id: gameId,
          mode,
          gameStatus: response.data.status,
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
        GameSetupRootController.createGame(addressRef.current, {
          gameName: e.gameName,
          playerAssetId: e.playerAssetId,
          playerName: e.playerName,
        }).then((response) => {
          setView({
            state: "game-info",
            mode: "admin",
            id: response.id,
            gameStatus: response.data.status,
            name: response.data.name,
            players: response.data.players,
          });
        });
        break;

      case "join":
        GameSetupRootController.joinGame(addressRef.current, {
          gameId: e.gameId,
          playerAsset: e.playerAssetId,
          playerName: e.playerName,
        }).then((response) => {
          setView({
            state: "game-info",
            mode: "not-admin",
            id: response.id,
            gameStatus: response.data.status,
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
                role={view.mode}
                gameStatus={view.gameStatus}
                name={view.name}
                id={view.id}
                players={view.players}
                onJoin={(gameId) => handleOnJoin(gameId)}
                onShare={() => handleOnShare()}
                onStart={(gameId) =>
                  onStartGame && addressRef.current &&
                  onStartGame(addressRef.current, gameId)}
                onEnter={(gameId) =>
                  onOpenGame && addressRef.current &&
                  onOpenGame(addressRef.current, gameId)}
              />
            )}

            {view.state === "game-setup" && (
              <GameSetupComponent
                mode={view.mode === "join"
                  ? { mode: "join", gameId: view.gameId }
                  : { mode: "create" }}
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
