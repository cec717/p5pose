let square = true;
let heart = false;
let star = false;

const scale = 1; // scale the video image
const starpath = require ("./star2.jpg")
const heartpath = require ("./heart.jpg")

// video image dimensions
const width = 900 * scale;
const height = 650 * scale;

// setSketch (below) sets this to a p5 instance.
// In this file, the p5.js API functions are accessible as methods of this
// instance.
// See https://github.com/processing/p5.js/wiki/Global-and-instance-mode
let p5;

// setup initializes this to a p5.js Video instance.
let video;
let starimg;
let heartimg;
let button; 
let button2;
let button3;
let button4;
// index.js calls this to set p5 to the current p5 sketch instance, so that
// setup and draw can access it.
export function setSketch(sketch) {
  p5 = sketch;
}

function setSquare() {
   square = true;
   star = false;
}

function setStar() {
  square = false;
  star = true;
}

function setHeart() {
  square = false;
  star = false;
}

function setSave() {
  p5.save('myCanvas.jpg');
}

// p5js calls this code once when the page is loaded (and, during
// development, when the code is modified.)
export function setup() {
  p5.createCanvas(width, height);
  video = p5.select('video') || p5.createCapture(p5.VIDEO);
  video.size(width, height);
  starimg = p5.loadImage(starpath);
  heartimg = p5.loadImage(heartpath);
  button = p5.createButton('star');
  button.mousePressed(setStar);
  button2 = p5.createButton('heart');
  button2.mousePressed(setHeart);
  button3 = p5.createButton('square');
  button3.mousePressed(setSquare);
  button4 = p5.createButton('saveCanvas');
  button4.mousePressed(setSave);

  // Create a new poseNet method with single-pose detection.
  // The second argument is a function that is called when the model is
  // loaded. It hides the HTML element that displays the "Loading model…" text.
  const poseNet = ml5.poseNet(video, () => p5.select('#status').hide());

  // Every time we get a new pose, apply the function `drawPoses` to it
  // (call `drawPoses(poses)`) to draw it.
  poseNet.on('pose', drawPoses);

  // Hide the video element, and just show the canvas
  video.hide();
}

// p5js calls this function once per animation frame. In this program, it
// does nothing---instead, the call to `poseNet.on` in `setup` (above) specifies
// a function that is applied to the list of poses whenever PoseNet processes
// a video frame.
export function draw() {}


function drawPoses(poses) {
 

  // Modify the graphics context to flip all remaining drawing horizontally.
  // This makes the image act like a mirror (reversing left and right); this
  // is easier to work with.
  p5.translate(width, 0); // move the left side of the image to the right
  p5.scale(-1.0, 1.0);
  p5.image(video, 0, 0, video.width, video.height);
  drawKeypoints(poses);
  drawSkeleton(poses);
}

// Draw ellipses over the detected keypoints
function drawKeypoints(poses) {
  poses.forEach((pose) =>
    pose.pose.keypoints.forEach((keypoint) => {
      if (keypoint.score > 0.2) {
        p5.fill(250, 150, 80);
        p5.noStroke();
        if (square) {
          p5.square(keypoint.position.x, keypoint.position.y, 20);
        }else if (star) {
          p5.image(starimg, keypoint.position.x, keypoint.position.y, 25, 25);
          }else {
          p5.image(heartimg, keypoint.position.x, keypoint.position.y, 25, 25);
          }
      //   p5.square(keypoint.position.x, keypoint.position.y, 20);
      //   p5.image(starimg, keypoint.position.x, keypoint.position.y, 25, 25);
      //   p5.image(heartimg, keypoint.position.x, keypoint.position.y, 25, 25);
      }
    })
  );
  
}

// Draw connections between the skeleton joints.
function drawSkeleton(poses) {
  poses.forEach((pose) => {
    pose.skeleton.forEach((skeleton) => {
      // skeleton is an array of two keypoints. Extract the keypoints.
      const [p1, p2] = skeleton;
      p5.stroke(255, 100, 200);
      p5.strokeWeight(5,10,15,10);
      p5.line(p1.position.x, p1.position.y, p2.position.x, p2.position.y);
      
    });
  });
}
