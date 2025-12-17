export interface GameInfoProps {
  name: string;
  players: {
    id: string;
    name: string;
  }[];

  onJoin?: () => void;
  onShare?: () => void;
}

export function GameInfoComponent(
  { name, players, onJoin, onShare }: GameInfoProps,
) {
  return (
    <div>
      <div>{name}</div>
      <div>
        {players.map((player) => <div key={player.id}>{player.name}</div>)}
      </div>
      <div>
        <button type="button" onClick={() => onShare && onShare()}>
          Share
        </button>
        <button type="button" onClick={() => onJoin && onJoin()}>Join</button>
      </div>
    </div>
  );
}
