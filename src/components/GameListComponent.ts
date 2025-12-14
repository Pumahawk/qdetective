export interface GameListModel {}
export interface GameListComponent {}
export function GameListComponentF(cr: CustomElementRegistry) {
  class GameListComponentImpl extends HTMLElement
    implements GameListComponent {}
  cr.define("GameListComponent", GameListComponentImpl);
}
