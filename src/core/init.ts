import { setGlobalServerAddress } from "../services/AppService.ts";
import { getAddressFromUrl } from "./utils.ts";

export function init() {
  const address = getAddressFromUrl();
  if (address) setGlobalServerAddress(address);
}
