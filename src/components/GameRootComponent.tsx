import { useEffect, useMemo, useState } from "react";
import { type BoardModel } from "../core/board-core.ts";
import type { StateGameDto } from "../core/dto.ts";
import { watchGame } from "../services/AppService.ts";
import { BoardComponent } from "./BoardComponent.tsx";
import { DiceRollComponent } from "./DiceRollComponent.tsx";

export interface GameRootProps {
  playerId: string;
  gameId: string;
}
export function GameRootComponent({ playerId: myId, gameId }: GameRootProps) {
  const [state, setState] = useState<StateGameDto | null>(null);

  const boardModel = useMemo<BoardModel | undefined>(() => {
    return state && state.state === "running"
      ? {
        players: state.players.map((p) => ({
          id: p.id,
          asset: p.assetId,
          position: p.position,
        })),
        highlight: [],
        selection: [],
      }
      : undefined;
  }, [state]);

  useEffect(() => {
    const res = watchGame(gameId, (message) => {
      if (message.type === "status-update" || message.type === "status-info") {
        setState(message.message);
      }
    });
    return () => res.controller.abort();
  });

  return (
    <div>
      {state
        ? (
          state.state === "running"
            ? (
              <div>
                {state.round.state === "dice" &&
                  state.round.playerId === myId && <DiceRollComponent />}
                <BoardComponent
                  model={boardModel}
                  onBoardClick={(x, y) => console.log("click on board", x, y)}
                />
              </div>
            )
            : <div>Game not running.</div>
        )
        : <div>Loading...</div>}
    </div>
  );
}
