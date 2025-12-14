const itemsElementId = "items";

export interface ItemSelectionModel {
  groups: {
    id: string;
    items: {
      id: string;
      label: string;
    }[];
  }[];
}

type OnConfirmTypeFn = (
  items: { id: string; value: string | undefined }[],
) => void;

export interface ItemSelectionComponent extends HTMLElement {
  onConfirm: undefined | OnConfirmTypeFn;
  update(model: ItemSelectionModel): void;
}

export function ItemSelectionComponentF(cr: CustomElementRegistry) {
  class ItemSelectionComponentImpl extends HTMLElement
    implements ItemSelectionComponent {
    itemsElement: HTMLElement | undefined;
    onConfirm: undefined | OnConfirmTypeFn;

    constructor() {
      super();
      this.onConfirm = undefined;
    }

    connectedCallback() {
      if (this.shadowRoot) return;
      const shadowRoot = this.attachShadow({ mode: "open" });
      shadowRoot.innerHTML = `
<form>
  <div id="${itemsElementId}"></div>
  <button>Confirm</button>
</form>
`;

      this.itemsElement = shadowRoot.getElementById(itemsElementId)!;

      const form = shadowRoot.querySelector<HTMLFormElement>("form")!;
      form.onsubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const values: { id: string; value: string | undefined }[] = [];
        for (const [id, value] of formData.entries()) {
          values.push({ id, value: value?.toString() });
        }
        if (this.onConfirm) this.onConfirm(values);
      };
    }

    update(model: ItemSelectionModel) {
      this.itemsElement?.replaceChildren();
      model.groups.map((group) => this.createGroup(group.id, group.items))
        .forEach((
          element,
        ) => this.itemsElement?.append(element));
    }

    private createGroup(
      groupId: string,
      items: { id: string; label: string }[],
    ): HTMLElement {
      const div = document.createElement("div");
      div.innerHTML = `
<div>image...</div>
<div>
  <select name="${groupId}"></select>
</div>
`;
      items.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.id;
        option.innerHTML = item.label;
        div.querySelector("select")?.append(option);
      });
      return div;
    }
  }

  cr.define("app-item-selection", ItemSelectionComponentImpl);
}
