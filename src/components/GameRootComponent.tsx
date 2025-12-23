import { type BoardModel } from "../core/board-core.ts";
import type { StateGameDto } from "../core/dto.ts";
import { useGameState } from "../hooks/game.ts";
import { movePlayerIfPossible, rollDiceFase } from "../services/AppService.ts";
import { BoardComponent } from "./BoardComponent.tsx";
import { DiceRollComponent } from "./DiceRollComponent.tsx";

export interface GameRootProps {
  playerId: string;
  gameId: string;
}
export function GameRootComponent({ playerId: myId, gameId }: GameRootProps) {
  const state = useGameState(gameId);

  const boardModel = getBoardModel(state);

  console.log("state: ", state);

  function handleRollDice() {
    if (state?.state == "running" && state.round.playerId === myId) {
      rollDiceFase(gameId);
    }
  }

  function handleClickOnBoard(x: number, y: number) {
    if (
      state?.state === "running" && state.round.state === "move" &&
      state.round.playerId === myId
    ) {
      movePlayerIfPossible(gameId, x, y);
    }
  }

  return (
    <div>
      {state
        ? (
          state.state === "running"
            ? (
              <div>
                {(state.round.state === "dice" ||
                  state.round.state === "move") && (
                  <DiceRollComponent
                    actions={state.round.playerId === myId}
                    dice={state.round.state === "move"
                      ? state.round.dice
                      : undefined}
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
