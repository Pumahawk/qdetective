import {
  type CallStatusComponent,
  CallStatusComponentF,
} from "./components/CallStatusComponent.ts";
import {
  type DiceRollComponent,
  DiceRollComponentF,
} from "./components/DiceRollComponent.ts";
import {
  type GameInfoComponent,
  GameInfoComponentF,
} from "./components/GameInfoComponent.ts";
import {
  type GameListComponent,
  GameListComponentF,
} from "./components/GameListComponent.ts";
import {
  type GameSetupComponent,
  GameSetupComponentF,
} from "./components/GameSetupComponent.ts";
import {
  type ItemSelectionComponent,
  ItemSelectionComponentF,
} from "./components/ItemSelectionComponent.ts";
import { ServerSetupComponentF } from "./components/ServerSetupComponent.ts";
import "./style.css";

// const players: { [id: string]: PlayerBoardModel } = {
//   p0: { id: "p0", position: [0, 0], asset: 0 },
//   p1: { id: "p1", position: [1, 0], asset: 1 },
//   p2: { id: "p2", position: [2, 0], asset: 2 },
//   p3: { id: "p3", position: [0, 17], asset: 3 },
//   p4: { id: "p4", position: [7, 24], asset: 4 },
//   p5: { id: "p5", position: [24, 18], asset: 5 },
//   p6: { id: "p6", position: [24, 6], asset: 6 },
//   p7: { id: "p7", position: [15, 0], asset: 7 },
//   p8: { id: "p8", position: [8, 0], asset: 8 },
// };

// const appModel: AppModel = {
//   playerState: "wait",
//
//   itemSelectionModel: {
//     people: [],
//     objects: [],
//     rooms: [],
//   },
//
//   itemsViewModel: {
//     players: [
//       { label: "pl1" },
//       { label: "pl2" },
//       { label: "pl3" },
//       { label: "pl4" },
//     ],
//     people: [],
//     objects: [
//       { label: "corda" },
//       { label: "tubo di piombo" },
//       { label: "pugnale" },
//       { label: "chiave inglese" },
//       { label: "candeliere" },
//       { label: "rivoltella" },
//     ],
//     rooms: [
//       { label: "Cucina" },
//       { label: "Sala da ballo" },
//       { label: "Serra" },
//       { label: "Sala da pranzo" },
//       { label: "Sala da biliardo" },
//       { label: "Biblioteca" },
//       { label: "Veranda" },
//       { label: "Anticamera" },
//       { label: "Studio" },
//     ],
//   },
//
//   diceViewModel: {
//     dice: null,
//   },
//
//   boardModel: {
//     players: Object.values(players),
//     selection: [],
//     highlight: findNearValidPlayerBlock(
//       getMap(),
//       players.p8.position[0],
//       players.p8.position[1],
//     ).map((
//       [x, y],
//     ) => ({ position: [x, y] })),
//   },
// };

ServerSetupComponentF(customElements);
GameListComponentF(customElements);
GameSetupComponentF(customElements);
GameInfoComponentF(customElements);
DiceRollComponentF(customElements);
ItemSelectionComponentF(customElements);
CallStatusComponentF(customElements);

const appElement = document.querySelector<HTMLDivElement>("#app")!;

appElement.innerHTML = `
<style>
.cplist {
  display: flex; 
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.cp {
  width: fit-content;
  margin-bottom: 20px;
}

.cpheader {
  padding: 5px;
  background: red;
  margin-bottom: 20px;
}
</style>

<div class="cplist">
  <div class="cpheader">app-game-list</div>
  <app-game-list class="cp"></app-game-list>

  <div class="cpheader">app-server-setup</div>
  <app-server-setup class="cp"></app-server-setup>

  <div class="cpheader">app-server-setup</div>
  <app-server-setup class="cp"></app-server-setup>

  <div class="cpheader">game-setup</div>
  <game-setup class="cp"></game-setup>

  <div class="cpheader">app-game-info</div>
  <app-game-info class="cp" name="firt game"></app-game-info>

  <div class="cpheader">app-dice-roll</div>
  <app-dice-roll class="cp" dice-number="12"></app-dice-roll>

  <div class="cpheader">app-item-selection</div>
  <app-item-selection class="cp"></app-item-selection>

  <div class="cpheader">app-call-status</div>
  <app-call-status class="cp"></app-call-status>
</div>
`;

const gameList = document.querySelector<GameListComponent>("app-game-list");
gameList?.update({
  games: [
    { id: "1", label: "First game" },
  ],
});

gameList!.onNewGameAction = () => {
  console.log("Start new game action");
};
gameList!.onOpenGame = (id) => {
  console.log("Open game", id);
};

const gameSetup = document.querySelector<GameSetupComponent>("game-setup")!;
gameSetup.onConfirm = () => {
  console.log("Confirmation user");
};

const gameInfo = document.querySelector<GameInfoComponent>("app-game-info")!;
gameInfo.update({
  players: [
    { label: "player-1" },
    { label: "player-2" },
  ],
});

gameInfo.onJoin = () => {
  console.log("On join event");
};

gameInfo.onShare = () => {
  console.log("On share event");
};

const diceRollElement = document.querySelector<DiceRollComponent>(
  "app-dice-roll",
)!;
diceRollElement.onConfirm = () => {
  console.log("Dice roll on confirm");
};

const itemSelectionElement = document.querySelector<ItemSelectionComponent>(
  "app-item-selection",
)!;
itemSelectionElement.update({
  groups: [
    { id: "group1", items: [{ id: "card1", label: "Firt card" }] },
    {
      id: "group2",
      items: [{ id: "card2", label: "Second card" }, {
        id: "card3",
        label: "Plus card",
      }],
    },
  ],
});

itemSelectionElement.onConfirm = (e) => {
  console.log("elements selected", e);
};

const callStatus = document.querySelector<CallStatusComponent>(
  "app-call-status",
)!;

callStatus?.update({
  item: undefined,
  players: [
    { id: "player1", status: 0 },
    { id: "player2", status: 1 },
    { id: "player2", status: 2 },
  ],
});

callStatus.onContinue = () => {
  console.log("Continue action");
};
