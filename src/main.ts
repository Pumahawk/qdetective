import "./style.css";
import {
  type BoardModel,
  BoardViewComponent,
  type ClickedBoardEvent,
  type PlayerBoardModel,
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

const players: { [id: string]: PlayerBoardModel } = {
  p0: { id: "p0", position: [0, 0], asset: 0 },
  p1: { id: "p1", position: [1, 0], asset: 1 },
  p2: { id: "p2", position: [2, 0], asset: 2 },
  p3: { id: "p3", position: [3, 0], asset: 3 },
  p4: { id: "p4", position: [4, 0], asset: 4 },
  p5: { id: "p5", position: [5, 0], asset: 5 },
  p6: { id: "p6", position: [6, 0], asset: 6 },
  p7: { id: "p7", position: [7, 0], asset: 7 },
  p8: { id: "p8", position: [8, 0], asset: 8 },
};

const boardModel: BoardModel = {
  players: Object.values(players),
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
    console.log("selected: ", boardModel.selection);
    if (
      !boardModel.selection.find((s) =>
        s.position[0] == x && s.position[1] == y
      )
    ) {
      boardModel.selection.push({ position: [x, y] });
    }
    players.p8.position = [x, y];
    boardModel.players = Object.values(players);
    boardComponent.updateModel(boardModel);
  },
);
