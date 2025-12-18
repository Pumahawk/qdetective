import { useEffect, useRef } from "react";
import "./App.css";
import { BoardComponent } from "./components/BoardComponent.tsx";
import type { BoardComponentImpl } from "./core/board-core.ts";

function App() {
  const boardPromiseRef = useRef<Promise<BoardComponentImpl> | null>(null);
  const boardRef = useRef<BoardComponentImpl>(null);
  useEffect(() => {
    if (boardPromiseRef.current) {
      console.log("board: ", boardRef.current);
      boardPromiseRef.current.then((board) => {
        boardRef.current = board;
        board.draw({
          players: [],
          highlight: [],
          selection: [],
        });
      });
    } else {
      console.log("undefined board...");
    }
  }, []);
  return (
    <>
      <BoardComponent
        ref={boardPromiseRef}
        onBoardClick={(x, y) => {
          console.log("Clock on board!", x, y);
        }}
      />
    </>
  );
}

export default App;
