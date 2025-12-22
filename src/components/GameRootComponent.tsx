import { type BoardModel } from "../core/board-core.ts";
import type { StateGameDto } from "../core/dto.ts";
import { useGameState } from "../hooks/game.ts";
import { rollDiceFase } from "../services/AppService.ts";
import { BoardComponent } from "./BoardComponent.tsx";
import { DiceRollComponent } from "./DiceRollComponent.tsx";

export interface GameRootProps {
  playerId: string;
  gameId: string;
}
export function GameRootComponent({ playerId: myId, gameId }: GameRootProps) {
  const state = useGameState(gameId);

  const boardModel = getBoardModel(state);

  function handleRollDice() {
    rollDiceFase(gameId);
  }

  function handleClickOnBoard(x: numebr, y: number) {
    if (
      state?.state === "running" && state.round.state === "move" &&
      state.round.playerId === myId
    ) {
      movePlayerIfPossible(gameId, myId);
    }
  }

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
                    onRoll={handleRollDice}
                  />
                )}
                <BoardComponent
                  model={boardModel}
                  onBoardClick={handleClickOnBoard}
                />
              </div>
            )
            : <div>Game not running.</div>
        )
        : <div>Loading...</div>}
    </div>
  );
}

function getBoardModel(state?: StateGameDto): BoardModel | undefined {
  if (state && state.state === "running") {
    const round = state.round;
    return {
      players: state.players.map((p) => ({
        id: p.id,
        asset: p.assetId,
        position: p.position,
      })),
      highlight: round.state === "move"
        ? round.highlight.map((c) => ({ position: c }))
        : [],
      selection: round.state === "move"
        ? round.selection.map((c) => ({ position: c }))
        : [],
    };
  }
  return undefined;
}
