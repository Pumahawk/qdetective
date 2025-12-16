import type { AppService } from "../services/AppService.ts";
import type { GameInfoComponent } from "./GameInfoComponent.ts";
import type { GameListComponent } from "./GameListComponent.ts";
import type { GameSetupComponent } from "./GameSetupComponent.ts";
import type { ServerSetupComponent } from "./ServerSetupComponent.ts";

export interface GameSetupRootComponent extends HTMLElement {
}

export function GameSetupRootComponentF(
  cr: CustomElementRegistry,
  appService: AppService,
) {
  class GameSetupRootComponentImpl extends HTMLElement
    implements GameSetupRootComponent {
    gameListElement: GameListComponent | undefined;
    serverSetupElement: ServerSetupComponent | undefined;
    gameInfoElement: GameInfoComponent | undefined;
    gameSetupElement: GameSetupComponent | undefined;

    serverAddress: string | null = null;

    constructor() {
      super();
    }

    connectedCallback() {
      if (this.shadowRoot) return;
      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.innerHTML = `
<style>
</style>
<div>
  <app-game-list hidden></app-game-list>
  <app-server-setup hidden></app-server-setup>
  <app-game-info hidden></app-game-info>
  <app-game-setup hidden></app-game-setup>
</div>
`;

      this.initGameListElement(shadowRoot);
      this.initServerSetupElement(shadowRoot);
      this.initGameInfoElement(shadowRoot);
      this.initGameSetup(shadowRoot);

      this.initFirstSetup();
    }

    private initGameListElement(shadowRoot: ShadowRoot): void {
      this.gameListElement = shadowRoot.querySelector<GameListComponent>(
        "app-game-list",
      )!;
      this.gameListElement.onNewGameAction = () => {
        this.gameListElement?.setAttribute("hidden", "");
        this.gameSetupElement?.removeAttribute("hidden");
      };
    }

    private initServerSetupElement(shadowRoot: ShadowRoot): void {
      this.serverSetupElement = shadowRoot.querySelector<ServerSetupComponent>(
        "app-server-setup",
      )!;
      this.serverSetupElement.onServerSelected = (address) => {
        appService.ping(address).then(() => {
          appService.redirectToServerPage(address);
        }).catch((reason) => {
          console.log(address + "is not a valid server.", reason);
          alert(address + " is not a valid server.");
        });
      };
    }

    private initGameInfoElement(shadowRoot: ShadowRoot): void {
      this.gameInfoElement = shadowRoot.querySelector<GameInfoComponent>(
        "app-game-info",
      )!;
    }

    private initGameSetup(shadowRoot: ShadowRoot): void {
      this.gameSetupElement = shadowRoot.querySelector<GameSetupComponent>(
        "app-game-setup",
      )!;
      this.gameSetupElement.onConfirm = (e) => {
        console.log("Confirm game creation", e);
        if (this.serverAddress) {
          appService.createGame(this.serverAddress, {
            gameName: e.gameName,
            playerName: e.playerName,
            playerAsset: e.playerAsset,
          }).then((id) => {
            console.log("Create game. Game id: ", id);
          }).catch((e) => {
            console.log("error on create game", e);
          });
        } else {
          console.error("this.serverAddress falsy");
        }
      };
    }

    private initFirstSetup(): void {
      const url = new URL(globalThis.window.location.href);
      const server = url.searchParams.get("server");
      if (!server) {
        console.log("serverSetupElement", this.serverSetupElement);
        this.serverSetupElement?.removeAttribute("hidden");
      } else {
        this.serverAddress = server;
        this.gameListElement?.removeAttribute("hidden");
        appService.getGameListFromServer(server).then((response) => {
          this.gameListElement?.update({
            games: response.status?.map((g) => ({ id: g.id, label: g.id })) ??
              [],
          });
        }).catch((e) => {
          console.log("Unable to retrieve game list", e);
        });
      }
    }
  }

  cr.define("app-root-game-setup", GameSetupRootComponentImpl);
}
