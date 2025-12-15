const gameListElementId = "game-list";
const actionsElementId = "actions-bar";
const newGameButtonId = "new-game-button";

export interface GameListModel {
  games: {
    id: string;
    label: string;
  }[];
}

export interface GameListComponent extends HTMLElement {
  onNewGameAction: () => void;
  onOpenGame: (id: string) => void;
  update(model: GameListModel): void;
}

export function GameListComponentF(cr: CustomElementRegistry) {
  class GameListComponentImpl extends HTMLElement implements GameListComponent {
    gameListComponent: HTMLElement | undefined;
    onNewGameAction = () => {};
    onOpenGame = (_: string) => {};

    constructor() {
      super();
    }

    connectedCallback() {
      if (this.shadowRoot) return;
      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.innerHTML = `
<div id="${gameListElementId}"></div>
<div id="${actionsElementId}">
  <button type="button" id="${newGameButtonId}">New Game</button>
</div>
`;

      this.gameListComponent = shadowRoot.getElementById(gameListElementId)!;
      const newGameButtonElement = shadowRoot.getElementById(newGameButtonId)!;
      newGameButtonElement.onclick = () => {
        this.onNewGameAction();
      };
    }

    update(model: GameListModel) {
      this.gameListComponent?.replaceChildren();
      model.games.map((game) => this.toLabel(game)).forEach((div) =>
        this.gameListComponent?.append(div)
      );
    }

    toLabel(game: { id: string; label: string }): HTMLElement {
      const div = document.createElement("div");
      div.innerText = game.label;
      div.onclick = () => this.onOpenGame(game.id);
      return div;
    }
  }

  cr.define("app-game-list", GameListComponentImpl);
}
