import { DiceImg } from "../core/core.tsx";

export interface DiceRollProp {
  dice?: number;
  onRoll?: () => void;
  onContinue?: () => void;
}

export function DiceRollComponent({ dice, onRoll, onContinue }: DiceRollProp) {
  return (
    <div>
      <div>
        {dice != undefined && <DiceImg value={dice} />}
        {dice != undefined && <div>{dice}</div>}
      </div>
      <button
        type="button"
        onClick={() =>
          dice == undefined
            ? (onRoll && onRoll())
            : (onContinue && onContinue())}
      >
        {dice == undefined ? "Roll" : "Continue"}
      </button>
    </div>
  );
}
