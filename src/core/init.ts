import { setGlobalServerAddress } from "../services/AppService.ts";
import { getUrlParameters } from "./utils.ts";

export function init() {
  const address = getUrlParameters().address;
  if (address) setGlobalServerAddress(address);
}
