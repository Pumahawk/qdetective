import type { AllStateResponseDto } from "../core/dto.ts";

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
  };
}
