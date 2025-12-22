import { useEffect, useMemo, useState } from "react";
import { type BoardModel } from "../core/board-core.ts";
import type { StateGameDto } from "../core/dto.ts";
import { watchGame } from "../services/AppService.ts";
import { BoardComponent } from "./BoardComponent.tsx";

export interface GameRootProps {
  playerId: string;
  gameId: string;
}
export function GameRootComponent({ playerId: myId, gameId }: GameRootProps) {
  const [state, setState] = useState<StateGameDto | null>(null);

  const boardModel = useMemo<BoardModel>(() => {
    return {
      players: [],
      highlight: [],
      selection: [],
    };
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
      {state != null
        ? (
          state.state === "running"
            ? (
              <div>
                <BoardComponent model={boardModel} />
              </div>
            )
            : <div>Game not running.</div>
        )
        : <div>Loading...</div>}
    </div>
  );
}
