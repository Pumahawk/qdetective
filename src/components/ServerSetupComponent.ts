const inputTextName = "server-address";
type OnServerSelected = (address: string) => string | null;

export interface ServerSetupComponent {
  onServerSelected: OnServerSelected;
}

export function ServerSetupComponentF(cr: CustomElementRegistry) {
  class ServerSetupComponentImpl extends HTMLElement
    implements ServerSetupComponent {
    formElement: HTMLFormElement | undefined;
    errorElement: HTMLElement | undefined;
    onServerSelected = (_: string) => null;

    constructor() {
      super();
    }

    connectedCallback() {
      if (!this.shadowRoot) {
        const shadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.innerHTML = `
<form>
  <div>
    <input name="${inputTextName}" type="text" placeholder="Server Address" />
  </div>
  <div id="error" hidden="true">Invalid server address</div>
  <div>
    <input type="submit" />
  </div>
</form>
`;

        this.formElement = shadowRoot.querySelector("form")!;
        this.errorElement = shadowRoot.getElementById("error")!;
        this.formElement.onsubmit = (event) => {
          event.preventDefault();
          const formData = new FormData(this.formElement);
          const serverAddress = formData.get(inputTextName);
          if (serverAddress) {
            this.errorElement?.setAttribute("hidden", "true");
            this.onServerSelected(serverAddress.toString());
          } else {
            this.errorElement?.removeAttribute("hidden");
          }
        };
      }
    }
  }

  cr.define("app-serversetupcomponent", ServerSetupComponentImpl);
}
