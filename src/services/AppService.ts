import { prepareStartingDeckGameState } from "../core/cards.ts";
import { getPlayerInitialPosition } from "../core/characters.ts";
import type {
  AllStateResponseDto,
  GetStatusResponseDto,
  NewStatusResponseDTO,
  StateGameDto,
  Targets,
} from "../core/dto.ts";
import { type RunningStateGameDto } from "../core/game-dto.ts";
import { getRoundBlock, isValidMovementBlock } from "../core/map.ts";
import type { MessageDto } from "../core/messages-dto.ts";

interface DiceValue {
  total: number;
  dices: [number, number];
}

interface GlobalAppState {
  address: string | null;
}

interface GameInfoLocalStorage {
  gameId: string;
  playerId: string;
}

const globalAppState: GlobalAppState = {
  address: null,
};

export function getGlobalServerAddress(): string | null {
  return globalAppState.address;
}

export function setGlobalServerAddress(address: string) {
  globalAppState.address = address;
}

function getAddressOrThrow(): string {
  const address = getGlobalServerAddress();
  if (address) {
    return address;
  } else {
    throw new Error("Server address is mandatory.");
  }
}

export async function joinGame(status: {
  gameId: string;
  playerAsset: number;
  playerName: string;
}): Promise<GetStatusResponseDto> {
  const playerId = crypto.randomUUID();

  const gameResponse = await getGame(status.gameId);

  if (gameResponse.data.state === "open") {
    const bodyRequest: StateGameDto = {
      name: gameResponse.data.name,
      adminId: gameResponse.data.adminId,
      state: gameResponse.data.state,
      players: [...gameResponse.data.players, {
        id: playerId,
        name: status.playerName,
        assetId: status.playerAsset,
        status: "live",
      }],
    };

    const result = await client.saveOrCreateState(
      bodyRequest,
      status.gameId,
    );

    setStoreGamePlayerInfo(status.gameId, playerId);

    return result;
  } else {
    throw new Error("Invalid game status " + gameResponse.data.state);
  }
}

export async function createGame(status: {
  playerAssetId: number;
  playerName: string;
  gameName: string;
}): Promise<NewStatusResponseDTO> {
  const playerId = crypto.randomUUID();

  const bodyRequest: StateGameDto = {
    name: status.gameName,
    adminId: playerId,
    state: "open",
    players: [{
      id: playerId,
      name: status.playerName,
      assetId: status.playerAssetId,
      status: "live",
    }],
  };

  const result = await client.saveOrCreateState(bodyRequest);

  setStoreGamePlayerInfo(result.id, playerId);

  return result;
}

export async function getGame(
  gameId: string,
): Promise<GetStatusResponseDto> {
  return await client.getState(gameId);
}

export async function startGame(
  gameId: string,
) {
  const gameInfo = await getGame(gameId);
  if (gameInfo.data.state === "open") {
    const initialDeks = prepareStartingDeckGameState(
      gameInfo.data.players.length,
    );

    const playngPlayers = gameInfo.data.players.map((p, i) => ({
      ...p,
      position: getPlayerInitialPosition(i),
      deckIds: initialDeks.decks[i],
    }));

    const game: RunningStateGameDto = {
      ...gameInfo.data,
      state: "running",
      targets: initialDeks.target,
      players: playngPlayers,
      round: {
        state: "dice",
        playerId: gameInfo.data.adminId,
      },
    };

    return await client.saveOrCreateState(
      game,
      gameId,
    );
  } else {
    throw new Error("Invalid state " + gameInfo.data.state);
  }
}

export function getGamesFromServer(): Promise<AllStateResponseDto> {
  return client.getAllStates();
}

const client = {
  async getState(gameId: string): Promise<GetStatusResponseDto> {
    const response = await fetch(getAddressOrThrow() + "/status/" + gameId);
    const state = await response.json() as GetStatusResponseDto;
    return state;
  },

  async saveOrCreateState(
    state: StateGameDto,
    gameId?: string,
  ): Promise<GetStatusResponseDto> {
    const response = await fetch(
      getAddressOrThrow() + "/status" + (gameId ? ("/" + gameId) : ""),
      {
        method: "POST",
        body: JSON.stringify({ data: state }),
      },
    );
    return await response.json() as GetStatusResponseDto;
  },

  async getAllStates(): Promise<AllStateResponseDto> {
    const response = await fetch(getAddressOrThrow() + "/status");
    const body = await response.json() as AllStateResponseDto;
    return body;
  },

  async watchGame(
    gameId: string,
    conf: {
      signal: AbortSignal;
    },
    callBack: (message: MessageDto) => void,
  ): Promise<void> {
    const result = await fetch(
      getAddressOrThrow() + "/status/" + gameId + "/messages",
      {
        signal: conf.signal,
      },
    );
    if (result.status == 200) {
      const reader = result.body!.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const lines = decoder.decode(value, { stream: true });
        const messages = lines.split("\n").filter((m) => !!m);
        messages.forEach((message) => {
          console.log("messsage: ", message);
          const mj = JSON.parse(message) as MessageDto;
          callBack(mj);
        });
      }
    } else {
      throw new Error("unable stream messages");
    }
  },

  async message(gameId: string, message: MessageDto) {
    await fetch(
      getAddressOrThrow() + "/status/" + gameId + "/messages",
      {
        method: "POST",
        body: JSON.stringify(message),
      },
    );
  },
};

export function setStoreGamePlayerInfo(
  gameId: string,
  playerId: string,
) {
  const info: GameInfoLocalStorage = {
    gameId,
    playerId,
  };

  globalThis.localStorage.setItem(
    "game_" + gameId,
    JSON.stringify(info),
  );
}

export function getStoreGamePlayerInfo(
  gameId: string,
): GameInfoLocalStorage | null {
  const item = globalThis.localStorage.getItem(
    "game_" + gameId,
  );
  return item !== null ? JSON.parse(item) as GameInfoLocalStorage : null;
}

export function watchGame(
  id: string,
  callBack: (message: MessageDto) => void,
): { promise: Promise<void>; controller: AbortController } {
  const abortController = new AbortController();
  const result = client.watchGame(id, {
    signal: abortController.signal,
  }, callBack);
  return {
    promise: result,
    controller: abortController,
  };
}

export async function rollDiceFase(gameId: string): Promise<void> {
  const game = (await getGame(gameId)).data;

  if (game.state === "running" && game.round.state === "dice") {
    const dice = randomDice();
    const player = game.players.find((p) => p.id === game.round.playerId)!;
    const highlight = getHighlightBlocksPlayer(
      player,
      player.position[0],
      player.position[1],
    );
    const body: RunningStateGameDto = {
      ...game,
      round: {
        ...game.round,
        state: "move",
        step: dice.total,
        dice: dice.dices,
        highlight,
        selection: [],
      },
    };
    client.saveOrCreateState(body, gameId);
  } else {
    throw new Error("Invalid game state");
  }
}

export async function movePlayerIfPossible(
  gameId: string,
  x: number,
  y: number,
) {
  const game = await getGame(gameId);
  if (game.data.state === "running" && game.data.round.state === "move") {
    if (game.data.round.step <= 0) {
      console.error("step <= 0");
      return;
    }

    const playerId = game.data.round.playerId;
    const player = game.data.players.find((p) => p.id === playerId)!;

    if (!isValidMovementBlock(x, y)) {
      console.error("!isValidMovementBlock");
      return;
    }

    if (
      Math.abs(player.position[0] - x) + Math.abs(player.position[1] - y) !== 1
    ) {
      console.error("invalid movement");
      return;
    }

    player.position = [x, y];
    game.data.round.step--;
    game.data.round.highlight = game.data.round.step > 0
      ? getHighlightBlocksPlayer(player, x, y)
      : [];

    game.data.round.selection = [...game.data.round.selection, [x, y]];

    client.saveOrCreateState(game.data, gameId);
  } else {
    console.error("Invalid game state");
  }
}

function randomDice(): DiceValue {
  const dice1 = Math.floor(Math.random() * 6 + 1);
  const dice2 = Math.floor(Math.random() * 6 + 1);
  return {
    dices: [dice1, dice2],
    total: dice1 + dice2,
  };
}

function getHighlightBlocksPlayer(
  player: { position: [number, number] },
  x: number,
  y: number,
): [number, number][] {
  return getRoundBlock(x, y).filter((b) =>
    Math.abs(player.position[0] - b.x + player.position[1] - b.y) === 1
  ).filter((b) => b.type === "x" || b.type == "S").map((b) => [b.x, b.y]);
}

export async function startCallFase(gameId: string): Promise<void> {
  const game = await getGame(gameId);
  if (game.data.state === "running" && game.data.round.state === "move") {
    game.data.round = {
      state: "call",
      playerId: game.data.round.playerId,
      callState: "ask-fase",
    };
    client.saveOrCreateState(game.data, gameId);
  } else {
    throw new Error("Invalid game state");
  }
}

export async function callItems(gameId: string, items: Targets) {
  const game = await client.getState(gameId);
  if (
    game.data.state === "running" && game.data.round.state === "call" &&
    game.data.round.callState === "ask-fase"
  ) {
    const roundPlayerId = game.data.round.playerId;
    const callPlayerKey = (game.data.players.findIndex((p) =>
      p.id === roundPlayerId
    )! + 1) % game.data.players.length;
    const callPlayerId = game.data.players[callPlayerKey].id;

    game.data.round = {
      state: "call",
      playerId: game.data.round.playerId,
      callState: "response-fase",
      items,
      callPlayerId,
    };
    client.saveOrCreateState(game.data, gameId);
  } else {
    throw new Error("Invalid game fase");
  }
}

export async function showItemToCaller(
  gameId: string,
  playerId: string,
  item?: number,
) {
  const game = await client.getState(gameId);
  if (game.data.state === "running" && game.data.round.state === "call") {
    client.message(gameId, {
      type: "show-item",
      message: {
        item: item !== undefined
          ? {
            itemId: item,
            ownerId: playerId,
          }
          : undefined,
      },
    });
  } else {
    throw new Error("Invalid status message");
  }
}

export async function nextCallPlayerOrEndRound(gameId: string) {
  const game = await client.getState(gameId);
  if (
    game.data.state === "running" && game.data.round.state === "call" &&
    game.data.round.callState === "response-fase"
  ) {
    const gameRound = game.data.round;
    const roundPlayerIndex = game.data.players.findIndex((p) =>
      p.id === gameRound.playerId
    )!;
    const nextCallPlayerIndex = (game.data.players.findIndex((p) =>
      p.id === gameRound.callPlayerId
    )! + 1) % game.data.players.length;

    if (roundPlayerIndex === nextCallPlayerIndex) {
      game.data.round = {
        state: "accusation-opportunity",
        playerId: game.data.round.playerId,
      };
    } else {
      game.data.round.callPlayerId = game.data.players[nextCallPlayerIndex].id;
    }
    client.saveOrCreateState(game.data, gameId);
  } else {
    throw new Error("Invalid game state");
  }
}

export async function moveStateToAccusationOpportunity(gameId: string) {
  const game = await client.getState(gameId);
  if (game.data.state === "running" && game.data.round.state === "call") {
    game.data.round = {
      state: "accusation-opportunity",
      playerId: game.data.round.playerId,
    };
    await client.saveOrCreateState(game.data, gameId);
  } else {
    throw new Error("Invalid state");
  }
}

export async function endRount(gameId: string) {
  const game = await client.getState(gameId);
  if (game.data.state === "running") {
    const nextPlayer = getNextPlayer(game.data).id;
    game.data.round = {
      state: "dice",
      playerId: nextPlayer,
    };
    client.saveOrCreateState(game.data, gameId);
  } else {
    throw new Error("Invalid game state");
  }
}

export async function startAccusation(gameId: string) {
  const game = await client.getState(gameId);
  if (game.data.state === "running") {
    game.data.round = {
      state: "accusation-chose",
      playerId: game.data.round.playerId,
    };
    client.saveOrCreateState(game.data, gameId);
  }
}

export async function makeAccusation(gameId: string, items: number[]) {
  const game = await client.getState(gameId);
  if (
    game.data.state === "running" &&
    game.data.round.state === "accusation-chose"
  ) {
    const targets = game.data.targets;
    const win = items.reduce((b, item) => b && targets.includes(item), true);
    game.data.round = {
      state: "accusation-made",
      playerId: game.data.round.playerId,
      result: win ? "win" : "lose",
    };
  } else {
    throw new Error("Invalid game state");
  }
}

export async function continueFromAccusationMade(gameId: string) {
  const game = await client.getState(gameId);
  if (
    game.data.state === "running" && game.data.round.state === "accusation-made"
  ) {
    const round = game.data.round;
    if (round.result === "win") {
      game.data = {
        ...game.data,
        state: "finished",
      };
    } else {
      game.data.round = {
        state: "dice",
        playerId: getNextPlayer(game.data).id,
      };
    }
  } else {
    throw new Error("Invalid game state");
  }
}

function getNextPlayer(
  game: RunningStateGameDto,
): { index: number; id: string } {
  const nextPlayerIndex =
    (game.players.findIndex((p) => p.id === game.round.playerId)! + 1) %
    game.players.length;
  return { index: nextPlayerIndex, id: game.players[nextPlayerIndex].id };
}
