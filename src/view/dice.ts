export interface DiceViewModel {
  dice: number | null;
}
export class DiceViewComponent {
  element: Element;
  model: DiceViewModel;

  constructor(element: Element, model: DiceViewModel) {
    this.element = element;
    this.model = model;
    this.draw();
  }

  update(model: DiceViewModel) {
    this.model = model;
    this.draw();
  }

  draw() {
    this.element.innerHTML = `
<div>
  <button id="roll-dice">X</button>
  <div>${this.model.dice ?? "undefined"}</div>
</div>
`;
    this.element.querySelector("#roll-dice")?.addEventListener("click", () => {
      this.element.dispatchEvent(new CustomEvent("rolldice"));
    });
  }
}
