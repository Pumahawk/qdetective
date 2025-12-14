export interface BoardModel {}
export interface BoardComponent {}
export function BoardComponentF(cr: CustomElementRegistry) {
  class BoardComponentImpl extends HTMLElement implements BoardComponent {}
  cr.define("BoardComponent", BoardComponentImpl);
}
