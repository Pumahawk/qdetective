export interface DiceViewModel {
  dice: number | null;
}

export const diceComponentEvents = {
  diceRoll: "diceroll",
};

export interface DiceViewComponent extends Element {
  update(model: DiceViewModel): void;
}

export function DiceViewComponentF(cr: CustomElementRegistry) {
  class DiceViewComponentImpl extends HTMLElement implements DiceViewComponent {
    diceNumberElement?: HTMLElement;

    constructor() {
      super();
    }

    update(model: DiceViewModel): void {
      if (this.diceNumberElement && model.dice != null) {
        this.diceNumberElement.innerText = String(model.dice);
      }
    }

    connectedCallback() {
      this.innerHTML = `
<button id="roll-dice-button">X</button>
<div id="roll-dice-label"></div>
`;
      this.querySelector("#roll-dice-button")?.addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("diceroll"));
      });
      this.diceNumberElement = this.querySelector("#roll-dice-label")!;
    }
  }
  cr.define("dice-component", DiceViewComponentImpl);
}
