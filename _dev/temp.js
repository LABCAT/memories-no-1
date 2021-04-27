
import React, { useRef, useEffect } from "react";
import "./helpers/Globals";
import "p5/lib/addons/p5.sound";
import * as p5 from "p5";
import Circle from "./Circle.js";
import image from "../images/Cuba-St-Festival-2018.jpg";

const P5Sketch = () => {
  const sketchRef = useRef();

  const Sketch = (p) => {
    p.canvas = null;

    p.canvasWidth = window.innerWidth;

    p.canvasHeight = window.innerHeight;

    p.img = "";

    p.k = 0;

    p.circles = [];

    p.preload = () => {
      p.img = p.loadImage(image);
    };

    p.setup = () => {
      p.canvas = p.createCanvas(p.canvasWidth, p.canvasHeight);
      p.imageMode(p.CENTER);
      p.image(p.img, 0, 0);
      let colour = p.get(p.width / 2, p.height / 2);
      colour = p.color(colour, 80);
      const circle = new Circle(
        p,
        p.width >> 1,
        p.height >> 1,
        p.width / 2,
        colour
      );
      // p.loadPixels();
      // console.log(p.pixels);
      // for (let i = 0; i < p.pixels.length; i = i + 64) {
        
      // }
      
      // p.circles.push(circle);
      // let index = 0;
      // for(var y = 0; y < p.height; y++) {
      //     for(var x = 0; x < p.width; x++){
      //       let colour = p.color(p.pixels[index], p.pixels[index+1], p.pixels[index+2], p.pixels[index+3]);
      //       // const newCircle = new Circle(
      //       //     p,
      //       //     x,
      //       //     y,
      //       //     1 / 2,
      //       //     colour
      //       //   );
      //         p.circles.push(
      //           {
      //             x: x, 
      //             y: y,
      //             colour: colour
      //           }
      //         );
      //         index = index + 4;
      //     }
          
      // }
    };

    //https://openprocessing.org/sketch/200114
    p.draw = () => {
      p.background(255);

      if (p.k < 1) {
        p.image(p.img, p.width / 2, p.height / 2);
      }

      for (let i = 0; i < p.circles.length; i++) {
        const circle = p.circles[i];
        circle.show()

      }


      for (let i = 0; i < p.circles.length; i++) {
        const circle = p.circles[i];
        if (p.dist(p.mouseX, p.mouseY, circle.x, circle.y) < circle.r) {
          p.k = 2;
          p.circles.splice(i, 1);
          for (let kx = 0; kx < 2; kx++) {
            for (let ky = 0; ky < 2; ky++) {
              let c = p.img.get(
                p.int((p.pow(-1, kx) * circle.r) / 2 + circle.x),
                p.int((p.pow(-1, ky) * circle.r) / 2 + circle.y)
              );
              const newCircle = new Circle(
                p,
                (p.pow(-1, kx) * circle.r) / 2 + circle.x,
                (p.pow(-1, ky) * circle.r) / 2 + circle.y,
                circle.r / 2,
                c
              );
              p.circles.push(newCircle);
              p.press = false;
            }
          }
        }
      }
    };

    p.press = false;

    p.mouseDragged = () => {
      p.press = true;
      p.k++;
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
