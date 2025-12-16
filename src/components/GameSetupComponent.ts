const playerAssetSize = 16;
const scale = 3;

export type OnConfirmType = (value: {
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

    constructor() {
      super();
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
  <input name="gameName" type="text" placeholder="Game name" required>
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
    <button type="submit">Create</button>
</form>
`;

      const form = this.shadowRoot!.querySelector("form")!;
      form.onsubmit = (e) => {
        e.preventDefault();
        const data = new FormData(form);
        if (this.onConfirm) {
          this.onConfirm({
            gameName: data.get("gameName")?.toString() ?? null,
            playerName: data.get("playerName")!.toString(),
            playerAsset: data.get("playerAsset")!.toString(),
          });
        }
      };
    }
  }

  cr.define("app-game-setup", GameSetupComponentImpl);
}
