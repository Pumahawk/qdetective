export interface DiceViewModel {
  dice: number | null;
}
export class DiceViewComponent extends HTMLElement {
  model: DiceViewModel;

  static define(ce: CustomElementRegistry) {
    ce.define("dice-component", DiceViewComponent);
  }

  constructor() {
    super();
    this.model = { dice: null };
    this.draw();
  }

  update(model: DiceViewModel) {
    this.model = model;
    this.draw();
  }

  draw() {
    this.innerHTML = `
<div>
  <button id="roll-dice">X</button>
  <div>${this.model.dice ?? "undefined"}</div>
</div>
`;
    this.querySelector("#roll-dice")?.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("rolldice"));
    });
  }
}
