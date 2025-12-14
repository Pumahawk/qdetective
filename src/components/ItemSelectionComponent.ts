export interface ItemSelectionModel {}
export interface ItemSelectionComponent {}
export function ItemSelectionComponentF(cr: CustomElementRegistry) {
  class ItemSelectionComponentImpl extends HTMLElement
    implements ItemSelectionComponent {}
  cr.define("ItemSelectionComponent", ItemSelectionComponentImpl);
}
