import { type BoardModel } from "../core/board-core.ts";
import { CardImg, PlayerImg } from "../core/core.tsx";
import type { StateGameDto } from "../core/dto.ts";
import { useGameState } from "../hooks/game.ts";
import {
  callItems,
  continueFromAccusationMade,
  endRount,
  makeAccusation,
  movePlayerIfPossible,
  moveStateToAccusationOpportunity,
  nextCallPlayerOrEndRound,
  rollDiceFase,
  showItemToCaller,
  startAccusation,
  startCallFase,
} from "../services/AppService.ts";
import { ItemSelectionComponent } from "./ItemSelectionComponent.tsx";
import { BoardComponent } from "./BoardComponent.tsx";
import { DiceRollComponent } from "./DiceRollComponent.tsx";
import { getAllCards, getCardById } from "../core/cards.ts";
import {
  CallStatusComponent,
  type PlayerCallInfo,
  type ShowItemInfo,
} from "./CallStatusComponent.tsx";
import type {
  PlayingPlayerDto,
  ResponseFaseCallRoundState,
  RunningStateGameDto,
} from "../core/game-dto.ts";
import type { MessageDto } from "../core/messages-dto.ts";
import { useRef, useState } from "react";

export interface GameRootProps {
  playerId: string;
  gameId: string;
}

export function GameRootComponent({ playerId: myId, gameId }: GameRootProps) {
  const state = useGameState(gameId, handleMessage);
  const [showItem, setShowItem] = useState<ShowItemInfo>();
  const callStatePlayers = useRef<PlayerCallInfo[]>(null);

  if (
    state && state.state === "running" &&
    state.round.state === "call" &&
    state.round.callState === "response-fase"
  ) {
    callStatePlayers.current = getCallStatePlayersFromGame(
      state.players,
      state.round,
    );
  }

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
    callItems(gameId, [items[0], items[1], items[2]]);
  }

  function handleOnShowCard(item?: number) {
    showItemToCaller(gameId, myId, item);
  }

  function handleOnEndRound() {
    endRount(gameId);
  }

  function handleOnStartAccusation() {
    startAccusation(gameId);
  }

  function handleOnChoseItemAccusation(items: number[]) {
    makeAccusation(gameId, items);
  }

  function handleContinueFromAccusationMade() {
    continueFromAccusationMade(gameId);
  }

  function handleMessage(game: StateGameDto, message: MessageDto) {
    if (
      message.type === "show-item" && game.state === "running" &&
      game.round.state === "call" &&
      game.round.callState === "response-fase"
    ) {
      if (message.message.item !== undefined) {
        const ownerPlayer = game.players.find((p) =>
          p.id === message.message.item?.ownerId
        )!;
        if (game.round.playerId === myId) {
          setShowItem({
            item: message.message.item.itemId,
            owner: {
              name: ownerPlayer.name,
              assetId: ownerPlayer.assetId,
            },
          });
        } else {
          setShowItem({
            item: message.message.item.itemId,
            owner: {
              name: ownerPlayer.name,
              assetId: ownerPlayer.assetId, // TODO set onknow asset id
            },
          });
        }
        moveStateToAccusationOpportunity(gameId);
      } else {
        nextCallPlayerOrEndRound(gameId);
      }
    }
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

                      {state.round.state === "accusation-opportunity" && (
                        <div>
                          <button type="button" onClick={handleOnEndRound}>
                            End round
                          </button>
                          <button
                            type="button"
                            onClick={handleOnStartAccusation}
                          >
                            Accusation
                          </button>
                        </div>
                      )}

                      {state.round.state == "accusation-chose" && (
                        <div>
                          <ItemSelectionComponent
                            itemGroups={getAllItemGroups()}
                            onConfirm={handleOnChoseItemAccusation}
                          />
                        </div>
                      )}

                      {state.round.state === "accusation-made" && (
                        <div>
                          {state.round.result}
                          <button
                            type="button"
                            onClick={handleContinueFromAccusationMade}
                          >
                            Continue
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {callStatePlayers.current &&
                    (
                      <CallStatusComponent
                        players={callStatePlayers.current}
                        status="wait"
                        item={showItem}
                        onContinue={handleOnShowCard}
                      />
                    )}

                  {state.round.state === "call" &&
                    state.round.callState === "response-fase" &&
                    state.round.callPlayerId === myId && (
                    <div>
                      <ItemSelectionComponent
                        itemGroups={[getCommonItemGroups(
                          state.round.items,
                          state.players.find((p) => p.id === myId)!.deckIds,
                        )]}
                        onConfirm={(group) => handleOnShowCard(group[0])}
                      />
                    </div>
                  )}
                </div>
                <MyDeckComponent myId={myId} game={state} />

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

function getItemGroups(items: number[]): number[][] {
  const groups: number[][] = [[], [], []];
  items.map(getCardById).forEach((card) => groupItems(card, groups));
  return groups;
}

function getAllItemGroups(): number[][] {
  const groups: number[][] = [[], [], []];
  getAllCards().forEach((c) => groupItems(c, groups));
  return groups;
}

function getCommonItemGroups(a: number[], b: number[]): number[] {
  return a.filter((v) => b.includes(v));
}

function getCallStatePlayersFromGame(
  players: PlayingPlayerDto[],
  round: ResponseFaseCallRoundState,
): PlayerCallInfo[] {
  const roundPlayerIndex = players.findIndex((p) => p.id === round.playerId)!;
  const callPlayerIndex =
    players.findIndex((p) => p.id === round.callPlayerId)! - 1;
  const playersRelative = [];

  for (
    let i = roundPlayerIndex + 1;
    i < roundPlayerIndex + players.length;
    i++
  ) {
    playersRelative.push(players[i % players.length]);
  }

  return playersRelative.map((p, i) => ({
    name: p.name,
    assetId: p.assetId,
    status: i < callPlayerIndex
      ? "not-owner"
      : i == callPlayerIndex
      ? "waiting"
      : "waiting",
  }));
}

function MyDeckComponent(
  { myId, game }: { myId: string; game: RunningStateGameDto },
) {
  const deck = game.players.find((p) => p.id === myId)?.deckIds!;
  const group = getItemGroups(deck);
  return (
    <div>
      {group.map((g, i) => (
        <div key={i}>
          {g.map(getCardById).map((card) => (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              key={card.id}
            >
              <CardImg type={card.type} assetId={card.assetId} />
              <label>{card.name}</label>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
