import { PlayerImg } from "../core/core.tsx";

export type PlayerRoleMode = "admin" | "not-admin" | "no-role";

export type GameStatusMode = "open" | "running" | "finished";

export interface GameInfoProps {
  id: string;
  role: PlayerRoleMode;
  gameStatus: GameStatusMode;
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
  { id, role: mode, name, players, onJoin, onShare }: GameInfoProps,
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

        {mode === "no-role" && (
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
