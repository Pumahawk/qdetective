import type { AppService } from "../services/AppService.ts";
import type { GameInfoComponent } from "./GameInfoComponent.ts";
import type { GameListComponent } from "./GameListComponent.ts";
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
</div>
`;

      this.initGameListElement(shadowRoot);
      this.initServerSetupElement(shadowRoot);
      this.initGameInfoElement(shadowRoot);

      this.initFirstSetup();
    }

    private initGameListElement(shadowRoot: ShadowRoot): void {
      this.gameListElement = shadowRoot.querySelector<GameListComponent>(
        "app-game-list",
      )!;
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

    private initFirstSetup(): void {
      const url = new URL(globalThis.window.location.href);
      const server = url.searchParams.get("server");
      if (!server) {
        console.log("serverSetupElement", this.serverSetupElement);
        this.serverSetupElement?.removeAttribute("hidden");
      }
    }
  }

  cr.define("app-root-game-setup", GameSetupRootComponentImpl);
}
