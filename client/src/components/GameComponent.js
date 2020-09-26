export default function GameComponent(width, height, color, x, y, type, ctx) {
  this.type = type;
  if (type === "text") {
    this.text = color;
  }
  this.score = 0; this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.update = function () {
    if (this.type === "text") {
      // ctx.font = this.width + " " + this.height ;
      // window.requestAnimationFrame(() => {
        ctx.font = 'normal normal 900 20px Consolas'
        ctx.fillStyle = color;
        ctx.fillText(this.text, this.x, this.y);
      // })
    } else {
      // window.requestAnimationFrame(() => {
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
      // })
    }
  }
  this.crashWith = function (otherobj) {
    if (otherobj.x < 0) return false;
    var myleft = this.x;
    var myright = this.x + (this.width);
    var mytop = this.y;
    var mybottom = this.y + (this.height);
    var otherleft = otherobj.x;
    var otherright = otherobj.x + (otherobj.width);
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + (otherobj.height);
    var crash = true;
    if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
      crash = false;
    }
    return crash;
  }
}