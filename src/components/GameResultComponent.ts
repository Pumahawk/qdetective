export interface GameResultModel {}
export interface GameResultComponent {}
export function GameResultComponentF(cr: CustomElementRegistry) {
  class GameResultComponentImpl extends HTMLElement
    implements GameResultComponent {}
  cr.define("GameResultComponent", GameResultComponentImpl);
}
