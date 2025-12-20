import { useState } from "react";
import { PlayerImg } from "../core/core.tsx";

export type OnConfirmEvent = OnConfirmCreateEvent | OnConfirmJoinEvent;

export type GameListMode = { mode: "create" } | {
  mode: "join";
  gameId: string;
};

interface OnConfirmBaseEvent {
  playerAsset: number;
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
            playerAsset: Number(data.get("playerAsset")!),
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
          <div className="player-img-conainer">
            <PlayerImg imageId={imageId} />
          </div>
          <select
            name="playerAsset"
            onChange={(e) => setImageId(Number(e.target.value))}
          >
            <option value="0">Player 1</option>
            <option value="1">Player 2</option>
            <option value="2">Player 3</option>
            <option value="3">Player 4</option>
            <option value="4">Player 5</option>
            <option value="5">Player 6</option>
            <option value="6">Player 7</option>
            <option value="7">Player 8</option>
            <option value="8">Player 9</option>
          </select>
        </div>
        <div>
          <input
            name="playerName"
            type="text"
            placeholder="Player name"
            required
          />
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
