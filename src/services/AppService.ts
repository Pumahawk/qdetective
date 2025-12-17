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
