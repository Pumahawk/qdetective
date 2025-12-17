import { useState } from "react";
import { getItemById, getPlayerById } from "../services/AppService.ts";
import { ItemImg, PlayerImg } from "../core/core.tsx";

export interface GameResultProps {
  items: [string, string, string];
  players: {
    id: string;
    status: number;
    items: string[];
  }[];
}

export function GameResultComponent({ items, players }: GameResultProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const playersInfo = players.map((player) => ({
    info: getPlayerById(player.id),
    ...player,
  }));

  const itemsInfo = items.map((itemId) => getItemById(itemId));
  const selectedPlayerMeta = selectedPlayer &&
    playersInfo.find((player) => player.id === selectedPlayer);
  const selectedPlayerInfo = selectedPlayerMeta &&
    getPlayerById(selectedPlayerMeta.id);
  const selectedPlayerItems = selectedPlayerInfo &&
    selectedPlayerMeta.items.map((itemId) => getItemById(itemId));

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
