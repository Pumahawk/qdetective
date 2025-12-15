export interface GameRootComponent extends HTMLElement {
}

export function GameRootComponentF(cr: CustomElementRegistry) {
  class GameRootComponentImpl extends HTMLElement implements GameRootComponent {
    constructor() {
      super();
    }

    connectedCallback() {
      if (this.shadowRoot) return;
      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.innerHTML = `
<style>
</style>
<div>
  <app-dice-roll></app-dice-roll>
  <app-item-selection></app-item-selection>
  <app-call-status></app-call-status>
  <app-game-result></app-game-result>
  <app-board></app-board>
</div>
`;
    }
  }
  cr.define("app-game-root", GameRootComponentImpl);
}
