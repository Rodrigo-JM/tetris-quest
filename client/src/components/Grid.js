import React, { Component } from "react";
import { connect } from "react-redux";
import GridRow from "./GridRow";
import { createGrid } from "../redux/board";
import { createNewPiece, movePiece } from "../redux/pieces";
import { levelUp, newGame, pauseGame } from "../redux/game";

const keysObj = {
  40: "down",
  37: "left",
  39: "right",
  32: "space",
  90: "z",
  88: "x",
  80: "p",
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
  }

  gameTimer() {
    levelTimer = setInterval(() => {
      let event = { keyCode: 40 };
      this.handleKeys(event);
    }, 1000 * (1 / (1 + 0.05 * this.props.level)));
  }

  handleKeys(event) {
    console.log(event.keyCode);
    const move = keysObj[event.keyCode];
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
          <div>
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
        <div>
          <div className="score">
            <h1>Level:</h1><h1> {this.props.level}</h1>
          </div>
          <div className="score">
            <h1>Points</h1><h1>{this.props.game.points}</h1>
          </div>
        </div>
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Grid);
