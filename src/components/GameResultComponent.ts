export interface GameResultModel {
  items: [string, string, string];
  players: {
    id: string;
    status: number;
    items: string[];
  }[];
}

export interface GameResultComponent extends HTMLElement {
  update(model: GameResultModel): void;
}
export function GameResultComponentF(cr: CustomElementRegistry) {
  class GameResultComponentImpl extends HTMLElement
    implements GameResultComponent {
    gameResultElement: HTMLElement | undefined;
    obj0Element: HTMLElement | undefined;
    obj1Element: HTMLElement | undefined;
    obj2Element: HTMLElement | undefined;
    playerResultElement: HTMLElement | undefined;
    playersElement: HTMLElement | undefined;
    userTimesListElement: HTMLElement | undefined;

    model: GameResultModel | undefined;

    constructor() {
      super();
    }

    connectedCallback() {
      if (this.shadowRoot) return;
      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.innerHTML = `
<div id="game-result">
  <div>
    <div id="obj1"></div>
    <div id="obj2"></div>
    <div id="obj3"></div>
  </div>
  <div id="players"></div>
</div>
<div id="player-result" hidden>
  <button id="back-to-players" type="button">Back</button>
  <div id="user-items-list"></div>
</div>
`;

      this.gameResultElement = shadowRoot.getElementById("game-result")!;
      this.obj0Element = shadowRoot.getElementById("obj1")!;
      this.obj1Element = shadowRoot.getElementById("obj2")!;
      this.obj2Element = shadowRoot.getElementById("obj3")!;

      this.playerResultElement = shadowRoot.getElementById("player-result")!;
      this.playersElement = shadowRoot.getElementById("players")!;
      this.userTimesListElement = shadowRoot.getElementById("user-items-list")!;
      shadowRoot.getElementById("back-to-players")!.onclick = () => {
        this.gameResultElement?.removeAttribute("hidden");
        this.playerResultElement?.setAttribute("hidden", "");
      };
    }

    update(model: GameResultModel) {
      this.model = model;
      if (this.obj0Element) this.obj0Element.innerHTML = model.items[0];
      if (this.obj1Element) this.obj1Element.innerHTML = model.items[1];
      if (this.obj2Element) this.obj2Element.innerHTML = model.items[2];
      this.playersElement?.replaceChildren();
      model.players.map((player) => this.playerToElement(player)).forEach((
        el,
      ) => this.playersElement?.append(el));
    }

    playerToElement(player: { id: string }): HTMLElement {
      const div = document.createElement("div");
      div.innerHTML = "player: " + player.id;
      div.onclick = () => {
        this.showPlayerHandler(player.id);
      };
      return div;
    }

    private showPlayerHandler(id: string): void {
      this.gameResultElement?.setAttribute("hidden", "");
      this.playerResultElement?.removeAttribute("hidden");

      this.userTimesListElement?.replaceChildren();
      this.model?.players.find((player) => player.id === id)?.items.map((
        item,
      ) => this.itemsToElement({ id: item })).forEach((el) =>
        this.userTimesListElement?.append(el)
      );
    }

    private itemsToElement(item: { id: string }) {
      const div = document.createElement("div");
      div.innerText = "item: " + item.id;
      return div;
    }
  }
  cr.define("app-game-result", GameResultComponentImpl);
}
