import opts from "./lib/opts.js";
import { drawData } from "./lib/draw.js";
import { doScale } from "./lib/scale.js";
import { doScroll } from "./lib/scroll.js";
import { initEvent } from "./lib/event.js";
import { doCursor } from "./lib/action.js";

const { Board } = window.iDrawBoard;

const mount = document.querySelector("#mount");
const board = new Board(mount, opts);

const conf = {
  scale: 1,
  // scrollX: 100,
  // scrollY: 200,
}

// const conf = {
//   scale: 2,
//   scrollX: -200,
//   scrollY: -100,
// };

drawData(board);

initEvent(board);
doScale(board, conf.scale);
doScroll(board, conf);
doCursor(board);

console.log('pointScreenToContext = ', board.pointScreenToContext({ x: 400, y: 300 }));

console.log('pointContextToScreen = ', board.pointContextToScreen({ x: 300, y: 200 }));

// board.scale(2);
// board.draw();
