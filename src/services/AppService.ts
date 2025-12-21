import type {
  AllStateResponseDto,
  GetStatusResponseDto as GetStatusResponseDto,
  MessageDto,
  NewStatusResponseDTO,
  StatusGameDto,
} from "../core/dto.ts";

interface GameInfoLocalStorage {
  gameId: string;
  playerId: string;
  admin: boolean;
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

export async function joinGame(address: string, status: {
  gameId: string;
  playerId: string;
  playerAsset: number;
  playerName: string;
}): Promise<GetStatusResponseDto> {
  const client = StateServerClient(address);

  const gameResponse = await getGame(address, status.gameId);

  const bodyRequest: StatusGameDto = {
    name: gameResponse.data.name,
    adminId: gameResponse.data.adminId,
    status: gameResponse.data.status,
    players: [...gameResponse.data.players, {
      id: status.playerId,
      name: status.playerName,
      assetId: status.playerAsset,
    }],
  };

  return client.post<NewStatusResponseDTO>(
    "status/" + status.gameId,
    bodyRequest,
  );
}

export function createGame(address: string, status: {
  playerId: string;
  playerAssetId: number;
  playerName: string;
  gameName: string;
}): Promise<NewStatusResponseDTO> {
  const client = StateServerClient(address);

  const bodyRequest: StatusGameDto = {
    name: status.gameName,
    adminId: status.playerId,
    status: "open",
    players: [{
      id: status.playerId,
      name: status.playerName,
      assetId: status.playerAssetId,
    }],
  };

  return client.post<NewStatusResponseDTO>("status", bodyRequest);
}

export async function getGame(
  address: string,
  gameId: string,
): Promise<GetStatusResponseDto> {
  const client = StateServerClient(address);

  return await client.get<GetStatusResponseDto>("status/" + gameId);
}

export function getGamesFromServer(
  address: string,
): Promise<AllStateResponseDto> {
  return StateServerClient(address).get<AllStateResponseDto>("status");
}

function StateServerClient(address: string) {
  return {
    async get<T>(path: string, conf?: {
      signal?: AbortSignal;
    }): Promise<T> {
      const response = await fetch(address + "/" + path, {
        signal: conf?.signal,
      });
      return response.json() as T;
    },

    async post<RS>(path: string, body?: unknown, conf?: {
      signal?: AbortSignal;
    }): Promise<RS> {
      const response = await fetch(address + "/" + path, {
        method: "POST",
        signal: conf?.signal,
        body: body as string && JSON.stringify({ data: body }),
      });
      return response.json() as RS;
    },

    async watch<T>(path: string, callBack: (message: T) => void, conf?: {
      signal?: AbortSignal;
    }): Promise<void> {
      const result = await fetch(address + "/" + path, {
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
}

export function setStoreGamePlayerInfo(
  gameId: string,
  playerId: string,
  admin: boolean,
) {
  const info: GameInfoLocalStorage = {
    gameId,
    playerId,
    admin,
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
  address: string,
  id: string,
  callBack: (message: MessageDto) => void,
): { promise: Promise<void>; controller: AbortController } {
  const client = StateServerClient(address);
  const abortController = new AbortController();
  const result = client.watch<MessageDto>(
    "status/" + id + "/messages",
    callBack,
  );
  return {
    promise: result,
    controller: abortController,
  };
}
