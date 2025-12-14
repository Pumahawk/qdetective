export interface GameSetupModel {}
export interface GameSetupComponent {}
export function GameSetupComponentF(cr: CustomElementRegistry) {
  class GameSetupComponentImpl extends HTMLElement
    implements GameSetupComponent {}
  cr.define("GameSetupComponent", GameSetupComponentImpl);
}
