import { prepareStartingDeckGameState } from "../core/cards.ts";
import { getPlayerInitialPosition } from "../core/characters.ts";
import type {
  AllStateResponseDto,
  GetStatusResponseDto as GetStatusResponseDto,
  MessageDto,
  NewStatusResponseDTO,
  StateGameDto,
} from "../core/dto.ts";
import type { RunningStateGameDto } from "../core/game-dto.ts";

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

    const result = await StateServerClient.post<NewStatusResponseDTO>(
      "status/" + status.gameId,
      bodyRequest,
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

  const result = await StateServerClient.post<NewStatusResponseDTO>(
    "status",
    bodyRequest,
  );

  setStoreGamePlayerInfo(result.id, playerId);

  return result;
}

export async function getGame(
  gameId: string,
): Promise<GetStatusResponseDto> {
  return await StateServerClient.get<GetStatusResponseDto>("status/" + gameId);
}

export async function startGame(
  gameId: string,
) {
  const gameInfo = await getGame(gameId);
  if (gameInfo.data.state === "open") {
    const initialDeks = prepareStartingDeckGameState(
      gameInfo.data.players.length,
    );

    let i = 0;
    const playngPlayers = gameInfo.data.players.map((p, i) => ({
      ...p,
      position: getPlayerInitialPosition(i),
      deckIds: initialDeks.decks[i++],
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

    return await StateServerClient.post<RunningStateGameDto>(
      "status/" + gameId,
      game,
    );
  } else {
    throw new Error("Invalid state " + gameInfo.data.state);
  }
}

export function getGamesFromServer(): Promise<AllStateResponseDto> {
  return StateServerClient.get<AllStateResponseDto>("status");
}

const StateServerClient = {
  async get<T>(path: string, conf?: {
    signal?: AbortSignal;
  }): Promise<T> {
    const response = await fetch(getAddressOrThrow() + "/" + path, {
      signal: conf?.signal,
    });
    return response.json() as T;
  },

  async post<RS>(path: string, body?: unknown, conf?: {
    signal?: AbortSignal;
  }): Promise<RS> {
    const response = await fetch(getAddressOrThrow() + "/" + path, {
      method: "POST",
      signal: conf?.signal,
      body: body as string && JSON.stringify({ data: body }),
    });
    return response.json() as RS;
  },

  async watch<T>(path: string, callBack: (message: T) => void, conf?: {
    signal?: AbortSignal;
  }): Promise<void> {
    const result = await fetch(getAddressOrThrow() + "/" + path, {
      signal: conf?.signal,
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
          const mj = JSON.parse(message) as T;
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
  const result = StateServerClient.watch<MessageDto>(
    "status/" + id + "/messages",
    callBack,
  );
  return {
    promise: result,
    controller: abortController,
  };
}
