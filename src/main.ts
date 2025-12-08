import "./style.css";
import {
  type BoardModel,
  BoardViewComponent,
  type ClickedBoardEvent,
} from "./view/board.ts";
import type { DefineComponentFunc } from "./view/index.ts";
import { ItemsViewComponent } from "./view/items.ts";

const customComponents: DefineComponentFunc[] = [
  BoardViewComponent.define,
  ItemsViewComponent.define,
];

customComponents.forEach((c) => c(customElements));

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <board-component></board-component>
    <items-component></items-component>
  </div>
`;

const boardModel: BoardModel = {
  players: [{ id: "p1", position: [10, 10], asset: "red" }],
  selection: [],
};
const boardComponent = document.querySelector<BoardViewComponent>(
  "board-component",
);
boardComponent!.updateModel(
  boardModel,
);

boardComponent?.addEventListener(
  "blockclicked",
  (event) => {
    const [x, y] = (event as CustomEvent<ClickedBoardEvent>).detail.position;
    console.log(
      `Block cliccked [${x}, ${y}]`,
    );
  },
);
