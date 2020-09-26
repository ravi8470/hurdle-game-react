export default function GameArea(canvas, updateGameArea, context, gameClass) {
  this.pause = false;
  this.frameNo = 0;
  this.start = function () {
    this.interval = setInterval(updateGameArea, 20);
  }
  this.stop = function () {
    this.clear();
    clearInterval(this.interval);
    this.pause = true;
    let prevHighScore = gameClass.state.highScore;
    // window.requestAnimationFrame(() => {
    //   context.font = 'normal normal 900 20px Consolas'
    //   context.fillStyle = 'red';
    //   context.fillText(`Game Over!! Score: ${gameClass.myscore.score}`, canvas.width / 5, canvas.height / 3);
    //   if (gameClass.myscore.score > prevHighScore) {
    //     context.fillText(`High Score Achieved!!!`, canvas.width / 5, canvas.height / 4);
    //   }
    // })
    context.font = 'normal normal 900 20px Consolas'
    context.fillStyle = 'red';
    context.fillText(`Game Over!! Score: ${gameClass.myscore.score}`, canvas.width / 5, canvas.height / 3);
    if (gameClass.myscore.score > prevHighScore) {
      context.fillText(`High Score Achieved!!!`, canvas.width / 5, canvas.height / 4);
    }

    gameClass.postScore();
  }

  this.clearMem = function () {
    clearInterval(this.interval);
  }
  this.clear = function () {
    // window.requestAnimationFrame(() => {
      context.clearRect(0, 0, canvas.width, canvas.height);
    // })
  }
}