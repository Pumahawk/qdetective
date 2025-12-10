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

  draw() {}
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

export interface ConfirmDataItemSelection {
  person: ItemInfo;
  object: ItemInfo;
  room: ItemInfo;
}

export interface ItemSelectionModel {
  people: ItemInfo[];
  objects: ItemInfo[];
  rooms: ItemInfo[];
}

export class ItemSelectionViewComponent {
  element: Element;
  model: ItemSelectionModel;

  constructor(element: Element, model: ItemSelectionModel) {
    this.element = element;
    this.model = model;
    this.draw();
  }

  draw() {
    this.element.innerHTML = `
<form id="itemselectionform">
  <div>
    <div>Person</div>
    <div>
      <select id="personselection"></select>
    </div>
  </div>
  <div>
    <div>Object</div>
    <div>
      <select id="objectselection"></select>
    </div>
  </div>
  <div>
    <div>Room</div>
    <div>
      <select id="roomselection"></select>
    </div>
  </div>
  <div>
    <button type="submit">Confirm</button>
  </div>
</form>
`;

    const personSelection = createSelectionElement<HTMLSelectElement>(
      this.element.querySelector("#personselection")!,
      this.model.people,
    );
    const objectSelection = createSelectionElement<HTMLSelectElement>(
      this.element.querySelector("#objectselection")!,
      this.model.objects,
    );
    const roomSelection = createSelectionElement<HTMLSelectElement>(
      this.element.querySelector("#roomselection")!,
      this.model.rooms,
    );

    const form = this.element.querySelector("#itemselectionform")!;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.element.dispatchEvent(
        new CustomEvent<ConfirmDataItemSelection>("itemselectionform", {
          detail: {
            person: this.model.people[Number(personSelection.value)],
            object: this.model.people[Number(objectSelection.value)],
            room: this.model.people[Number(roomSelection.value)],
          },
        }),
      );
    });
  }
}

function createSelectionElement<T extends Element>(
  element: T,
  items: ItemInfo[],
) {
  items.map((e, i) => itemInfoToOptionElement(i, e)).forEach(
    (e) => element.appendChild(e),
  );
  return element;
}
function itemInfoToOptionElement(i: number, item: ItemInfo): HTMLOptionElement {
  const option = document.createElement("option");
  option.value = String(i);
  option.innerText = item.label;
  return option;
}
