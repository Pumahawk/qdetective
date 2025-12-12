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

export interface ItemsViewComponent extends HTMLElement {
  update(model: ItemsViewModel): void;
}

export function ItemsViewComponentF(cr: CustomElementRegistry) {
  class ItemsViewComponentImpl extends HTMLElement
    implements ItemsViewComponent {
    peopleUl?: HTMLUListElement;
    objectsUl?: HTMLUListElement;
    roomsUl?: HTMLUListElement;

    constructor() {
      super();
    }

    update(model: ItemsViewModel): void {
      updateList(this.peopleUl, "people", model.players, model.players);
      updateList(this.objectsUl, "objects", model.objects, model.players);
      updateList(this.roomsUl, "rooms", model.rooms, model.players);
      console.log("update items model");
    }

    connectedCallback() {
      this.innerHTML = `
<ul id="people-ul"></ul>
<ul id="objects-ul"></ul>
<ul id="rooms-ul"></ul>
`;
      this.peopleUl = this.querySelector("people-ul")!;
      this.objectsUl = this.querySelector("objects-ul")!;
      this.roomsUl = this.querySelector("rooms-ul")!;
    }
  }
  cr.define("items-component", ItemsViewComponentImpl);
}

function updateList(
  ul: HTMLUListElement | undefined,
  id: string,
  elements: PlayerInfo[],
  players: PlayerInfo[],
): void {
  if (!ul) {
    return;
  }
  ul.innerHTML = "";
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

export interface ItemSelectionViewComponent extends HTMLElement {
  update(model: ItemSelectionModel): void;
}

export function ItemSelectionViewComponentF(cr: CustomElementRegistry) {
  class ItemSelectionViewComponentImpl extends HTMLElement
    implements ItemSelectionViewComponent {
    personSelection?: HTMLSelectElement;
    objectSelection?: HTMLSelectElement;
    roomSelection?: HTMLSelectElement;
    form?: HTMLFormElement;

    constructor() {
      super();
    }

    update(model: ItemSelectionModel): void {
      updateSelectionElement(this.personSelection, model.people);
      updateSelectionElement(this.objectSelection, model.objects);
      updateSelectionElement(this.roomSelection, model.rooms);
    }

    connectedCallback() {
      this.innerHTML = `
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

      this.personSelection = this.querySelector("#personselection")!;
      this.objectSelection = this.querySelector("#objectselection")!;
      this.roomSelection = this.querySelector("#roomselection")!;
      this.form = this.querySelector("#itemselectionform")!;

      this.form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.dispatchEvent(
          new CustomEvent<ConfirmDataItemSelection>("itemselectionform", {
            detail: {
              person: { label: this.personSelection?.value ?? "undefined" },
              object: { label: this.objectSelection?.value ?? "undefined" },
              room: { label: this.roomSelection?.value ?? "undefined" },
            },
          }),
        );
      });
    }
  }
  cr.define("item-selection-component", ItemSelectionViewComponentImpl);
}

function updateSelectionElement<T extends Element>(
  element: T | undefined,
  items: ItemInfo[],
) {
  if (element != undefined) {
    items.map((e, i) => itemInfoToOptionElement(i, e)).forEach(
      (e) => element?.appendChild(e),
    );
  }
}

function itemInfoToOptionElement(i: number, item: ItemInfo): HTMLOptionElement {
  const option = document.createElement("option");
  option.value = String(i);
  option.innerText = item.label;
  return option;
}
