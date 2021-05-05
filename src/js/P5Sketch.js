import React, { useRef, useEffect } from "react";
import "./helpers/Globals";
import "p5/lib/addons/p5.sound";
import * as p5 from "p5";
import SaveJSONToFile from "./functions/SaveJSONToFile.js";
//import image from "../images/Tian-Tan-Buddha-2019.jpg";

const P5Sketch = () => {
  const sketchRef = useRef();

  const Sketch = (p) => {
    p.canvas = null;

    p.canvasWidth = window.innerWidth;

    p.canvasHeight = window.innerHeight;

    p.img = "";

    p.k = 0;

    p.files = [
      'Raohe-Street-Night-Market-2018.json',
      'Cuba-St-Festival-2018.json',
      'Tian-Tan-Buddha-2019.json'
    ]

    p.circles = {};

    p.preload = () => {
      //p.img = p.loadImage(image);
      p.circles = require('./json/' + p.random(p.files));
    };

    p.setup = () => {
      p.canvas = p.createCanvas(p.canvasWidth, p.canvasHeight);
      p.noLoop();
    };

    p.saveImageData = () => {
      p.image(p.img, 0, 0);
      for (let x = 2; x < 1920; x = x + 4) {
        for (let y = 2; y < 1080; y = y + 4) {
          const key = x + ',' + y;
          const c = p.img.get(
            x,
            y
          );
          p.circles[key] = {
            r: 2,
            c: c
          }
        }
      }
      SaveJSONToFile(p.circles, 'Tian-Tan-Buddha-2019');
    };

    p.draw = () => {
      p.background(255);
      const multiplier = 4;//must be a power of 2
      const startPos = multiplier <= 2 ? multiplier : multiplier + 2;
     
      for (let x = startPos; x < p.width; x = x + (multiplier * 2)) {
        for (let y = startPos; y < p.height; y = y + (multiplier * 2)) {
          const key = x + ',' + y;
          const circle = p.circles[key];
          p.fill(circle.colour[0], circle.colour[1], circle.colour[2], 200);
          p.stroke(circle.colour);
          p.ellipse(x, y, multiplier * 2, multiplier * 2);
        }
      }

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
