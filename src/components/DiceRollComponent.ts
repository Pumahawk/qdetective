const buttonElementId = "confirm";
const diceNumberElementId = "dice-number";
export interface DiceRollModel {}

export interface DiceRollComponent extends HTMLElement {
  onConfirm(): void;
}

export function DiceRollComponentF(cr: CustomElementRegistry) {
  class DiceRollComponentImpl extends HTMLElement implements DiceRollComponent {
    diceNumberElement: HTMLElement | undefined;
    onConfirm = () => {};

    static observedAttributes = ["dice-number"];

    attributeChangedCallback(name: string, _: string, newValue: string) {
      console.log(name);
      switch (name) {
        case "dice-number":
          if (this.diceNumberElement) {
            this.diceNumberElement.innerHTML = newValue;
          }
          break;
      }
    }

    constructor() {
      super();
    }

    connectedCallback() {
      if (this.shadowRoot) return;
      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.innerHTML = `
<div>
  <div>Dice image... </div>
  <div id="${diceNumberElementId}"></div>
</div>
<button id="${buttonElementId}" type="button">Roll</button>
`;
      this.diceNumberElement = shadowRoot.getElementById(diceNumberElementId)!;
      this.diceNumberElement.innerHTML =
        this.getAttribute("dice-number")?.toString() ?? "0";

      shadowRoot.getElementById(buttonElementId)!.onclick = () => {
        this.onConfirm();
      };
    }
  }

  cr.define("app-dice-roll", DiceRollComponentImpl);
}
