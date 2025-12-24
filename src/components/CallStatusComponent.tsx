import { getCardById } from "../core/cards.ts";
import { ItemImg, PlayerImg } from "../core/core.tsx";

export interface ShowItemInfo {
  item: number;
  owner: {
    name: string;
    assetId: number;
  };
}

export type PlayerStatus = "waiting" | "owner" | "not-owner";

export interface PlayerCallInfo {
  assetId: number;
  name: string;
  status: PlayerStatus;
}

export interface CallStatusProps {
  status: "wait" | "ready";
  item?: ShowItemInfo;
  players: PlayerCallInfo[];

  onContinue?: () => void;
}

export function CallStatusComponent(
  { status, item, players, onContinue }: CallStatusProps,
) {
  const itemInfo = item && { card: getCardById(item.item), owner: item.owner };

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
          <ItemImg imageId={itemInfo.card.assetId} />
          <PlayerImg imageId={itemInfo.owner.assetId} />
          <div>{itemInfo.card.name}</div>
          <div>{itemInfo.owner.name}</div>
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
