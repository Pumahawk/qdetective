import { useState } from "react";
import { PlayerImg } from "../core/core.tsx";

export type OnConfirmEvent = OnConfirmCreateEvent | OnConfirmJoinEvent;

export type GameListMode = { mode: "create" } | {
  mode: "join";
  gameId: string;
};

interface OnConfirmBaseEvent {
  playerAssetId: number;
  playerName: string;
}

export interface OnConfirmCreateEvent extends OnConfirmBaseEvent {
  mode: "create";
  gameName: string;
}

export interface OnConfirmJoinEvent extends OnConfirmBaseEvent {
  mode: "join";
  gameId: string;
}

export type OnConfirmType = (value: OnConfirmEvent) => void;

export function GameSetupComponent(
  { mode, onConfirm }: { mode: GameListMode; onConfirm: OnConfirmType },
) {
  const [imageId, setImageId] = useState<number>(0);
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          const baseEvent = {
            playerName: data.get("playerName")!.toString(),
            playerAssetId: imageId,
          };

          onConfirm(
            mode.mode === "create"
              ? {
                mode: "create",
                gameName: data.get("gameName")!.toString(),
                ...baseEvent,
              }
              : {
                mode: "join",
                gameId: mode.gameId,
                ...baseEvent,
              },
          );
        }}
      >
        {mode.mode == "create" && (
          <div>
            <input
              name="gameName"
              type="text"
              placeholder="Game name"
              required
            />
          </div>
        )}
        <div>
          <div
            style={{
              padding: "1em",
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
            }}
          >
            {Array.from(Array(9).keys()).map((i) => (
              <div
                key={i}
                style={{
                  padding: "0.5em",
                  borderStyle: "solid",
                  borderColor: imageId === i ? "green" : "white",
                  cursor: imageId != i ? "pointer" : undefined,
                }}
                onClick={() => setImageId(i)}
              >
                <PlayerImg imageId={i} />
              </div>
            ))}
          </div>
          <div style={{ margin: "1em" }}>
            <input
              name="playerName"
              type="text"
              placeholder="Player name"
              required
            />
          </div>
        </div>
        <div>
          <button id="submit-button" type="submit">
            {mode.mode === "join" ? "Join" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
