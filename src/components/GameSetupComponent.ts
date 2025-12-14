const playerAssetSize = 16;
const scale = 3;
export interface GameSetupModel {}

export interface GameSetupComponent extends HTMLElement {
  onConfirm(): void;
}

export function GameSetupComponentF(cr: CustomElementRegistry) {
  class GameSetupComponentImpl extends HTMLElement
    implements GameSetupComponent {
    onConfirm = () => {};

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
  <input type="text" placeholder="Game name">
  <div>
      <div class="player-img-conainer">
        <image class="player-img">
      </div>
    <select>
      <option>Player 1</option>
    </select>
  </div>
  <div>
    <input type="text" placeholder="Player name">
  </div>
  <div>
    <button type="submit">Create</button>
</form>
`;

      const form = this.shadowRoot!.querySelector("form")!;
      form.onsubmit = (e) => {
        e.preventDefault();
        this.onConfirm();
      };
    }
  }

  cr.define("game-setup", GameSetupComponentImpl);
}
