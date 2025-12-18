import { type RefObject, useEffect, useRef } from "react";
import { BoardComponentImpl, type BoardModel } from "../core/board-core.ts";

const blockSize = 16;
const boardSizeX = 25 * blockSize;
const boardSizeY = 25 * blockSize;

export interface BoardProps {
  model: BoardModel;
  ref?: RefObject<Promise<BoardComponentImpl>>;
  onBoardClick?: (x: number, y: number) => void;
}

export function BoardComponent({ model, onBoardClick, ref }: BoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const bcmp = BoardComponentImpl.of(canvas, {
        onBoardClick,
      }).then((board) => {
        board.draw(model);
        return board;
      });
      if (ref) {
        ref.current = bcmp;
      }
    }
  }, []);
  return (
    <canvas
      onClick={(e) =>
        handleClickOnCanvas(e.currentTarget, e.nativeEvent, onBoardClick)}
      ref={canvasRef}
      width={25 * 16}
      height={25 * 16}
      style={{
        width: "1000px",
        height: "1000px",
        imageRendering: "pixelated",
      }}
    >
    </canvas>
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
