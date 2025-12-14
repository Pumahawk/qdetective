export interface CallStatusModel {}
export interface CallStatusComponent {}
export function CallStatusComponentF(cr: CustomElementRegistry) {
  class CallStatusComponentImpl extends HTMLElement
    implements CallStatusComponent {}
  cr.define("CallStatusComponent", CallStatusComponentImpl);
}
