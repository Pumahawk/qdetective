import { BaseComponent } from "./base.ts";
import { type BoardModel } from "./board.ts";
import { type DiceViewModel } from "./dice.ts";
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

export function AppComponenF(cr: CustomElementRegistry) {
  class AppComponent extends BaseComponent<AppModel> {
    diceComponent?: BaseComponent<DiceViewModel>;
    boardComponent?: BaseComponent<BoardModel>;
    itemSelectionComponent?: ItemSelectionViewComponent;
    itemsComponent?: ItemsViewComponent;

    constructor() {
      super();
    }

    updateInternalModel(_: AppModel): void {
    }

    connectedCallback() {
      this.innerHTML = `
<dice-component></dice-component>
<board-component></board-component>
<item-selection-component></item-selection-component>
<items-component></items-component>
`;

      this.loadComponent("dice-component", () => {});
      this.loadComponent("board-component", () => {});
      this.loadComponent("itemselection-component", () => {});
      this.loadComponent("items-component", () => {});
    }
  }
  cr.define("app-component", AppComponent);
}
