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
  onStart?: (gameId: string) => void;
  onEnter?: (gameId: string) => void;
}

export function GameInfoComponent(
  { id, role, gameStatus, name, players, onJoin, onShare, onEnter, onStart }:
    GameInfoProps,
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

        {gameStatus === "open" && (
          <div>
            {role === "no-role" && (
              <button
                type="button"
                onClick={() => onJoin && onJoin(id)}
              >
                Join
              </button>
            )}

            {role === "admin" && (
              <button
                type="button"
                onClick={() => onStart && onStart(id)}
              >
                Start Game
              </button>
            )}

            {role === "not-admin" && <div>Waiting...</div>}
          </div>
        )}
      </div>
      {gameStatus === "running" && (
        <div>
          <button type="button" onClick={() => onEnter && onEnter(id)}>
            Join
          </button>
        </div>
      )}
    </div>
  );
}
