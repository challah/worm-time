const palette = [
  { col: "#55ff44", name: "green" },
  { col: "#ff0088", name: "pink" },
  { col: "#ff7700", name: "orange" },
  { col: "#ffff22", name: "yellow" },
  { col: "#11ccff", name: "blue" },
  { col: "#9911ff", name: "purple" },
];
let colour = palette[Math.floor(Math.random() * palette.length)];

/* TWEAKPANE
-----------------------------------------*/
//default values
const p = {
  string: 150, 
  stringOrNot: true, 
  wCol: colour.col, 
  bCol: "#000000",
  speed: 3,
  squirmSize: 80,
  squirmFactor: 15,
  fuzziness: 0,
  words: "consciousness is an illusion"
};
//pane info
const pane = new Tweakpane.Pane({
  // title: "Worm Time",
  expanded: true,
  container: document.querySelector("footer"),
});
// folders
const stringFolder = pane.addFolder({ title: "Basic Settings", expanded: true });
const wormFolder = pane.addFolder({
  title: "Wormy Attributes",
  expanded: false,
});
const textFolder = pane.addFolder({
  title: "Text",
  expanded: false,
});

const btn = pane.addButton({
  title: "Make Gif",
});

textFolder.addInput(p, "words", {label: "Text"});
let textButton = textFolder.addButton({
  title: "Update Text",
})
textButton.on("click", () => {
  initText();
});

btn.on("click", () => {
  // pixelDensity(1);
  createLoop({
    gif: { fileName: "worm.gif" },
  });
});
// adding inputs to pane
stringFolder.addInput(p, "string", {
  min: 10,
  max: 300,
  step: 1,
  label: "String Length",
}); 
stringFolder.addInput(p, "stringOrNot", { label: "String? What String?" });
stringFolder.addInput(p, "wCol", { label: "Worm Colour" });
stringFolder.addInput(p, "bCol", { label: "Background"})
wormFolder.addInput(p, "speed", { min: 1, max: 7, step: 1, label: "Speed" });
wormFolder.addInput(p, "squirmSize", {
  min: 10,
  max: 100,
  step: 5,
  label: "Squirm Width",
});
wormFolder.addInput(p, "squirmFactor", {
  min: 10,
  max: 30,
  step: 1,
  label: "Squirm Height",
});
wormFolder.addInput(p, "fuzziness", {
  min: 1,
  max: 1.5,
  step: 0.01,
  label: "Extra Fuzziness",
});

let textString = ``
let textWidths = [0];

function initText() {
textString = p.words;
textWidths = [0];

let tmpMessage = '';
  for (let char of textString) {
    tmpMessage += char;
    w = textWidth(tmpMessage);
    textWidths.push(w);
  }
}

/* SETUP
-----------------------------------------*/
function setup() {
  let canvas = createCanvas(500, 200);
  canvas.parent("p5-container");
  colorMode(HSL);
  frameRate(30);
  background(p.bCol);
  noStroke();
  createLoop();
  colour = palette[floor(random(palette.length))];
  textFont("Comic Neue")
  textAlign(LEFT, CENTER);
  textSize(12);

  let tmpMessage = '';
  for (let char of textString) {
    tmpMessage += char;
    w = textWidth(tmpMessage);
    textWidths.push(w);
  }
}

function draw() {
  background(p.bCol);
  translate(0, height / 2);

  let eyesY;
  let string = p.string;
  let start;
  if (p.stringOrNot) {
    start = 0;
  } else {
    start = string;
  }

  colour = p.wCol;

  for (let x = start; x < 200 + string; x += 1) {
    fill(0, 100, 100);
    //speed, squirm size, squirm factor
    let y =
      sin(animLoop.theta * p.speed + map(x, -100, p.squirmSize, 0, TWO_PI)) *
      p.squirmFactor;

    if (x <= string) {
      size = 1; //string range
    } else if (x <= string + 20) {
      size = 5; //snout range
    } else if (x <= string + 50) {
      size += 0.6;
    } else if (x <= string + 80) {
      size += 0.1;
    } else if (x <= string + 100) {
      size -= 0.55;
    } else {
      size -= 0.1;
    }
    if (x <= string) {
      fill(255);
    } else {
      fill(colour);
    }

    let newSize = size * p.fuzziness;
    if (x >= string) {
      circle(x, y, newSize);
    } else {
      circle(x, y, size);
    }
    if (x === floor(string) + 30) {
      eyesY = y;
    }
  }

  // eyes
  fill(255);
  circle(string + 30, eyesY + 4, 6);
  circle(string + 30, eyesY - 4, 6);
  fill(0);
  circle(string + 30.5, eyesY + 4, 4);
  circle(string + 30.5, eyesY - 4, 4);

  for (let i in textString) {
    let x = textWidths[i] 
    // + width/2;
    + (width - w) / 2;
    let y =
    sin(animLoop.theta * p.speed + map(x, -100, p.squirmSize, 0, TWO_PI)) *
    p.squirmFactor;
    fill(255);
    text(textString[i], x, y-  30);
  }
}
