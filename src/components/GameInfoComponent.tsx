export interface GameInfoProps {
  id: string;
  name: string;
  players: {
    id: string;
    name: string;
  }[];

  onJoin?: (gameId: string) => void;
  onShare?: (gameId: string) => void;
}

export function GameInfoComponent(
  { id, name, players, onJoin, onShare }: GameInfoProps,
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
        <button type="button" onClick={() => onJoin && onJoin(id)}>Join</button>
      </div>
    </div>
  );
}
