import { prepareStartingDeckGameState } from "../core/cards.ts";
import { getPlayerInitialPosition } from "../core/characters.ts";
import type {
  AllStateResponseDto,
  GetStatusResponseDto,
  MessageDto,
  NewStatusResponseDTO,
  StateGameDto,
} from "../core/dto.ts";
import { type RunningStateGameDto } from "../core/game-dto.ts";
import { getRoundBlock, isValidMovementBlock } from "../core/map.ts";

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

export function getPlayerById(
  id: string,
): { id: string; assetId: number; name: string } {
  // TODO
  return {
    id: id,
    name: "Mock Name",
    assetId: 0,
  };
}

export function getItemById(
  id: string,
): { id: string; name: string; assetId: number } {
  return {
    id: id,
    name: "Mock name item",
    assetId: 0,
  };
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
      }],
    };

    const result = await client.saveState(
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
    }],
  };

  const result = await client.saveState(bodyRequest);

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

    return await client.saveState(
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

  async saveState(
    state: StateGameDto,
    gameId?: string,
  ): Promise<GetStatusResponseDto> {
    const response = await fetch(
      getAddressOrThrow() + "/status" + gameId ? ("/" + gameId) : "",
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
    const result = await fetch(getAddressOrThrow() + "/status/" + gameId, {
      signal: conf.signal,
    });
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
    const body: RunningStateGameDto = {
      ...game,
      round: {
        ...game.round,
        state: "move",
        step: dice.total,
        highlight: [],
        selection: [],
      },
    };
    client.saveState(body, gameId);
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
      return;
    }

    const playerId = game.data.round.playerId;
    const player = game.data.players.find((p) => p.id === playerId)!;

    if (!isValidMovementBlock(x, y)) {
      return;
    }

    if (
      Math.abs(player.position[0] - x) + Math.abs(player.position[1] - y) !== 1
    ) {
      return;
    }

    player.position = [x, y];
    game.data.round.highlight = getRoundBlock(x, y).filter((b) =>
      b.type === "x" || b.type == "S"
    ).map((b) => [b.x, b.y]);
    client.saveState(game.data);
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
