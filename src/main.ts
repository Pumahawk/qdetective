import "./style.css";
import { BoardViewComponent } from "./view/board.ts";

customElements.define(BoardViewComponent.name, BoardViewComponent);

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <board-component></board-component>
`;

