const inputTextName = "server-address";

export interface ServerSetupComponent extends HTMLElement {
  onServerSelected: (address: string) => void;
}

export function ServerSetupComponentF(cr: CustomElementRegistry) {
  class ServerSetupComponentImpl extends HTMLElement
    implements ServerSetupComponent {
    formElement: HTMLFormElement | undefined;
    errorElement: HTMLElement | undefined;
    onServerSelected = (_: string) => {};

    constructor() {
      super();
    }

    connectedCallback() {
      if (this.shadowRoot) return;

      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.innerHTML = `
<form>
  <div>
    <input name="${inputTextName}" type="text" placeholder="Server Address" />
  </div>
  <div id="error" hidden>Invalid server address</div>
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
        const serverAddress = formData.get(inputTextName)?.toString();
        if (
          serverAddress && typeof serverAddress === "string" &&
          serverAddress.trim() !== ""
        ) {
          this.errorElement?.setAttribute("hidden", "");
          this.onServerSelected(serverAddress.trim());
        } else {
          this.errorElement?.removeAttribute("hidden");
        }
      };
    }
  }

  cr.define("app-server-setup", ServerSetupComponentImpl);
}
