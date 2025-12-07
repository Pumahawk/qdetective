import { useEffect, useState } from 'react';
import './App.css'

type AppScene = "menu" | "game";
interface GameState {
}

function App() {
  const [scene, setScene] = useState<AppScene>("menu")
  const [gameState, setGameState] = useState<GameState>(null);
  return (
    <div>
      { scene == "menu"
        ? <MenuScene />
        : <GameScene />
      }
      { scene == "menu" ? <div><button onClick={() => setScene("game")}>to game...</button></div> : null }
    </div>
  )
}

export default App
//
// x = corridoio
// S = stanza

// b = inizio blu
// g = verde (green)
// r = inizio rosso
// v = inizio viola
// w = biano (white)

const map = [
[ " "," "," "," "," "," "," "," ","w"," "," "," "," "," "," ","g"," "," "," "," "," "," "," "," "," " ],
[ " "," "," "," "," "," "," ","x","x"," "," "," "," "," "," ","x","x","x"," "," "," "," "," "," "," " ],
[ " "," "," "," "," "," ","x","x"," "," "," "," "," "," "," "," "," ","x","x"," "," "," "," "," "," " ],
[ " "," "," "," "," "," ","x","x"," "," "," "," "," "," "," "," "," ","x","x"," "," "," "," "," "," " ],
[ " "," "," "," "," "," ","x","x"," "," "," "," "," "," "," "," "," ","x","x"," "," "," "," "," "," " ],
[ " "," "," "," "," "," ","x","x","S"," "," "," "," "," "," "," ","S","x","x","x","S"," "," "," "," " ],
[ " "," "," "," "," ","S","x","x"," ","S"," "," "," "," "," ","S"," ","x","x","x"," "," "," ","x","b" ],
[ "x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x"," " ],
[ " ","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x"," "," "," "," "," "," "," " ],
[ " "," "," "," "," ","x","x","x","x","x"," "," "," "," "," ","x","x","x","S"," "," "," "," "," "," " ],
[ " "," "," "," "," "," "," "," ","x","x","S"," "," "," ","S","x","x","x"," "," "," "," "," "," "," " ],
[ " "," "," "," "," "," "," "," ","x","x"," "," "," "," "," ","x","x","x"," "," "," "," "," ","S"," " ],
[ " "," "," "," "," "," "," ","S","x","x"," "," "," "," "," ","x","x","x","x","x","x","x","x","x"," " ],
[ " "," "," "," "," "," "," "," ","x","x"," "," "," "," "," ","x","x","x"," "," "," ","S"," "," "," " ],
[ " "," "," "," "," "," "," "," ","x","x","S"," "," "," ","S","x","x"," "," "," "," "," "," "," "," " ],
[ " "," "," "," "," "," ","S"," ","x","x"," "," "," "," "," ","x","x","S"," "," "," "," "," "," "," " ],
[ " ","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x"," "," "," "," "," "," "," "," " ],
[ "x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x"," "," "," "," "," "," "," " ],
[ " ","x","x","x","x","x","x","x","x"," "," ","S","S","S"," "," ","x","x","x","x","x","x","x","x","v" ],
[ " "," "," "," "," "," ","S","x","x"," "," "," "," "," "," ","S","x","x","x","x","x","x","x","x"," " ],
[ " "," "," "," "," "," "," ","x","x"," "," "," "," "," "," "," ","x","x","S"," "," "," "," "," "," " ],
[ " "," "," "," "," "," "," ","x","x"," "," "," "," "," "," "," ","x","x"," "," "," "," "," "," "," " ],
[ " "," "," "," "," "," "," ","x","x"," "," "," "," "," "," "," ","x","x"," "," "," "," "," "," "," " ],
[ " "," "," "," "," "," "," ","x","x"," "," "," "," "," "," "," ","x","x"," "," "," "," "," "," "," " ],
[ " "," "," "," "," "," "," ","r","x"," "," "," "," "," "," "," "," ","x"," "," "," "," "," "," "," " ]
];

const defaultBorder = "1px solit white";
const border: { [key: string]:string } = {
  "x": "1px solid #2B2B2B",
  "S": "1px solid #2B2B2B",
  "b": "1px solid #2B2B2B",
  "g": "1px solid #2B2B2B",
  "r": "1px solid #2B2B2B",
  "v": "1px solid #2B2B2B",
  "w": "1px solid #2B2B2B",
};

const defaultColor = "white";
const colors: { [key: string]:string } = {
  "x": "#F5EBAA",
  "S": "#C3C3C3",
  "b": "#3F48CC",
  "g": "#22B14C",
  "r": "#880015",
  "v": "#A349A4",
  "w": "#2B2B2B",
};

type ItemType = "object" | "room" | "person";
type ItemStatus = number;

interface Item {
  id: string
  type: ItemType
  name: string
  status: ItemStatus
}

const items: Item[] = [
  { id: "0", type: "object", name: "Pistol", status: 0 },
];

function mapColor(k: string): string {
  return colors[k] ?? defaultColor;
}

function mapBorder(k: string): string {
  return border[k] ?? defaultBorder;
}

function getRowStyleByState(item: Item) {
  switch (item.status % 4) {
    case 0:
      return "#d4edda; color: #155724;";  // verde chiaro
    case 1:
      return "#fff3cd; color: #856404;";  // giallo chiaro
    case 2:
      return "#f8d7da; color: #721c24;";  // rosso chiaro
    default:
      return "";
  }
}

const size = "20px";

export function BoardComponent() {
  return (
<table style={{borderCollapse: "collapse"}}>
      <tbody>
      { map.map((row, i) => <tr key={i}>{ row.map((cell, j) => <td key={i * 100 + j} style={{
        width: size,
        height: size,
        padding: "0px",
        textAlign: "center",
        verticalAlign: "middle",
        border: mapBorder(cell),
        background: mapColor(cell),
}}></td>) }</tr>) }
      </tbody>
</table>
  )
}

export function ItemsComponent() {
  return (
    <div className='items-wrapper'>
      <table className='items-table'>
        <tbody>
          { items.map(item => (<tr key={item.id} style={{backgroundColor: getRowStyleByState(item)}}>
            <td>{item.name}</td>
          </tr>))}
        </tbody>
      </table>
    </div>
  )
}

interface ServerState {
  id: string
}

const mockState: ServerState[] = [
  { id: "game1" },
  { id: "game2" },
]

export function MenuScene() {
  const [load, setLoad] = useState(true);
  const [state, setState] = useState<ServerState[]>([]);
  useEffect(() => {
    setTimeout(() => {
      setLoad(false)
      setState(mockState)
    }, 500);
  });
  return (
  <div>
      { load
        ? <LoadComponent/>
        : (
          <div>
            { state.map(s => <div key={s.id}>{s.id}</div>) }
          </div>
        )
      }
  </div>
  )
}

export function GameScene() {
return (
  <div>
    <BoardComponent />
    <ItemsComponent />
  </div>
)
}
export function ServerStatesPage() {
  return (
  <div>
      serrver state page
  </div>
  )
}

export function LoadComponent() {
  return (
    <div>loading...</div>
  )
}
