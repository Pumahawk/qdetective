export function getAddressFromUrl(): string | null {
  const url = new URL(globalThis.window.location.href);
  return url.searchParams.get("address");
}

export function getGameIdFromUrl(): string | null {
  const url = new URL(globalThis.window.location.href);
  return url.searchParams.get("gameId");
}

export function redirectUrl(
  params: { address?: string | null; gameId?: string | null },
) {
  const url = new URL(globalThis.window.location.href);

  Object.entries(params).forEach(([param, value]) => {
    if (value !== undefined) {
      if (value === null) {
        url.searchParams.delete(param);
      } else {
        url.searchParams.set(param, value);
      }
    }
  });

  globalThis.window.location.href = url.toString();
}
