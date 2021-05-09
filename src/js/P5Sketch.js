import React, { useRef, useEffect } from "react";
import "./helpers/Globals";
import "p5/lib/addons/p5.sound";
import * as p5 from "p5";
import audio from "../audio/memories-no-1.ogg";
import cueSet1 from "./cueSet1.js";
import ShuffleArray from "./functions/ShuffleArray.js";
import SaveJSONToFile from "./functions/SaveJSONToFile.js";
import image from "../images/Lego-Land-Johor-Bahru-2015.jpg";

const P5Sketch = () => {
  const sketchRef = useRef();

  const Sketch = (p) => {
    p.canvas = null;

    p.canvasWidth = window.innerWidth;

    p.canvasHeight = window.innerHeight;

    p.files = [
      'Raohe-Street-Night-Market-2018.json',
      'Cuba-St-Festival-2018.json',
      'Tian-Tan-Buddha-2019.json',
      'Lego-Land-Johor-Bahru-2015.json',
    ]

    p.imageData = {};

    p.circleData = [];

    p.cueSet1Completed = [];

    p.circleMultiplier = 32;

    p.preload = () => {
      //p.img = p.loadImage(image);
      p.song = p.loadSound(audio);
      p.imageData = require('./json/' + p.random(p.files));
    };

    p.setup = () => {
      //p.saveImageData('Lego-Land-Johor-Bahru-2015')
      p.canvas = p.createCanvas(p.canvasWidth, p.canvasHeight);
      p.background(255);
      p.noLoop();
      p.loadCircleData(p.circleMultiplier);

      p.song.onended(p.logCredits);

      for (let i = 0; i < cueSet1.length; i++) {
         let vars = {
            'currentCue': (i + 1),
            'duration': cueSet1[i].duration,
            'durationTicks': cueSet1[i].durationTicks,
        }
        p.song.addCue(cueSet1[i].time, p.executeCueSet1, vars);
      }
    };

    p.draw = () => {
      
    };


    p.executeCueSet1 = (vars) => {
      const currentCue = vars.currentCue;
      if (!p.cueSet1Completed.includes(currentCue)) {
        p.cueSet1Completed.push(currentCue);
        const notesPerLoop = (cueSet1.length / 3); 
        let modulo = currentCue % notesPerLoop;
        modulo = modulo ? modulo : notesPerLoop;
        if(modulo === 1 && currentCue > 1){
          p.background(255);
          p.circleMultiplier = p.circleMultiplier - 16;
          p.loadCircleData(p.circleMultiplier);
        }

        const numItemsToDraw = Math.ceil(p.circleData.length / notesPerLoop); 
        const startIndex = numItemsToDraw * modulo - numItemsToDraw; 
        const endIndex = p.circleData.length < numItemsToDraw * modulo ? p.circleData.length : numItemsToDraw * modulo;
        for (let i = startIndex; i < endIndex; i++) {
            const circle = p.circleData[i];
            p.fill(circle.c[0], circle.c[1], circle.c[2], 200);
            //p.stroke(circle.c);
            p.ellipse(circle.x, circle.y, circle.r, circle.r);
        }
      }
    };

    // multiplier must be a power of 2
    p.loadCircleData = (multiplier = 4) => {
      multiplier = multiplier ? multiplier : 4;
      const startPos = multiplier <= 2 ? multiplier : multiplier + 2;
      let array = [];
      for (let x = startPos; x < p.width; x = x + (multiplier * 2)) {
        for (let y = startPos; y < p.height; y = y + (multiplier * 2)) {
          const key = x + ',' + y;
          const circle = p.imageData[key];
          array.push(
            {
              x: x,
              y: y,
              c: circle.colour,
              r: multiplier * 2
            }
          )
        }
      }

      p.circleData = ShuffleArray(array);
    }

    p.mousePressed = () => {
      if (p.song.isPlaying()) {
        p.song.pause();
      } else {
        if (
          parseInt(p.song.currentTime()) >= parseInt(p.song.buffer.duration)
        ) {
          p.reset();
        }
        //document.getElementById("play-icon").classList.add("fade-out");
        p.canvas.addClass("fade-in");
        p.song.play();
      }
    };

    p.creditsLogged = false;

    p.logCredits = () => {
      if (
        !p.creditsLogged &&
        parseInt(p.song.currentTime()) >= parseInt(p.song.buffer.duration)
      ) {
        p.creditsLogged = true;
        console.log(
          "Music: http://labcat.nz/",
          "\n",
          "Animation: https://github.com/LABCAT/memories-no-1"
        );
      }
    };

    p.reset = () => {
      p.clear();
    };

    p.saveImageData = (filename) => {
      p.image(p.img, 0, 0);
      for (let x = 2; x < 1920; x = x + 4) {
        for (let y = 2; y < 1080; y = y + 4) {
          const key = x + ',' + y;
          const c = p.img.get(
            x,
            y
          );
          console.log(key);
          p.imageData[key] = {
            r: 2,
            c: c
          }
        }
      }
      SaveJSONToFile(p.imageData, filename);
    };

    p.updateCanvasDimensions = () => {
      p.canvasWidth = window.innerWidth;
      p.canvasHeight = window.innerHeight;
      p.createCanvas(p.canvasWidth, p.canvasHeight);
      p.redraw();
    };

    if (window.attachEvent) {
      window.attachEvent("onresize", function () {
        p.updateCanvasDimensions();
      });
    } else if (window.addEventListener) {
      window.addEventListener(
        "resize",
        function () {
          p.updateCanvasDimensions();
        },
        true
      );
    } else {
      //The browser does not support Javascript event binding
    }
  };

  useEffect(() => {
    new p5(Sketch, sketchRef.current);
  }, []);

  return <div ref={sketchRef}></div>;
};

export default P5Sketch;
