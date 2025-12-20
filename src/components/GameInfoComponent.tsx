export type GameInfoMode = "admin" | "not-admin" | "to-join";

export interface GameInfoProps {
  id: string;
  mode: GameInfoMode;
  name: string;
  players: {
    id: string;
    name: string;
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
        {players.map((player) => <div key={player.id}>{player.name}</div>)}
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
