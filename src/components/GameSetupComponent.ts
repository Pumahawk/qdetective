type GameListMode = "create" | "join";

const playerAssetSize = 16;
const scale = 3;

export type OnConfirmType = (value: {
  mode: GameListMode;
  playerAsset: string;
  playerName: string;
  gameName: string | null;
}) => void;

export interface GameSetupComponent extends HTMLElement {
  onConfirm: undefined | OnConfirmType;
}

export function GameSetupComponentF(cr: CustomElementRegistry) {
  class GameSetupComponentImpl extends HTMLElement
    implements GameSetupComponent {
    onConfirm: undefined | OnConfirmType = undefined;

    newGameModeElement: HTMLElement | undefined;
    onSubmitButton: HTMLElement | undefined;
    submitButton: HTMLElement | undefined;
    gameNameIdElement: HTMLElement | undefined;

    mode: GameListMode = "join";

    static observedAttributes = ["mode"];

    constructor() {
      super();
    }

    attributeChangedCallback(name: string, _: string, newValue: string) {
      switch (name) {
        case "mode":
          if (newValue) this.onUpdateMode(newValue as GameListMode);
          break;
      }
    }

    connectedCallback() {
      if (this.shadowRoot) return;
      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.innerHTML = `
<style>
.player-img-conainer {
  width: ${playerAssetSize * scale}px;
  height: ${playerAssetSize * scale}px;
}
.player-img {
  width: ${playerAssetSize}px;
  height: ${playerAssetSize}px;

  transform: scale(${scale});
  transform-origin: top left;

  background-image: url("/players.png");
  background-size: 48px 48px;

  background-position: 0px 0px;

  image-rendering: pixelated;
}
</style>
<form>
  <div id="new-game-section">
    <input id="game-name-id" name="gameName" type="text" placeholder="Game name" required>
  </div>
  <div>
      <div class="player-img-conainer">
        <image class="player-img">
      </div>
    <select name="playerAsset">
      <option value="1">Player 1</option>
    </select>
  </div>
  <div>
    <input name="playerName" type="text" placeholder="Player name" required>
  </div>
  <div>
    <button id="submit-button" type="submit">Join</button>
</form>
`;

      this.newGameModeElement = this.shadowRoot!.getElementById(
        "new-game-section",
      )!;
      this.submitButton = this.shadowRoot!.getElementById("submit-button")!;
      this.gameNameIdElement = this.shadowRoot!.getElementById("game-name-id")!;

      this.onUpdateMode(
        this.getAttribute("mode")?.toString() as GameListMode,
      );

      const form = this.shadowRoot!.querySelector("form")!;
      form.onsubmit = (e) => {
        e.preventDefault();
        const data = new FormData(form);
        if (this.onConfirm) {
          this.onConfirm({
            mode: this.mode,
            gameName: data.get("gameName")?.toString() ?? null,
            playerName: data.get("playerName")!.toString(),
            playerAsset: data.get("playerAsset")!.toString(),
          });
        }
      };
    }

    private onUpdateMode(mode: GameListMode) {
      this.mode = mode;
      if (mode == "create") {
        this.newGameModeElement?.removeAttribute("hidden");
        this.gameNameIdElement?.setAttribute("required", "");
        if (this.submitButton) this.submitButton.innerHTML = "Create";
      } else {
        this.newGameModeElement?.setAttribute("hidden", "");
        this.gameNameIdElement?.removeAttribute("required");
        if (this.submitButton) this.submitButton.innerText = "Join";
      }
    }
  }

  cr.define("app-game-setup", GameSetupComponentImpl);
}
