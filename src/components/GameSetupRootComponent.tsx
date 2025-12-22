import { useEffect, useState } from "react";
import { Loading } from "../core/core.tsx";
import {
  createGame,
  getGame,
  getGamesFromServer,
  getStoreGamePlayerInfo,
  joinGame,
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
import { redirectUrl } from "../core/utils.ts";

type ViewState =
  | LoadingState
  | GameListState
  | GameInfoState
  | GameSetupJoinState
  | GameSetupCreateState;

interface LoadingState {
  state: "loading";
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

export interface GameSetupRootProps {
  gameId?: string;
  onStartGame?: (gameId: string) => void;
  onOpenGame?: (gameId: string) => void;
}

export function GameSetupRootComponent(
  { gameId: initialGameId, onOpenGame, onStartGame }: GameSetupRootProps,
) {
  const [view, setView] = useState<ViewState>({ state: "loading" });
  const [loading, setLoading] = useState(true);

  const gameId = view?.state === "game-info" && view.id;

  useEffect(() => {
    if (initialGameId) {
      openGameAction(initialGameId);
    } else {
      getGamesFromServer().then((result) => {
        setView({
          state: "game-list",
          games: result.status?.map((s) => ({ id: s.id, name: s.id })) ?? [],
        });
      }).finally(() => {
        setLoading(false);
      });
    }
  }, []);

  useEffect(() => {
    if (view?.state === "game-info" && gameId) {
      const { controller } = watchGame(
        gameId,
        (message) => {
          if (message.type === "status-update") {
            const storage = getStoreGamePlayerInfo(gameId);
            const gamEstate = message.message;
            setView({
              state: "game-info",
              id: gameId,
              name: gamEstate.name,
              players: gamEstate.players,
              gameStatus: gamEstate.status,
              mode: storage
                ? gamEstate.adminId === storage.playerId ? "admin" : "not-admin"
                : "no-role",
            });
          }
        },
      );
      return () => {
        controller.abort();
      };
    }
  }, [gameId]);

  function handleOnNewGameAction() {
    console.log("Hansle on new game action");
    setView({
      state: "game-setup",
      mode: "create",
    });
  }

  function openGameAction(gameId: string) {
    console.log("Handle handleOnOpenGame");
    setLoading(true);
    const storeInfo = getStoreGamePlayerInfo(gameId);

    console.log("storeInfo: ", storeInfo);
    getGame(gameId).then((response) => {
      setView({
        state: "game-info",
        id: gameId,
        mode: storeInfo === null
          ? "no-role"
          : storeInfo.playerId === response.data.adminId
          ? "admin"
          : "not-admin",
        gameStatus: response.data.status,
        name: response.data.name,
        players: response.data.players,
      });
    }).finally(() => {
      setLoading(false);
    });
  }

  function handleOpenGame(gameId: string) {
    redirectUrl({
      gameId,
    });
  }

  function handleOnJoin(gameId: string) {
    setView({
      state: "game-setup",
      mode: "join",
      gameId: gameId,
    });
  }

  function handleOnShare() {
    console.log("Handle handleOnShare");
  }

  function handleOnConfirm(e: OnConfirmEvent) {
    switch (e.mode) {
      case "create":
        createGame({
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
        joinGame({
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
            {view.state === "game-list" && (
              <GameListComponent
                games={view.games}
                onNewGameAction={() => handleOnNewGameAction()}
                onOpenGame={(gameId) => handleOpenGame(gameId)}
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
                  onStartGame &&
                  onStartGame(gameId)}
                onEnter={(gameId) =>
                  onOpenGame &&
                  onOpenGame(gameId)}
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
