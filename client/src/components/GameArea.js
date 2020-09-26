export default function GameArea(canvas, updateGameArea, context, gameClass) {
  this.pause = false;
  this.frameNo = 0;
  this.start = function () {
    this.interval = setInterval(updateGameArea, 20);
  }
  this.stop = function () {
    clearInterval(this.interval);
    this.pause = true;
    console.log(gameClass.isRunning)
    gameClass.isRunning = false;
  }
  this.clear = function () {
    window.requestAnimationFrame(() => {
      context.clearRect(0, 0, canvas.width, canvas.height);
    })
  }
}