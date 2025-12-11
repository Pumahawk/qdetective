import { BaseComponent } from "./base.ts";

export interface DiceViewModel {
  dice: number | null;
}
export function DiceViewComponentF(cr: CustomElementRegistry) {
  class DiceViewComponent extends BaseComponent<DiceViewModel> {
    diceNumberElement?: HTMLElement;

    constructor() {
      super();
    }

    updateInternalModel(model: DiceViewModel): void {
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
        this.dispatchEvent(new CustomEvent("rolldice"));
      });
      this.diceNumberElement = this.querySelector("#roll-dice-label")!;
    }
  }
  cr.define("dice-component", DiceViewComponent);
}
