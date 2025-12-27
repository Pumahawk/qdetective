import { useEffect, useRef, useState } from "react";
import { BoardComponentImpl, type BoardModel } from "../core/board-core.ts";

const blockSize = 16;
const boardSizeX = 25 * blockSize;
const boardSizeY = 25 * blockSize;

export interface BoardProps {
  model?: BoardModel;
  onBoardClick?: (x: number, y: number) => void;
}

export function BoardComponent({ model, onBoardClick }: BoardProps) {
  const [ready, setReady] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const boardRef = useRef<BoardComponentImpl | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const bcmp = BoardComponentImpl.of(canvas, {
        onBoardClick,
      });
      bcmp.then((boardComponent) => {
        boardRef.current = boardComponent;
        setReady(true);
      });
    }
  }, []);

  useEffect(() => {
    boardRef.current?.draw(model);
  }, [ready, model]);

  return (
    <div>
      <canvas
        onClick={(e) =>
          handleClickOnCanvas(e.currentTarget, e.nativeEvent, onBoardClick)}
        ref={canvasRef}
        width={25 * 16}
        height={25 * 16}
        style={{
          width: "100%",
          height: "100%",
          imageRendering: "pixelated",
        }}
      >
      </canvas>
    </div>
  );
}

function handleClickOnCanvas(
  canvas: HTMLCanvasElement,
  event: MouseEvent,
  onBoardClick?: (x: number, y: number) => void,
) {
  if (canvas && onBoardClick) {
    const cp = canvas.getBoundingClientRect();
    const x = Math.floor(
      (event.x - cp.x) / (blockSize * cp.width / boardSizeX),
    );
    const y = Math.floor(
      (event.y - cp.y) / (blockSize * cp.height / boardSizeY),
    );
    onBoardClick(x, y);
  }
}
