export interface DiceRollModel {}
export interface DiceRollComponent {}
export function DiceRollComponentF(cr: CustomElementRegistry) {
  class DiceRollComponentImpl extends HTMLElement
    implements DiceRollComponent {}
  cr.define("DiceRollComponent", DiceRollComponentImpl);
}
