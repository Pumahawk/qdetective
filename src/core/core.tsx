const diceAssetSize = 51;
const playerAssetSize = 16;
const scale = 3;

// TODO set item image
export function ItemImg({ imageId }: { imageId: number }) {
  return (
    <div
      style={{
        width: `${playerAssetSize * scale}px`,
        height: `${playerAssetSize * scale}px`,
      }}
    >
      <div
        style={{
          width: `${playerAssetSize}px`,
          height: `${playerAssetSize}px`,
          transform: `scale(${scale})`,
          transformOrigin: `top left`,
          backgroundImage: `url("/players.png")`,
          backgroundSize: `48px 48px`,
          backgroundPosition: getBkPos(imageId),
          imageRendering: `pixelated`,
        }}
      />
    </div>
  );
}

export function PlayerImg({ imageId }: { imageId: number }) {
  return (
    <div
      style={{
        width: `${playerAssetSize * scale}px`,
        height: `${playerAssetSize * scale}px`,
      }}
    >
      <div
        style={{
          width: `${playerAssetSize}px`,
          height: `${playerAssetSize}px`,
          transform: `scale(${scale})`,
          transformOrigin: `top left`,
          backgroundImage: `url("/players.png")`,
          backgroundSize: `48px 48px`,
          backgroundPosition: getBkPos(imageId),
          imageRendering: `pixelated`,
        }}
      />
    </div>
  );
}

function getDiceBkPos(pos: number): string {
  pos--;
  const col = pos % 6;
  return `${-col * diceAssetSize}px 0px`;
}

function getBkPos(pos: number): string {
  const col = pos % 3;
  const row = Math.floor(pos / 3);
  return `${-col * 16}px ${-row * 16}px`;
}

// TODO define image dice
export function DiceImg({ value }: { value: number }) {
  return (
    <div
      style={{
        // width: `${diceAssetSize * scale}px`,
        // height: `${diceAssetSize * scale}px`,
      }}
    >
      <div
        style={{
          width: `${diceAssetSize}px`,
          height: `${diceAssetSize}px`,
          // transform: `scale(${scale})`,
          transformOrigin: `top left`,
          backgroundImage: `url("/dice.png")`,
          // backgroundSize: `48px 48px`,
          backgroundPosition: getDiceBkPos(value),
          imageRendering: `pixelated`,
        }}
      />
    </div>
  );
}

export function Loading() {
  return <div>loading...</div>;
}
