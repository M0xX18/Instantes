/** Genera un primer nivel más largo y variado para editarlo luego en Tiled. */
import { writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const width = 120;
const height = 28;
const data = Array.from({ length: width * height }, () => 0);
const set = (x, y, tile) => {
  if (x >= 0 && x < width && y >= 0 && y < height) data[y * width + x] = tile;
};

const terrain = [
  [0, 17, 17], [17, 16, 33], [33, 18, 51], [51, 15, 66],
  [66, 17, 83], [83, 14, 97], [97, 16, 113], [113, 18, 120],
];
for (const [start, top, end] of terrain) {
  for (let x = start; x < end; x += 1) {
    set(x, top, 1);
    for (let y = top + 1; y < height; y += 1) set(x, y, 2);
  }
}

const platforms = [
  [7, 20, 6], [15, 18, 5], [25, 14, 5], [35, 16, 7], [45, 12, 5],
  [57, 11, 6], [69, 14, 5], [77, 12, 6], [88, 9, 6], [100, 12, 5],
  [109, 14, 5],
];
for (const [start, y, length] of platforms) {
  for (let x = start; x < start + length; x += 1) set(x, y, 3);
}

const map = {
  compressionlevel: -1, height, infinite: false,
  layers: [{ data, height, id: 1, name: "suelo", opacity: 1, type: "tilelayer", visible: true, width, x: 0, y: 0 }],
  nextlayerid: 2, nextobjectid: 1, orientation: "orthogonal", renderorder: "right-down",
  tiledversion: "1.10.2", tileheight: 32,
  tilesets: [{ columns: 8, firstgid: 1, image: "../images/tileset-plataformas.png", imageheight: 32, imagewidth: 256, margin: 0, name: "tileset-plataformas", spacing: 0, tilecount: 8, tileheight: 32, tilewidth: 32 }],
  tilewidth: 32, type: "map", version: "1.10", width,
};

writeFileSync(join(root, "public", "assets", "maps", "mundo-1.json"), JSON.stringify(map));
const csv = Array.from({ length: height }, (_, y) => data.slice(y * width, (y + 1) * width).join(",")).join(",\n");
const tmx = `<?xml version="1.0" encoding="UTF-8"?>
<map version="1.10" tiledversion="1.10.2" orientation="orthogonal" renderorder="right-down" width="${width}" height="${height}" tilewidth="32" tileheight="32" infinite="0" nextlayerid="2" nextobjectid="1">
 <tileset firstgid="1" name="tileset-plataformas" tilewidth="32" tileheight="32" tilecount="8" columns="8">
  <image source="../images/tileset-plataformas.png" width="256" height="32"/>
 </tileset>
 <layer id="1" name="suelo" width="${width}" height="${height}">
  <data encoding="csv">\n${csv}\n</data>
 </layer>
</map>\n`;
writeFileSync(join(root, "public", "assets", "maps", "mundo-1.tmx"), tmx);
console.log("Mapa Mundo 1 actualizado: 120 × 28 tiles.");
