import "./App.css";
import { AppRootComponent } from "./components/AppRootComponent.tsx";

function App() {
  return <AppRootComponent />;
}

// function App() {
//   const boardPromiseRef = useRef<Promise<BoardComponentImpl> | null>(null);
//   const boardRef = useRef<BoardComponentImpl>(null);
//   useEffect(() => {
//     if (boardPromiseRef.current) {
//       console.log("board: ", boardRef.current);
//       boardPromiseRef.current.then((board) => {
//         boardRef.current = board;
//         board.draw({
//           players: [],
//           highlight: [],
//           selection: [],
//         });
//       });
//     } else {
//       console.log("undefined board...");
//     }
//   }, []);
//   return (
//     <>
//       <BoardComponent
//         ref={boardPromiseRef}
//         onBoardClick={(x, y) => {
//           console.log("Clock on board!", x, y);
//         }}
//       />
//     </>
//   );
// }
//
export default App;
