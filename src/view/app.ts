import { AppController } from "../controllers/index.ts";
import type { GameService } from "../services/index.ts";
import {
  boardComponentEvents,
  type BoardModel,
  type BoardViewComponent,
  type ClickedBoardEvent,
  type PlayerBoardModel,
} from "./board.ts";
import { diceComponentEvents, type DiceViewComponent } from "./dice.ts";
import {
  type ItemSelectionViewComponent,
  type ItemsViewComponent,
  type ItemsViewModel,
} from "./items.ts";

export interface AppModel {
  gameFase: "play";
  playFase: "dice" | "move" | "call";
  showItems: boolean;
  movements: number;
  boardModel: BoardModel;
  activePlayer: PlayerBoardModel;
  items: ItemsViewModel;
}

export interface AppComponent extends HTMLElement {
  update(mode: AppModel): void;
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
    itemsComponent?: ItemsViewComponent;

    appModel: AppModel;

    constructor() {
      super();
      this.appModel = gameService.getAppModel();
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
      >("items-selection-component")!;

      this.initDiceComponent();
      this.initBoardComponent();
      this.initItemsComponent();
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

    private initGameModel() {
      this.appModel = gameService.getAppModel();
      this.render();
    }

    private initDiceComponent() {
      this.diceComponent?.addEventListener(
        diceComponentEvents.diceRoll,
        () => this.rollDiceHandler(),
      );
    }

    private render() {
      this.renderDiceComponent();
      this.renderBoardCompoent();
      this.renderItemsComponent();
      this.renderItemSelectionComponent();
    }

    private renderDiceComponent() {
      if (!this.isShowDice()) {
        this.diceComponent?.setAttribute(
          "hidden",
          "true",
        );
      }
    }

    private renderBoardCompoent() {
      this.boardComponent?.update(this.appModel.boardModel);
    }

    private renderItemsComponent() {
      this.itemsComponent?.setAttribute(
        "hiddend",
        this.isShowItems() ? "false" : "true",
      );
    }

    private renderItemSelectionComponent() {
    }

    private rollDiceHandler() {
      console.log("dice roll");
      const randValue = appController.rollDice();
      this.diceComponent?.update({ dice: randValue });
      this.appModel.movements = randValue;
      this.startMoveFase();
    }

    private clickOnBoardHandler(e: CustomEvent<ClickedBoardEvent>) {
      if (this.isMoveFase()) {
        const [x, y] = e.detail.position;
        this.appModel = appController.movePlayer(x, y);
        this.render();
      }
    }

    private startMoveFase() {
      this.appModel.playFase = "move";
    }

    private isShowDice(): boolean {
      return this.appModel.gameFase == "play" &&
        this.appModel.playFase == "dice";
    }

    private isShowItems(): boolean {
      return this.appModel.showItems;
    }

    private isMoveFase(): boolean {
      return this.appModel.gameFase == "play" &&
        this.appModel.playFase == "move";
    }
  }
  cr.define("app-component", AppComponentImpl);
}
