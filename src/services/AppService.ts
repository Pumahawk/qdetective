import type {
  AllStateResponseDto,
  GetStatusResponseDto as GetStatusResponseDto,
  NewStatusResponseDTO,
  StatusGameDto,
} from "../core/dto.ts";

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
  playerAsset: number;
  playerName: string;
}): Promise<NewStatusResponseDTO> {
  const client = StateServerClient(address);

  const gameResponse = await getGame(address, status.gameId);

  const bodyRequest: StatusGameDto = {
    name: gameResponse.data.name,
    adminId: gameResponse.data.adminId,
    players: [...gameResponse.data.players, {
      id: crypto.randomUUID(),
      name: status.playerName,
      asset: status.playerAsset,
    }],
  };

  return client.post<NewStatusResponseDTO>(
    "status/" + status.gameId,
    bodyRequest,
  );
}

export function createGame(address: string, status: {
  playerAsset: number;
  playerName: string;
  gameName: string;
}): Promise<NewStatusResponseDTO> {
  const client = StateServerClient(address);

  const playerId = crypto.randomUUID();

  const bodyRequest: StatusGameDto = {
    name: status.gameName,
    adminId: playerId,
    players: [{
      id: playerId,
      name: status.playerName,
      asset: status.playerAsset,
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
    async get<T>(path: string): Promise<T> {
      const response = await fetch(address + "/" + path);
      return response.json() as T;
    },

    async post<RS>(path: string, body?: unknown): Promise<RS> {
      const response = await fetch(address + "/" + path, {
        method: "POST",
        body: body as string && JSON.stringify({ data: body }),
      });
      return response.json() as RS;
    },
  };
}
