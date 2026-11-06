// Data sketch: My Week in Photos
// Each day is one circle.
//   x position -> day of the week (Mon to Sun)
//   y position -> mood, ordered from low energy (bottom) to high energy (top)
//   area       -> number of photos taken (square-root scale, so area is proportional)
//   color      -> subject of the photos

const MOODS = ["Relaxed", "Calm", "Happy", "Energetic", "Excited", "Hectic"]; // bottom to top
const SUBJECTS = {
  "Everyday life": [140, 120, 100],
  "Sports": [230, 110, 50],
  "Friends": [220, 80, 140],
  "Nature": [70, 160, 90],
  "My dog": [60, 130, 220]
};

const PLOT = { left: 130, right: 920, top: 90, bottom: 400 };
const MAX_PHOTOS = 400;
const MAX_D = 100;
const MIN_D = 12;

let data;

async function setup() {
  data = await loadJSON("data.json");
  createCanvas(960, 640);
  textFont("sans-serif");
  noLoop();
}

function draw() {
  background(250, 246, 240);
  drawTitle();
  drawAxes();
  const days = data.days;
  for (let i = 0; i < days.length; i++) {
    drawDay(days[i], i);
  }
  drawLegend();
}

function dayX(i) {
  return map(i, 0, 6, PLOT.left + 60, PLOT.right - 60);
}

function moodY(mood) {
  const level = MOODS.indexOf(mood);
  return map(level, 0, MOODS.length - 1, PLOT.bottom - 40, PLOT.top + 40);
}

function photoDiameter(photos) {
  // sqrt scale: circle area is proportional to number of photos
  return max(MIN_D, map(sqrt(photos), 0, sqrt(MAX_PHOTOS), 0, MAX_D));
}

function drawTitle() {
  noStroke();
  fill(40);
  textAlign(LEFT, TOP);
  textSize(24);
  text(data.title, 30, 24);
  textSize(13);
  fill(110);
  text("Each circle is one day. See the legend below.", 30, 56);
}

function drawAxes() {
  textSize(12);
  textAlign(RIGHT, CENTER);
  for (const m of MOODS) {
    const y = moodY(m);
    stroke(225, 218, 208);
    strokeWeight(1);
    line(PLOT.left, y, PLOT.right, y);
    noStroke();
    fill(100);
    text(m, PLOT.left - 12, y);
  }
  textAlign(CENTER, TOP);
  textSize(13);
  fill(70);
  for (let i = 0; i < data.days.length; i++) {
    text(data.days[i].day, dayX(i), PLOT.bottom + 8);
  }
}

function drawDay(d, i) {
  const x = dayX(i);
  const y = moodY(d.mood);
  const diameter = photoDiameter(d.photos);
  const c = SUBJECTS[d.subject];

  stroke(c[0], c[1], c[2]);
  strokeWeight(2);
  fill(c[0], c[1], c[2], 190);
  circle(x, y, diameter);

  noStroke();
  fill(50);
  textAlign(CENTER, CENTER);
  textSize(12);
  text(d.photos, x, y + diameter / 2 + 12);
}

function drawLegend() {
  const ly = 450;
  noStroke();
  fill(40);
  textAlign(LEFT, TOP);
  textSize(15);
  text("How to read this", 30, ly - 10);
  textSize(12);

  // Size = photos
  fill(80);
  text("Size (area) = photos taken", 30, ly + 20);
  const counts = [10, 100, 380];
  let cx = 60;
  for (const n of counts) {
    const dd = photoDiameter(n);
    noFill();
    stroke(120);
    strokeWeight(1.5);
    circle(cx + dd / 2 - 10, ly + 100, dd);
    noStroke();
    fill(80);
    textAlign(CENTER, TOP);
    text(n, cx + dd / 2 - 10, ly + 100 + MAX_D / 2 + 4);
    cx += dd + 40;
  }

  // Color = subject
  textAlign(LEFT, TOP);
  fill(80);
  text("Color = subject of the photos", 400, ly + 20);
  let row = 0;
  for (const name in SUBJECTS) {
    const c = SUBJECTS[name];
    const yy = ly + 50 + row * 24;
    stroke(c[0], c[1], c[2]);
    strokeWeight(2);
    fill(c[0], c[1], c[2], 190);
    circle(412, yy + 6, 16);
    noStroke();
    fill(80);
    textAlign(LEFT, CENTER);
    text(name, 430, yy + 6);
    row++;
  }

  // Position notes
  textAlign(LEFT, TOP);
  fill(80);
  text("Position", 680, ly + 20);
  text("Left to right: Monday to Sunday.", 680, ly + 44);
  text("Bottom to top: mood from low", 680, ly + 68);
  text("energy (Relaxed) to high energy", 680, ly + 86);
  text("(Hectic). The order is my own choice.", 680, ly + 104);
}



