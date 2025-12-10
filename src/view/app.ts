import { type BoardModel, BoardViewComponent } from "./board.ts";
import { DiceViewComponent, type DiceViewModel } from "./dice.ts";
import {
  type ItemSelectionModel,
  ItemSelectionViewComponent,
  ItemsViewComponent,
  type ItemsViewModel,
} from "./items.ts";

type PlayerState = "dice" | "move" | "call" | "wait" | "view" | "call-response";

export interface AppModel {
  playerState: PlayerState;
  itemSelectionModel: ItemSelectionModel;
  itemsViewModel: ItemsViewModel;
  boardModel: BoardModel;
  diceViewModel: DiceViewModel;
}

export class AppComponent {
  model: AppModel;
  element: Element;

  diceComponent?: DiceViewComponent;
  boardComponent?: BoardViewComponent;
  itemSelectionComponent?: ItemSelectionViewComponent;
  itemsComponent?: ItemsViewComponent;

  constructor(element: Element, model: AppModel) {
    this.model = model;
    this.element = element;
    this.draw();
  }

  update(model: AppModel) {
    this.model = model;
    this.draw();
  }

  draw() {
    this.element.innerHTML = `
  <div>
    <div id="dice-component"></div>
    <div id="board-component"></div>
    <div id="item-selection-component"></div>
    <div id="items-component"></div>
  </div>
`;
    this.drawDiceComponent();
    this.drawBoardComponent();
    this.drawItemSelectionComponent();
    this.drawItemsComponent();
    this.drawItemsComponent();
  }

  drawDiceComponent() {
    const el = this.element.querySelector("#dice-component")!;
    this.diceComponent = new DiceViewComponent(
      el,
      this.model.diceViewModel,
    );
    el.addEventListener("rolldice", (e) => this.element.dispatchEvent(e));
  }

  drawBoardComponent() {
    const el = this.element.querySelector("#board-component")!;
    this.boardComponent = new BoardViewComponent(
      el,
      this.model.boardModel,
    )!;
    el.addEventListener("blockclicked", (e) => this.element.dispatchEvent(e));
  }

  drawItemSelectionComponent() {
    const el = this.element.querySelector(
      "#item-selection-component",
    )!;
    this.itemSelectionComponent = new ItemSelectionViewComponent(
      el,
      this.model.itemSelectionModel,
    );
    el.addEventListener(
      "itemselectionform",
      (e) => this.element.dispatchEvent(e),
    );
  }

  drawItemsComponent() {
    this.itemsComponent = new ItemsViewComponent(
      this.element.querySelector("#items-component")!,
      this.model.itemsViewModel,
    );
  }
}
