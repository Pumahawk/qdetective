import { AssetManager } from "./map.ts";
import "./style.css";

const blockSize = 16;
const boardSizeX = 25 * blockSize;
const boardSizeY = 25 * blockSize;

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <canvas id="canvas" width="${boardSizeX}" height="${boardSizeY}">
      Board...
    </canvas>
  </div>
`;

const canvas: HTMLCanvasElement = document.getElementById(
  "canvas",
)! as HTMLCanvasElement;
canvas.style.width = "1000px";
canvas.style.height = "1000px";
canvas.style.imageRendering = "pixelated";

const ctx = canvas.getContext("2d")!;

const image = new Image();
const rooms = new Image();
const asm = new AssetManager(ctx, image, rooms);

const loadingRooms = new Promise((resolve) => {
  rooms.addEventListener("load", () => {
    resolve(null);
  });
  rooms.src = "/rooms.png";
})
const loadingAssets = new Promise((resolve) => {
  image.addEventListener("load", () => {
    resolve(null);
  });
  image.src = "/assets.png";
})


Promise.all([loadingRooms, loadingAssets]).then(() => asm.drawBoard());
