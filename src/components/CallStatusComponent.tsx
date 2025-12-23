import { getCardById } from "../core/cards.ts";
import { ItemImg, PlayerImg } from "../core/core.tsx";

export type PlayerStatus = "waiting" | "owner" | "not-owner";

export interface CallStatusProps {
  status: "wait" | "ready";
  itemId: number | undefined;
  players: {
    id: number;
    status: PlayerStatus;
  }[];

  onContinue?: () => void;
}

export function CallStatusComponent(
  { status, itemId, players, onContinue }: CallStatusProps,
) {
  const playersInfo = players.map((p) => ({
    status: p.status,
    ...getCardById(p.id),
  }));

  const itemInfo = itemId && getCardById(itemId);

  return (
    <div>
      <div>
        {playersInfo.map((info) => (
          <div key={info.id}>
            <PlayerImg imageId={info.assetId} />
            <PlayerStatus status={info.status} />
            <div>{info.name}</div>
          </div>
        ))}
        <div></div>
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
