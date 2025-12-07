export function getMap() {
  return [
    [ "MNW","MN","MN","MN","MN","MN","MN","MN","w","MN","MN","MN","MN","MN","MN","g","MN","MN","MN","MN","MN","MN","MN","MN","MNE" ],
    [ "ML"," "," "," "," "," "," ","x","x"," "," "," "," "," "," ","x","x","x"," "," "," "," "," "," ","ME" ],
    [ "ML"," "," "," "," "," ","x","x"," "," "," "," "," "," "," "," "," ","x","x"," "," "," "," "," ","ME" ],
    [ "ML"," "," "," "," "," ","x","x"," "," "," "," "," "," "," "," "," ","x","x"," "," "," "," "," ","ME" ],
    [ "ML"," "," "," "," "," ","x","x"," "," "," "," "," "," "," "," "," ","x","x"," "," "," "," "," ","ME" ],
    [ "ML"," "," "," "," "," ","x","x","S"," "," "," "," "," "," "," ","S","x","x","x","S"," "," "," ","ME" ],
    [ "ML"," "," "," "," ","S","x","x"," ","S"," "," "," "," "," ","S"," ","x","x","x"," "," "," ","x","b" ],
    [ "x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","ME" ],
    [ "ML","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x"," "," "," "," "," "," ","ME" ],
    [ "ML"," "," "," "," ","x","x","x","x","x"," "," "," "," "," ","x","x","x","S"," "," "," "," "," ","ME" ],
    [ "ML"," "," "," "," "," "," "," ","x","x","S"," "," "," ","S","x","x","x"," "," "," "," "," "," ","ME" ],
    [ "ML"," "," "," "," "," "," "," ","x","x"," "," "," "," "," ","x","x","x"," "," "," "," "," ","S","ME" ],
    [ "ML"," "," "," "," "," "," ","S","x","x"," "," "," "," "," ","x","x","x","x","x","x","x","x","x","ME" ],
    [ "ML"," "," "," "," "," "," "," ","x","x"," "," "," "," "," ","x","x","x"," "," "," ","S"," "," ","ME" ],
    [ "ML"," "," "," "," "," "," "," ","x","x","S"," "," "," ","S","x","x"," "," "," "," "," "," "," ","ME" ],
    [ "ML"," "," "," "," "," ","S"," ","x","x"," "," "," "," "," ","x","x","S"," "," "," "," "," "," ","ME" ],
    [ "ML","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x"," "," "," "," "," "," "," ","ME" ],
    [ "x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x","x"," "," "," "," "," "," ","ME" ],
    [ "ML","x","x","x","x","x","x","x","x"," "," ","S","S","S"," "," ","x","x","x","x","x","x","x","x","v" ],
    [ "ML"," "," "," "," "," ","S","x","x"," "," "," "," "," "," ","S","x","x","x","x","x","x","x","x","ME" ],
    [ "ML"," "," "," "," "," "," ","x","x"," "," "," "," "," "," "," ","x","x","S"," "," "," "," "," ","ME" ],
    [ "ML"," "," "," "," "," "," ","x","x"," "," "," "," "," "," "," ","x","x"," "," "," "," "," "," ","ME" ],
    [ "ML"," "," "," "," "," "," ","x","x"," "," "," "," "," "," "," ","x","x"," "," "," "," "," "," ","ME" ],
    [ "ML" ," "," "," "," "," "," ","x","x"," "," "," "," "," "," "," ","x","x"," "," "," "," "," "," ","ME" ],
    [ "MSW","MS","MS","MS","MS","MS","MS","r","MS","MS","MS","MS","MS","MS","MS","MS","MS","xS","MS","MS","MS","MS","MS","MS","MSE" ]
  ];
}

export type AssetXY = [number, number, [number, number]?];
export interface RoomC {
  position: [number, number]
  size: [number, number]
}


const roomSize = 330;
export const roomXY = {
  kitchen: {position: [330 * 0, 330 * 0], size: [330, 330]} as RoomC,
  biblio: {position: [330 * 1, 330 * 0], size: [330, 330]} as RoomC,
  salaPranzo: {position: [330 * 2, 330 * 0], size: [330, 330]} as RoomC,

  room1: {position: [330 * 0, 330 * 1], size: [330, 330]} as RoomC,
  stud: {position: [330 * 1, 330 * 1], size: [330, 330]} as RoomC,
  gioco: {position: [330 * 2, 330 * 1 + roomSize / 2], size: [330, roomSize / 2]} as RoomC,

  ingr: {position: [330 * 0, 330 * 2], size: [330, 330]} as RoomC,
  giard: {position: [330 * 1, 330 * 2], size: [330, 330]} as RoomC,
  bad: {position: [330 * 2, 330 * 2], size: [330, 330]} as RoomC,

  swpool: {position: [330 * 0, 330 * 3], size: [330, 330]} as RoomC,
}

export interface RoomPS {
  room: RoomC
  position: [number, number, number, number]
}

export const rooms: RoomPS[] = [
  {room: roomXY.kitchen, position: [16 * 1, 16 * 1, 16 * 6, 16 * 6]},
  {room: roomXY.biblio, position: [16 * 9, 16 * 18, 16 * 7, 16 * 6]},
  {room: roomXY.salaPranzo, position: [16 * 1, 16 * 9, 16 * 7, 16 * 7]},
  {room: roomXY.room1, position: [16 * 1, 16 * 18, 16 * 6, 16 * 6]},
  {room: roomXY.stud, position: [16 * 18, 16 * 0, 16 * 6, 16 * 7]},
  {room: roomXY.gioco, position: [16 * 17, 16 * 13, 16 * 7, 16 * 5]},
  {room: roomXY.giard, position: [16 * 18, 16 * 7, 16 * 6, 16 * 5]},
  {room: roomXY.bad, position: [16 * 18, 16 * 20, 16 * 6, 16 * 5]},
  {room: roomXY.ingr, position: [16 * 8, 16 * 0, 16 * 9, 16 * 7]},
  {room: roomXY.swpool, position: [16 * 9, 16 * 8, 16 * 7, 16 * 8]},
];

export const assetsXY = {
  floor: [3, 5] as AssetXY,
  door: [5, 4] as AssetXY,
  wallW: [9, 9] as AssetXY,
  wallNW: [9, 10, [1,-1]] as AssetXY,
  wallSW: [9, 10] as AssetXY,
  wallN: [14, 11, [1, -1]] as AssetXY,
  wallS: [14, 11] as AssetXY,
  wallNE: [9, 10, [-1, -1]] as AssetXY,
  wallSE: [9, 10, [-1, 1]] as AssetXY,
  wallE: [9, 9, [-1, 1]] as AssetXY,
}

export class AssetManager {
  ctx: CanvasRenderingContext2D
  imageAssets: HTMLImageElement
  imageRooms: HTMLImageElement
  constructor(ctx: CanvasRenderingContext2D, imageAssets: HTMLImageElement, imageRooms: HTMLImageElement) {
    this.ctx = ctx;
    this.imageAssets = imageAssets;
    this.imageRooms = imageRooms;
  }

  drawAsset(asset: AssetXY, x: number, y: number) {
    const [px, py, scale] = asset;
    const bs = 16;
    if (scale) {
      this.ctx.save();
      this.ctx.translate(x * bs + bs / 2, y * bs + bs / 2);
      this.ctx.scale(scale[0], scale[1]);
this.ctx.drawImage(this.imageAssets, px * bs, py * bs, bs, bs, -bs / 2, -bs / 2, bs, bs);
      this.ctx.restore();
    } else {
      this.ctx.drawImage(this.imageAssets, px * bs, py * bs, bs, bs, x * bs, y * bs, bs, bs);
    }
  }

  drawBoard() {
    rooms.forEach(room => this.drawRoom(room.room, room.position));
    getMap().forEach((row, i) => row.forEach((cell, j) => {
      switch (cell) {
        case ' ': break
        case 'ML': this.drawAsset(assetsXY.wallW, j, i); break
        case 'MNW': this.drawAsset(assetsXY.wallNW, j, i); break
        case 'MSW': this.drawAsset(assetsXY.wallSW, j, i); break
        case 'MN': this.drawAsset(assetsXY.wallN, j, i); break
        case 'MS': this.drawAsset(assetsXY.wallS, j, i); break
        case 'MNE': this.drawAsset(assetsXY.wallNE, j, i); break
        case 'MSE': this.drawAsset(assetsXY.wallSE, j, i); break
        case 'ME': this.drawAsset(assetsXY.wallE, j, i); break
        case 'S': this.drawAsset(assetsXY.door, j, i); break;
        default: this.drawAsset(assetsXY.floor, j, i); break;
      }
      if (cell == 'x') {
        this.drawAsset(assetsXY.floor, j, i);
      }
    }))
  }

  drawRoom(room: RoomC, coordinates: [number, number, number, number]) {
    const [positionX, positionY] = room.position;
    const [x, y] = room.size;
    const [cx, cy, cdx, cdy] = coordinates;
    this.ctx.drawImage(this.imageRooms, positionX, positionY, x, y, cx, cy, cdx, cdy);
  }
}

