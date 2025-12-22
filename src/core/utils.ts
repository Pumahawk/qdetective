type ModeType = "play" | null;

export interface UrlParameters {
  address?: string | null;
  gameId?: string | null;
  mode?: ModeType;
}

export function getUrlParameters(): UrlParameters {
  const url = new URL(globalThis.window.location.href);
  return {
    gameId: url.searchParams.get("gameId"),
    address: url.searchParams.get("address"),
    mode: url.searchParams.get("mode") as ModeType,
  };
}

export function redirectUrl(params: UrlParameters) {
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
