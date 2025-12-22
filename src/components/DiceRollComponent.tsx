import { DiceImg } from "../core/core.tsx";

export interface DiceRollProp {
  dice?: [number, number];
  onRoll?: () => void;
  onContinue?: () => void;
}

export function DiceRollComponent({ dice, onRoll, onContinue }: DiceRollProp) {
  return (
    <div>
      {dice != undefined && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              padding: "5px",
            }}
          >
            <DiceImg value={dice[0]} />
          </div>
          <div
            style={{
              padding: "5px",
            }}
          >
            <DiceImg value={dice[1]} />
          </div>
        </div>
      )}
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
