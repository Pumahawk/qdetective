export function getAddressFromUrl(): string | null {
  const url = new URL(globalThis.window.location.href);
  return url.searchParams.get("address");
}
