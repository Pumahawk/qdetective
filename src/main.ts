import "./style.css";
import { BoardViewComponent } from "./view/board.ts";
import { ItemsViewComponent } from "./view/items.ts";

customElements.define(BoardViewComponent.name, BoardViewComponent);
customElements.define(ItemsViewComponent.name, ItemsViewComponent);

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <board-component></board-component>
    <items-component></items-component>
  </div>
`;

