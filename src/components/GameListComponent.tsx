export interface GameListProp {
  games: {
    id: string;
    name: string;
  }[];

  onNewGameAction?: () => void;
  onOpenGame?: (id: string) => void;
}

export function GameListComponent(
  { games, onNewGameAction, onOpenGame }: GameListProp,
) {
  return (
    <div>
      <div>
        {games && games.map((game) => (
          <div
            key={game.id}
            onClick={() => onOpenGame && onOpenGame(game.id)}
          >
            {game.name}
          </div>
        ))}
      </div>
      <div>
        <button
          type="button"
          onClick={() => onNewGameAction && onNewGameAction()}
        >
          New Game
        </button>
      </div>
    </div>
  );
}
