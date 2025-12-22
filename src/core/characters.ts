const positionList: [number, number][] = [
  [8, 0],
  [15, 0],
  [24, 6],
  [24, 18],
  [7, 24],
  [0, 17],
];
export function getPlayerInitialPosition(n: number): [number, number] {
  return positionList[n % positionList.length];
}
