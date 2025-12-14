import { AppController } from "../controllers/index.ts";
import type { GameService } from "../services/index.ts";
import {
  boardComponentEvents,
  type BoardModel,
  type BoardViewComponent,
  type ClickedBoardEvent,
} from "./board.ts";
import {
  diceComponentEvents,
  type DiceViewComponent,
  type DiceViewModel,
} from "./dice.ts";
import {
  type ConfirmDataItemSelection,
  type ItemSelectionViewComponent,
  type ItemsViewComponent,
  type ItemsViewModel,
  type ItemToShowViewComponent,
} from "./items.ts";

export interface ItemsSelectedModel {
  person: string;
  object: string;
  room: string;
}

export interface AppModel {
  gameFase: "play" | "item-selection";
  playFase: "dice" | "move" | "call";
  showItems: boolean;
  movements: number;
  diceModel: DiceViewModel;
  boardModel: BoardModel;
  activePlayerId: string;
  callPlayerId: string | null;
  items: ItemsViewModel;
  itemSelected: ItemsSelectedModel | null;
  itemShowed: string | null;
  itemsToShow: string[];
}

export interface AppComponent extends HTMLElement {
}

export function AppComponenF(
  cr: CustomElementRegistry,
  gameService: GameService,
  appController: AppController,
) {
  class AppComponentImpl extends HTMLElement implements AppComponent {
    diceComponent?: DiceViewComponent;
    boardComponent?: BoardViewComponent;
    itemSelectionComponent?: ItemSelectionViewComponent;
    itemToShowComponent?: ItemToShowViewComponent;
    itemsComponent?: ItemsViewComponent;

    constructor() {
      super();
    }

    connectedCallback() {
      this.innerHTML = `
<dice-component></dice-component>
<board-component></board-component>
<item-selection-component></item-selection-component>
<items-component></items-component>
<items-to-show></items-to-show>
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

      this.initDiceComponent();
      this.initBoardComponent();
      this.initItemsComponent();
      this.initItemsSelectionComponent();
      this.initItemToShowComponent();
      this.initGameModel();
    }

    private initBoardComponent() {
      this.boardComponent?.addEventListener(
        boardComponentEvents.assetsLoaded,
        () => {
          const model = gameService.getAppModel().boardModel;
          this.boardComponent?.update(model);
        },
      );
      this.boardComponent?.addEventListener(
        boardComponentEvents.boardClicked,
        (e) => this.clickOnBoardHandler(e as CustomEvent<ClickedBoardEvent>),
      );
    }

    private initItemsComponent() {
      const model = gameService.initItemComponentModel();
      console.log("init items component");
      this.itemsComponent?.update(model);
    }

    private initItemsSelectionComponent() {
      this.itemSelectionComponent = this.querySelector<
        ItemSelectionViewComponent
      >("item-selection-component")!;
      console.log("register");
      this.itemSelectionComponent.addEventListener(
        "itemselectionform",
        (event) => {
          console.log("itemselectionform");
          appController.submitItemSelection(
            (event as CustomEvent<ConfirmDataItemSelection>).detail,
          );
        },
      );
    }

    private initItemToShowComponent() {
      this.itemToShowComponent = this.querySelector<
        ItemToShowViewComponent
      >("items-to-show")!;
      this.itemToShowComponent.onitemsubmit = (id) => {
        appController.submitItemToShow(id);
      };
    }

    private initGameModel() {
      const appModel = gameService.getAppModel();
      this.render(appModel);
    }

    private initDiceComponent() {
      this.diceComponent?.addEventListener(
        diceComponentEvents.diceRoll,
        () => this.rollDiceHandler(),
      );
    }

    private render(appModel: AppModel) {
      this.renderDiceComponent(appModel);
      this.renderBoardCompoent(appModel);
      this.renderItemsComponent(appModel);
      this.renderItemSelectionComponent(appModel);
      this.renderItemToShow(appModel);
    }

    private renderDiceComponent(appModel: AppModel) {
      console.log("render dice");
      console.log("component model", appModel);
      if (!isShowDice(appModel)) {
        console.log("is not show dice");
        this.diceComponent?.setAttribute(
          "hidden",
          "true",
        );
      } else {
        console.log("is show dice");
        this.diceComponent?.removeAttribute("hidden");
      }
      this.diceComponent?.update(appModel.diceModel);
    }

    private renderBoardCompoent(appModel: AppModel) {
      this.boardComponent?.update(appModel.boardModel);
    }

    private renderItemsComponent(appModel: AppModel) {
      this.itemsComponent?.setAttribute(
        "hiddend",
        this.isShowItems(appModel) ? "false" : "true",
      );
    }

    private renderItemSelectionComponent(_: AppModel) {
    }

    private renderItemToShow(appModel: AppModel) {
      this.itemToShowComponent?.update({ items: appModel.itemsToShow });
    }

    private rollDiceHandler() {
      console.log("dice roll");
      const appModel = appController.rollDice();
      this.render(appModel);
    }

    private clickOnBoardHandler(e: CustomEvent<ClickedBoardEvent>) {
      const [x, y] = e.detail.position;
      const appModel = appController.clickOnBoard(x, y);
      this.render(appModel);
    }

    private isShowItems(appModel: AppModel): boolean {
      return appModel.showItems;
    }
  }
  cr.define("app-component", AppComponentImpl);
}

function isShowDice(appModel: AppModel): boolean {
  return appModel.gameFase == "play" &&
    appModel.playFase == "dice";
}
