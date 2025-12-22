export function getAddressFromUrl(): string | null {
  const url = new URL(globalThis.window.location.href);
  return url.searchParams.get("address");
}

export function getGameIdFromUrl(): string | null {
  const url = new URL(globalThis.window.location.href);
  return url.searchParams.get("gameId");
}

export function redirectUrl(
  { address, gameId }: { address?: string; gameId?: string },
) {
  const url = new URL(globalThis.window.location.href);
  if (address) url.searchParams.set("address", address);
  if (gameId) url.searchParams.set("gameId", gameId);
  globalThis.window.location.href = url.toString();
}
