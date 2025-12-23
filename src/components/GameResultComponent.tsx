import { useState } from "react";
import { ItemImg, PlayerImg } from "../core/core.tsx";
import { getCardById } from "../core/cards.ts";

export interface GameResultProps {
  items: [number, number, number];
  players: {
    assetId: number;
    status: number;
    items: number[];
  }[];
}

export function GameResultComponent({ items, players }: GameResultProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);
  const playersInfo = players.map((player) => ({
    info: getCardById(player.assetId),
    ...player,
  }));

  const itemsInfo = items.map((itemId) => getCardById(itemId));
  const selectedPlayerMeta = selectedPlayer &&
    playersInfo.find((player) => player.assetId === selectedPlayer);
  const selectedPlayerInfo = selectedPlayerMeta &&
    getCardById(selectedPlayerMeta.assetId);
  const selectedPlayerItems = selectedPlayerInfo &&
    selectedPlayerMeta.items.map((itemId) => getCardById(itemId));

  return (
    <div>
      {selectedPlayerInfo
        ? (
          <div>
            <button type="button" onClick={() => setSelectedPlayer(null)}>
              Back
            </button>
            <div>
              <div
                key={selectedPlayerInfo.id}
                onClick={() => setSelectedPlayer(selectedPlayerInfo.id)}
              >
                <div>
                  <PlayerImg imageId={selectedPlayerInfo.assetId} />
                  <span>{selectedPlayerInfo.name}</span>
                </div>
                <div>
                  {selectedPlayerItems &&
                    selectedPlayerItems.map((item) => (
                      <div>
                        <ItemImg imageId={item.assetId} />
                        <span>{item.name}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )
        : (
          <div>
            <div>
              {itemsInfo.map((item) => (
                <div key={item.id}>
                  <ItemImg imageId={item.assetId} />
                  <div>{item.name}</div>
                </div>
              ))}
            </div>
            <div>
              {playersInfo.map((player) => (
                <div>
                  <PlayerImg imageId={player.info.assetId} />
                  <span>{player.info.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
}
