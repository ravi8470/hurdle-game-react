import axios from 'axios';
import React, { Component } from 'react';
import GameArea from '../components/GameArea';
import GameComponent from '../components/GameComponent';
import { ALLOW_PLAY, POST_SCORE } from '../constants/Urls';

export default class Game extends Component {

  constructor() {
    super();
    this.state = {
      highScore: JSON.parse(localStorage.getItem("tokens")).highScore
    }
  }

  myRef = React.createRef();
  canvas = null;
  context = null;
  myGameArea = null;
  myObstacles = [];
  myGamePiece = null;
  myscore = null;
  // highScore = JSON.parse(localStorage.getItem("tokens")).highScore;
  animationId = null;

  updateGameArea = () => {
    var x, y, min, max, height, gap;
    for (let i = 0; i < this.myObstacles.length; i += 1) {
      if (this.myGamePiece.crashWith(this.myObstacles[i])) {
        this.myGameArea.stop();
        // document.getElementById("myfilter").style.display = "block";
        // document.getElementById("myrestartbutton").style.display = "block";
        return;
      }
    }
    if (this.myObstacles.length > 18) {
      // this.myObstacles.splice(0, 6)
      // this.myObstacles = this.myObstacles.slice(-6)
      this.myObstacles = this.myObstacles.filter(x => x.x > -10);
    }
    if (this.myGameArea.pause === false) {
      this.myGameArea.clear();
      this.myGameArea.frameNo += 1;
      this.myscore.score += 1;
      if (this.myGameArea.frameNo === 1 || this.myGameArea.frameNo % 150 === 0) {
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
      // Prevent overflow of game piece from game area
      if (this.myGamePiece.x < 0) this.myGamePiece.x = 0;
      if (this.myGamePiece.x > (this.canvas.width - this.myGamePiece.width)) {
        this.myGamePiece.x = this.canvas.width - this.myGamePiece.width;
      }
      if (this.myGamePiece.y < 0) this.myGamePiece.y = 0;
      if (this.myGamePiece.y > (this.canvas.height - this.myGamePiece.height)) {
        this.myGamePiece.y = this.canvas.height - this.myGamePiece.height;
      }
      this.myGamePiece.update();
    }
    for (let i = 0; i < this.myObstacles.length; i += 1) {
      if (this.myGamePiece.crashWith(this.myObstacles[i])) {
        this.myGameArea.stop();
        // document.getElementById("myfilter").style.display = "block";
        // document.getElementById("myrestartbutton").style.display = "block";
        return;
      }
      this.myObstacles[i].x += -1;
      (this.myObstacles[i].x > -10) && this.myObstacles[i].update();
    }
    this.animationId = window.requestAnimationFrame(this.updateGameArea)
  }

  preStartCheck = () => {
    if(this.isRunning){
      return
    }
    axios.get(ALLOW_PLAY, { headers: { 'token': this.getToken() } })
      .then(result => {
        if (result.status === 200) {
          if (result.data && result.data.gameCount > 12) {
            window.alert('You have already played 12 times today.Try tomorrow!')
          } else {
            this.startGame()
          }
        }
      }).catch(e => {
        window.alert('You have already played 12 times today.Try tomorrow!')
      })
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
    // this.myGameArea.start();
    window.requestAnimationFrame(this.updateGameArea)
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

  getToken = () => {
    let token = JSON.parse(localStorage.getItem("tokens")).token;
    return token;
  }

  postScore = () => {
    let tokenx = this.getToken();
    if (this.myscore.score > this.state.highScore) {
      // this.state.highScore = this.myscore.score;
      this.setState({ highScore: this.myscore.score });
      localStorage.setItem('tokens', JSON.stringify(
        { token: tokenx, highScore: this.state.highScore }
      ));
    }
    axios.post(POST_SCORE, { score: this.myscore.score }, { headers: { 'token': tokenx } })
      .then(result => {
        if (result.status === 200) {
          this.setState({ ...this.state, scorePostError: true });
        }
      }).catch(e => {
        this.setState({ ...this.state, scorePostError: true });
      }).finally(e => {
        this.isRunning = false;
      });
  }

  // keyboard handling
  handleKeyDown = e => {
    if (!this.isRunning) return;
    switch (e.key) {
      case 'ArrowUp': this.moveup(); break;
      case 'ArrowDown': this.movedown(); break;
      case 'ArrowLeft': this.moveleft(); break;
      case 'ArrowRight': this.moveright(); break;
      default: return;
    }
  }

  handleKeyUp = e => {
    if (!this.isRunning) return;
    switch (e.key) {
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight': this.clearmove(); break;
      default: return;
    }
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
    this.myGameArea && this.myGameArea.clearMem();
    this.myRef = null;
    this.canvas = null;
    this.context = null;
    this.myGameArea = null;
    this.myObstacles = null;
    this.myGamePiece = null;
    this.myscore = null;
    window.cancelAnimationFrame(this.animationId)
  }

  render() {
    return (
      <>
        {/* {(this.state.scorePostError) && (<h4 style={{ color: 'red' }}>Error in Posting Score!</h4>)} */}
        <h2>High Score:{this.state.highScore}</h2>
        <canvas ref={this.myRef} className='canvasClass' /><br />
        <button onClick={this.preStartCheck}>Start Game</button>
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