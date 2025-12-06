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

function mapColor(k: string): string {
  return colors[k] ?? defaultColor;
};

function mapBorder(k: string): string {
  return border[k] ?? defaultBorder;
};

export function LoadBoard(htmlElement: HTMLElement): void {
  const htmlTable = document.createElement('table');
  htmlTable.style.borderCollapse = "collapse";

  map.forEach(row => {
    const rowHtml = document.createElement('tr');
    row.forEach(cell => {
      const tdHtml = document.createElement(('td'));
      tdHtml.style.width = "25px";
      tdHtml.style.height = "25px";
      tdHtml.style.padding = "0px";
      tdHtml.style.textAlign = "center";
      tdHtml.style.verticalAlign = "middle";
      tdHtml.style.border = mapBorder(cell);
      tdHtml.style.background = mapColor(cell);

      rowHtml.appendChild(tdHtml);
    });
    htmlTable.appendChild(rowHtml);
  });

  htmlElement.replaceChildren(htmlTable);
}
