import type { GameService } from "../services/index.ts";
import { type BoardModel, type BoardViewComponent } from "./board.ts";
import { type DiceViewComponent, type DiceViewModel } from "./dice.ts";
import {
  type ItemSelectionModel,
  type ItemSelectionViewComponent,
  type ItemsViewComponent,
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

export interface AppComponent extends HTMLElement {
  update(mode: AppModel): void;
}

export function AppComponenF(
  cr: CustomElementRegistry,
  gameService: GameService,
) {
  class AppComponentImpl extends HTMLElement implements AppComponent {
    diceComponent?: DiceViewComponent;
    boardComponent?: BoardViewComponent;
    itemSelectionComponent?: ItemSelectionViewComponent;
    itemsComponent?: ItemsViewComponent;

    constructor() {
      super();
    }

    update(_: AppModel) {
    }

    connectedCallback() {
      this.innerHTML = `
<dice-component></dice-component>
<board-component></board-component>
<item-selection-component></item-selection-component>
<items-component></items-component>
`;

      this.diceComponent = this.querySelector<DiceViewComponent>(
        "dice-component",
      )!;
      this.boardComponent = this.querySelector<BoardViewComponent>(
        "board-component",
      )!;
      this.itemsComponent = this.querySelector<ItemsViewComponent>(
        "items-component",
      )!;
      this.itemSelectionComponent = this.querySelector<
        ItemSelectionViewComponent
      >("itemselection-component")!;
    }
  }
  cr.define("app-component", AppComponentImpl);
}
