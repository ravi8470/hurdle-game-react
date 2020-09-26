import React, { Component } from 'react';
import GameArea from '../components/GameArea';
import GameComponent from '../components/GameComponent';

export default class Game extends Component {

  myRef = React.createRef();
  canvas = null;
  context = null;
  myGameArea = null;
  myObstacles = [];
  myGamePiece = null;
  myscore = null;
  isRunning = false;

  updateGameArea = () => {
    var x, y, min, max, height, gap;
    for (let i = 0; i < this.myObstacles.length; i += 1) {
      if (this.myGamePiece.crashWith(this.myObstacles[i])) {
        this.myGameArea.stop();
        console.log(this.myObstacles)
        // document.getElementById("myfilter").style.display = "block";
        // document.getElementById("myrestartbutton").style.display = "block";
        return;
      }
    }
    console.log(this.myObstacles.length)
    if (this.myObstacles.length > 18) {
      // this.myObstacles.splice(0, 6)
      // this.myObstacles = this.myObstacles.slice(-6)
      this.myObstacles = this.myObstacles.filter(x => x.x > -10);
    }
    if (this.myGameArea.pause == false) {
      this.myGameArea.clear();
      this.myGameArea.frameNo += 1;
      this.myscore.score += 1;
      if (this.myGameArea.frameNo == 1 || this.myGameArea.frameNo % 150 == 0) {
        x = this.canvas.width;
        y = this.canvas.height - 100;
        min = 20;
        max = 100;
        height = Math.floor(Math.random() * (max - min + 1) + min);
        min = 50;
        max = 100;
        gap = Math.floor(Math.random() * (max - min + 1) + min);
        this.myObstacles.push(new GameComponent(10, height, "green", x, 0, null, this.context));
        this.myObstacles.push(new GameComponent(10, x - height - gap, "green", x, height + gap, null, this.context));
      }
      // for (let i = 0; i < this.myObstacles.length; i += 1) {
      //   this.myObstacles[i].x += -1;
      //   (this.myObstacles[i].x > -10) && this.myObstacles[i].update();
      // }
      this.myscore.text = "SCORE: " + this.myscore.score;
      this.myscore.update();
      this.myGamePiece.x += this.myGamePiece.speedX;
      this.myGamePiece.y += this.myGamePiece.speedY;
      this.myGamePiece.update();
    }
    for (let i = 0; i < this.myObstacles.length; i += 1) {
      if (this.myGamePiece.crashWith(this.myObstacles[i])) {
        this.myGameArea.stop();
        console.log(this.myObstacles)
        // document.getElementById("myfilter").style.display = "block";
        // document.getElementById("myrestartbutton").style.display = "block";
        return;
      }
      this.myObstacles[i].x += -1;
      (this.myObstacles[i].x > -10) && this.myObstacles[i].update();
    }
  }

  startGame = () => {
    this.canvas = this.myRef.current;
    this.canvas.width = this.canvas.getBoundingClientRect().width;
    this.canvas.height = this.canvas.getBoundingClientRect().height;
    this.context = this.canvas.getContext('2d');
    this.myGameArea = new GameArea({ width: this.canvas.width, height: this.canvas.height }, this.updateGameArea, this.context, this);
    this.myscore = new GameComponent(null, null, "black", 260, 25, "text", this.context);
    this.myGamePiece = new GameComponent(30, 30, "red", 10, 75, null, this.context);
    this.myObstacles = [];
    this.isRunning = true;
    this.myGameArea.start();
  }

  moveup = () => {
    this.isRunning && (this.myGamePiece.speedY = -1);
  }

  movedown = () => {
    this.isRunning && (this.myGamePiece.speedY = 1);
  }

  moveleft = () => {
    this.isRunning && (this.myGamePiece.speedX = -1);
  }

  moveright = () => {
    this.isRunning && (this.myGamePiece.speedX = 1);
  }

  clearmove = () => {
    this.isRunning && (this.myGamePiece.speedX = 0);
    this.isRunning && (this.myGamePiece.speedY = 0);
  }

  handleKeyDown = e => {
    if (!this.isRunning) return;
    switch (e.key) {
      case 'ArrowUp': this.moveup(); break;
      case 'ArrowDown': this.movedown(); break;
      case 'ArrowLeft': this.moveleft(); break;
      case 'ArrowRight': this.moveright(); break;
    }
  }

  handleKeyUp = e => {
    if (!this.isRunning) return;
    switch (e.key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight': this.clearmove();
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
  }

  render() {
    return (
      <>
        <canvas ref={this.myRef} className='canvasClass' /><br />
        <button onClick={() => this.startGame()}>Start Game</button>
        <div className='controlButtons'>
          <button style={{ marginLeft: '30px' }} onTouchStart={this.moveup}
            onMouseDown={this.moveup} onMouseUp={this.clearmove}>UP
          </button><br /><br />
          <button onTouchStart={this.moveleft} onMouseDown={this.moveleft}
            onMouseUp={this.clearmove}>LEFT
          </button>
          <button onTouchStart={this.moveright} onMouseDown={this.moveright}
            onMouseUp={this.clearmove}>RIGHT
          </button><br /><br />
          <button style={{ marginLeft: '30px' }}
            onTouchStart={this.movedown} onMouseDown={this.movedown} onMouseUp={this.clearmove}>DOWN
          </button>
        </div>
      </>
    )
  }
}