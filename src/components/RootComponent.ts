export interface RootComponent extends HTMLElement {
}

export function RootComponentF(cr: CustomElementRegistry) {
  class RootComponent extends HTMLElement implements RootComponent {
    constructor() {
      super();
    }

    connectedCallback() {
      if (this.shadowRoot) return;
      const shadowRoot = this.attachShadow({ mode: "open" });

      const parameters = new URLSearchParams(globalThis.window.location.href);
      const server = parameters.get("server");
      const gameId = parameters.get("gameId");
      if (server && gameId) {
        const gameElement = document.createElement("app-game-root");
        shadowRoot.append(gameElement);
      } else {
        const gameSetupElement = document.createElement("app-root-game-setup");
        shadowRoot.append(gameSetupElement);
      }
    }
  }

  cr.define("app-root", RootComponent);
}
