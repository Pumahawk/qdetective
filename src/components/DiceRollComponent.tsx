import { DiceImg } from "../core/core.tsx";

export interface DiceRollProp {
  actions: boolean;
  dice?: [number, number];
  onRoll?: () => void;
}

export function DiceRollComponent(
  { actions, dice, onRoll }: DiceRollProp,
) {
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
      {actions && dice === undefined &&
        (
          <button
            hidden={!actions}
            type="button"
            onClick={() => onRoll && onRoll()}
          >
            Roll
          </button>
        )}
    </div>
  );
}
