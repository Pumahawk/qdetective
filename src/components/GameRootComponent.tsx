import { useEffect, useMemo, useState } from "react";
import { type BoardModel } from "../core/board-core.ts";
import type { StateGameDto } from "../core/dto.ts";
import { watchGame } from "../services/AppService.ts";
import { BoardComponent } from "./BoardComponent.tsx";
import { DiceRollComponent } from "./DiceRollComponent.tsx";

interface DiceValue {
  total: number;
  dices: [number, number];
}

export interface GameRootProps {
  playerId: string;
  gameId: string;
}
export function GameRootComponent({ playerId: myId, gameId }: GameRootProps) {
  const [state, setState] = useState<StateGameDto | null>(null);
  const [dice, setDice] = useState<DiceValue | undefined>(undefined);

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
                  state.round.playerId === myId && (
                  <DiceRollComponent
                    dice={dice?.dices}
                    onRoll={() => setDice(randomDice())}
                  />
                )}
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

function randomDice(): DiceValue {
  const dice1 = Math.floor(Math.random() * 6 + 1);
  const dice2 = Math.floor(Math.random() * 6 + 1);
  return {
    dices: [dice1, dice2],
    total: dice1 + dice2,
  };
}
