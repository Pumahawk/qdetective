import { getCardById } from "../core/cards.ts";
import { ItemImg, PlayerImg } from "../core/core.tsx";

export type PlayerStatus = "waiting" | "owner" | "not-owner";

export interface PlayerCallInfo {
  assetId: number;
  name: string;
  status: PlayerStatus;
}

export interface CallStatusProps {
  status: "wait" | "ready";
  itemId?: number;
  players: PlayerCallInfo[];

  onContinue?: () => void;
}

export function CallStatusComponent(
  { status, itemId, players, onContinue }: CallStatusProps,
) {
  const itemInfo = itemId && getCardById(itemId);

  return (
    <div>
      <div>
        {players.map((info, i) => (
          <div key={i}>
            <PlayerImg imageId={info.assetId} />
            <PlayerStatus status={info.status} />
            <div>{info.name}</div>
          </div>
        ))}
      </div>
      {itemInfo && (
        <div>
          <ItemImg imageId={itemInfo.assetId} />
          <div>{itemInfo.name}</div>
        </div>
      )}
      <div>
        <button
          type="button"
          disabled={status == "ready"}
          onClick={() => onContinue && onContinue()}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function PlayerStatus({ status }: { status: string }) {
  return <span>{status}</span>;
}
