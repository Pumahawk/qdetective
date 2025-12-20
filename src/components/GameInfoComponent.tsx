import { PlayerImg } from "../core/core.tsx";

export type GameInfoMode = "admin" | "not-admin" | "to-join";

export interface GameInfoProps {
  id: string;
  mode: GameInfoMode;
  name: string;
  players: {
    id: string;
    name: string;
    assetId: number;
  }[];

  onJoin?: (gameId: string) => void;
  onShare?: (gameId: string) => void;
}

export function GameInfoComponent(
  { id, mode, name, players, onJoin, onShare }: GameInfoProps,
) {
  return (
    <div>
      <div>{name}</div>
      <div>
        {players.map((player) => (
          <div
            key={player.id}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <PlayerImg imageId={player.assetId} />
            <span style={{ padding: "20px" }}>{player.name}</span>
          </div>
        ))}
      </div>
      <div>
        <button type="button" onClick={() => onShare && onShare(id)}>
          Share
        </button>

        {mode === "to-join" && (
          <button
            type="button"
            onClick={() => onJoin && onJoin(id)}
          >
            Join
          </button>
        )}

        {mode === "admin" && (
          <button type="button">
            {/* onClick={() => onStart && start(id)} */}
            Start Game
          </button>
        )}

        {mode === "not-admin" && <div>Waiting...</div>}
      </div>
    </div>
  );
}
