const gameNameElementId = "game-name";
const playersListElementId = "players-list";
const shareButtonId = "share-button";
const joinButtonId = "join-button";

export interface GameInfoModel {
  players: {
    label: string;
  }[];
}

export interface GameInfoComponent extends HTMLElement {
  onJoin(): void;
  onShare(): void;

  update(model: GameInfoModel): void;
}

export function GameInfoComponentF(cr: CustomElementRegistry) {
  class GameInfoComponentImpl extends HTMLElement implements GameInfoComponent {
    playersListElement: HTMLElement | undefined;
    nameGameElement: HTMLElement | undefined;

    onJoin = () => {};
    onShare = () => {};

    static observedAttributes = ["name"];

    constructor() {
      super();
    }

    attributeChangedCallback(name: string, _: string, newValue: string) {
      switch (name) {
        case "name":
          if (this.nameGameElement) {
            this.nameGameElement.innerHTML = newValue;
          }
          break;
      }
    }

    connectedCallback() {
      if (this.shadowRoot) return;
      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.innerHTML = `
<div id="${gameNameElementId}">Game name</div>
<div id="${playersListElementId}"></div>
<div>
  <button id="${shareButtonId}" type="button">Share</button>
  <button id="${joinButtonId}" type="button">Join</button>
</div>
`;

      const name = this.getAttribute("name");
      this.nameGameElement = shadowRoot.getElementById(gameNameElementId)!;
      this.nameGameElement.innerText = name ?? "Game";
      this.playersListElement = shadowRoot.getElementById(
        playersListElementId,
      )!;
      shadowRoot.getElementById(joinButtonId)!.onclick = () => {
        this.onJoin();
      };
      shadowRoot.getElementById(shareButtonId)!.onclick = () => {
        this.onShare();
      };
    }

    update(model: GameInfoModel) {
      model.players.map((player) => this.toElement(player)).forEach((
        element,
      ) => this.playersListElement?.append(element));
    }

    toElement(player: { label: string }): HTMLElement {
      const div = document.createElement("div");
      div.innerHTML = player.label;
      return div;
    }
  }

  cr.define("app-game-info", GameInfoComponentImpl);
}
