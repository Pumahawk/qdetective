import { type BoardModel } from "../core/board-core.ts";
import { PlayerImg } from "../core/core.tsx";
import type { StateGameDto } from "../core/dto.ts";
import { useGameState } from "../hooks/game.ts";
import {
  movePlayerIfPossible,
  rollDiceFase,
  startCallFase,
} from "../services/AppService.ts";
import { ItemSelectionComponent } from "./ItemSelectionComponent.tsx";
import { BoardComponent } from "./BoardComponent.tsx";
import { DiceRollComponent } from "./DiceRollComponent.tsx";
import { getAllCards, getCardById } from "../core/cards.ts";

export interface GameRootProps {
  playerId: string;
  gameId: string;
}
export function GameRootComponent({ playerId: myId, gameId }: GameRootProps) {
  const state = useGameState(gameId);

  const boardModel = getBoardModel(state);

  const me = state?.players.find((p) => p.id === myId);

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

  function handleStartCallFase() {
    startCallFase(gameId);
  }

  function handleOnCallConfirm(items: number[]) {
  }

  return (
    <div>
      {me && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div>
            <PlayerImg imageId={me.assetId} />
          </div>
        </div>
      )}

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

                <div>
                  {state.round.playerId === myId && (
                    <div>
                      {state.round.state === "move" && state.round.step === 0 &&
                        (
                          <div>
                            <button type="button" onClick={handleStartCallFase}>
                              Call
                            </button>
                          </div>
                        )}

                      {state.round.state === "call" && (
                        <div>
                          {state.round.callState === "ask-fase" && (
                            <div>
                              <ItemSelectionComponent
                                itemGroups={getAllItemGroups()}
                                onConfirm={handleOnCallConfirm}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

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

function groupItems(
  card: { type: "item" | "room" | "person"; id: number },
  groups: number[][],
): number[][] {
  groups[card.type === "item" ? 0 : card.type === "room" ? 1 : 2].push(card.id);
  return groups;
}

function getMyItemGroups(items: number[]): number[][] {
  const groups: number[][] = [[], [], []];
  items.map(getCardById).forEach((card) => groupItems(card, groups));
  return groups;
}

function getAllItemGroups(): number[][] {
  const groups: number[][] = [[], [], []];
  getAllCards().forEach((c) => groupItems(c, groups));
  return groups;
}
