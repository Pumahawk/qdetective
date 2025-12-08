export class ItemsViewComponent extends HTMLElement {
  static define(registry: CustomElementRegistry): void {
    registry.define("items-component", ItemsViewComponent);
  }

  constructor() {
    super();

    const players = [
      "pl1",
      "pl2",
      "pl3",
      "pl4",
    ];

    const people = [
      "Miss Scarlet",
      "Professor Plum",
      "Colonnello Mustard",
      "Dottor Green",
      "Signora Bianchi",
      "Signora Peacock",
    ];

    const objects = [
      "corda",
      "tubo di piombo",
      "pugnale",
      "chiave inglese",
      "candeliere",
      "rivoltella",
    ];

    const rooms = [
      "Cucina",
      "Sala da ballo",
      "Serra",
      "Sala da pranzo",
      "Sala da biliardo",
      "Biblioteca",
      "Veranda",
      "Anticamera",
      "Studio",
    ];

    const peopleUl = createList("people", people, players);
    const objectsUl = createList("objects", objects, players);
    const roomsUl = createList("rooms", rooms, players);
    this.replaceChildren(peopleUl, objectsUl, roomsUl);
  }

  async connectedCallback() {
  }
}

function createList(id: string, elements: string[], players: string[]) {
  const ul = document.createElement("ul");
  ul.id = id;
  elements.forEach((obj) => {
    const li = document.createElement("li");
    const label = document.createElement("span");
    label.textContent = obj;
    li.appendChild(label);
    players.forEach((p) => {
      const label = document.createElement("label");
      label.style.padding = "2px";
      label.textContent = p;
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
