export interface ServerSetupModel {}
export interface ServerSetupComponent {}
export function ServerSetupComponentF(cr: CustomElementRegistry) {
  class ServerSetupComponentImpl extends HTMLElement
    implements ServerSetupComponent {}
  cr.define("ServerSetupComponent", ServerSetupComponentImpl);
}
