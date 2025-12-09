export interface ItemInfo {
  label: string;
}

export interface PlayerInfo {
  label: string;
}

export interface ItemsViewModel {
  players: PlayerInfo[];
  people: ItemInfo[];
  objects: ItemInfo[];
  rooms: ItemInfo[];
}

export class ItemsViewComponent {
  model: ItemsViewModel;
  element: Element;

  constructor(element: Element, model: ItemsViewModel) {
    this.element = element;
    this.model = model;

    const peopleUl = createList(
      "people",
      this.model.players,
      this.model.players,
    );
    const objectsUl = createList(
      "objects",
      this.model.objects,
      this.model.players,
    );
    const roomsUl = createList("rooms", this.model.rooms, this.model.players);
    this.element.replaceChildren(peopleUl, objectsUl, roomsUl);
  }

  async connectedCallback() {
  }
}

function createList(id: string, elements: PlayerInfo[], players: PlayerInfo[]) {
  const ul = document.createElement("ul");
  ul.id = id;
  elements.forEach((obj) => {
    const li = document.createElement("li");
    const label = document.createElement("span");
    label.textContent = obj.label;
    li.appendChild(label);
    players.forEach((p) => {
      const label = document.createElement("label");
      label.style.padding = "2px";
      label.textContent = p.label;
      li.appendChild(label);
      const select = document.createElement("select");
      select.innerHTML = `
      <option id="1">possiede</option>
      <option id="2">non possiede</option>
      <option id="3">forse possiede</option>
      <option id="4">non ancora chiesto</option>
`;
      li.appendChild(select);
    });
    ul.appendChild(li);
  });
  return ul;
}
