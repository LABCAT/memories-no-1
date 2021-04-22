export default class Circle {
  constructor(p5, x, y, r, c) {
    this.p5 = p5;
    this.x = x;
    this.y = y;
    this.r = r;
    this.c = c;
  }
  show() {
    //this.p5.noStroke();
    this.p5.fill(this.c);
    this.p5.ellipse(this.x, this.y, 2 * this.r, 2 * this.r);
  }
}
