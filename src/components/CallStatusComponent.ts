const playerListElementId = "players-list";
const objectNameElementId = "object-name";
const confirmElementId = "continue";

export interface CallStatusModel {
  players: { id: string; status: number }[];
  item: { id: string } | undefined;
}

export interface CallStatusComponent extends HTMLElement {
  onContinue: () => void;

  update(model: CallStatusModel): void;
}

export function CallStatusComponentF(cr: CustomElementRegistry) {
  class CallStatusComponentImpl extends HTMLElement
    implements CallStatusComponent {
    playerListElement: HTMLElement | undefined;
    objectNameElement: HTMLElement | undefined;

    onContinue = () => {};

    constructor() {
      super();
    }

    connectedCallback() {
      if (this.shadowRoot) return;
      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.innerHTML = `
<div id="${playerListElementId}"></div>
<div>
  <div>image..</div>
  <div id="${objectNameElementId}"></div>
</div>
<div>
  <button id="${confirmElementId}" type="button">Continue</button>
</div>
`;

      this.playerListElement = shadowRoot.getElementById(playerListElementId)!;
      shadowRoot.getElementById(confirmElementId)!.onclick = (e) => {
        e.preventDefault();
        this.onContinue();
      };
      this.objectNameElement = shadowRoot.getElementById(objectNameElementId)!;
    }

    update(model: CallStatusModel) {
      this.playerListElement?.replaceChildren();
      model.players.map((player) => this.toElement(player)).forEach((el) =>
        this.playerListElement?.append(el)
      );
    }

    toElement({ status }: { status: number }): HTMLElement {
      const div = document.createElement("div");
      const imag = document.createElement("span");
      imag.innerText = "img...";
      const statusElement = document.createElement("span");
      statusElement.innerText = String(status);
      div.append(imag, statusElement);
      return div;
    }
  }
  cr.define("app-call-status", CallStatusComponentImpl);
}
