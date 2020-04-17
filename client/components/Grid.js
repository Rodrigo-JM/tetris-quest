import React, { Component } from "react";
import { connect } from "react-redux";
import GridRow from "./GridRow";
import { createGrid } from "../redux/board";
import { createNewPiece, movePiece } from "../redux/pieces";
import { levelUp, newGame, pauseGame } from "../redux/game";
import {changeTheme} from "../redux/user"

const keysObj = {
  40: "down",
  37: "left",
  39: "right",
  32: "space",
  90: "z",
  88: "x",
  80: "p",
  38: "up"
};

let levelTimer;

class Grid extends Component {
  constructor() {
    super();
    this.handleKeys = this.handleKeys.bind(this);
    this.endGame = this.endGame.bind(this);
    this.gameTimer = this.gameTimer.bind(this);
  }

  componentDidMount() {
    this.props.build();
    this.createKeyEvent();
    this.gameTimer();
    this.props.createPiece(this.props.grid);

    if (this.props.user.theme) {
      this.selectTheme(this.props.user.theme)
    } else {
      this.selectTheme('wood')
    }

  }

  gameTimer() {
    levelTimer = setInterval(() => {
      let event = { keyCode: 40 };
      this.handleKeys(event);
    }, 1000 * (1 / (1 + 0.05 * this.props.level)));
  }

  selectTheme(theme) {
    if (document.body.className && document.body.className !== theme) {
      let themeSelector = document.getElementById(document.body.className)
      themeSelector.classList.toggle('selected')
      
      document.body.className = theme
      themeSelector = document.getElementById(theme)
  
      themeSelector.classList.toggle('selected')
    } else if (!document.body.className) {
      document.body.className = theme
      let themeSelector = document.getElementById(theme)
      
      themeSelector.classList.toggle('selected')

      
    }

    this.props.changeTheme(this.props.user, theme)
  }

  handleKeys(event) {
    const move = keysObj[event.keyCode];
    
    if (event.type && this.props.game.playing === true) {
      event.preventDefault();
    }

    if (move === "p" && this.props.game.playing === true) {
      clearInterval(levelTimer);
      this.props.pause();
    } else if (move === "p" && this.props.game.playing === "paused") {
      this.props.pause();
      this.gameTimer();
    } else if (this.props.game.playing === true) {
      this.props.movePiece(
        move,
        this.props.piece,
        this.props.board,
        this.props.game
      );
    }
  }

  createKeyEvent = () => {
    window.addEventListener("keydown", this.handleKeys);
  };

  endGame() {
    if (this.props.game && !this.props.game.playing) {
      clearInterval(levelTimer);
      return true;
    } else {
      return false;
    }
  }

  render() {
    return (
      <div className="view">
        {this.endGame() ? (
          <div className="end-game-message">
            <h1>Game over, bud</h1>
            <button
              onClick={() => {
                this.props.newGame();
                this.gameTimer();
              }}
            >
              Play Again
            </button>
          </div>
        ) : (
          <div className="game">
            {this.props.game.playing === "paused" ? (
              <div className="pause-overlay">
                <h1> Game Paused, press 'p' to unpause</h1>
              </div>
            ) : (
              ""
            )}
            <table>
              <tbody>
                {this.props.board
                  .map((row, index) => {
                    return (
                      <GridRow
                        index={index}
                        key={index}
                        row={row}
                        tiles={this.props.tiles}
                        preview={this.props.piece.preview}
                      />
                    );
                  })
                  .reverse()}
              </tbody>
            </table>
          </div>
        )}
        <ul>
          <li className="score">
            <h1>Level:</h1>
            <h1> {this.props.level}</h1>
          </li>
          <li className="score">
            <h1>Points</h1>
            <h1>{this.props.game.points}</h1>
          </li>
          <li className="nav-item has-dropdown">
            <a className="theme-selector" href="#">
              Theme
            </a>
            <ul className="dropdown">
              <li className="dropdown-item">
                <a id="wood" href="#" onClick={() => this.selectTheme('wood')}>
                  Wood
                </a>
              </li>
              <li className="dropdown-item">
                <a id="miami" href="#" onClick={() => this.selectTheme('miami')}>
                  Miami
                </a>
              </li>
              <li className="dropdown-item">
                <a id="candy" href="#" onClick={() => this.selectTheme('candy')}>
                  Candy
                </a>
              </li>
              <li className="dropdown-item" onClick={() => this.selectTheme('engine')}>
                <a id="engine" href="#">
                  Engine
                </a>
              </li>
              <li className="dropdown-item"onClick={() => this.selectTheme('super')}>
                <a id="super" href="#">
                  Super
                </a>
              </li>
            </ul>
          </li>
          <li>
            <h1>Controls</h1>
            <p>
              Use "left" and "right" arrows to move piece<br />
              "X" key and "up" arrow rotate piece clockwise<br />
              "Z" key to rotate counter-clockwise<br />
              "Down" key to drop 1 step <br />
              Use "space-bar" to drop piece totally
            </p>
          </li>
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    board: state.board,
    piece: state.piece,
    tiles: state.piece.tiles,
    level: state.game.level,
    game: state.game,
    user: state.user
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    build: () => dispatch(createGrid()),
    createPiece: (grid) => dispatch(createNewPiece(grid)),
    movePiece: (move, piece, grid, game) =>
      dispatch(movePiece(move, piece, grid, game)),
    levelUp: (level) => dispatch(levelUp(level)),
    newGame: () => dispatch(newGame()),
    pause: () => dispatch(pauseGame()),
    changeTheme: (user, theme) => dispatch(changeTheme(user,theme))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Grid);
