import React, { Component } from "react";
import { connect } from "react-redux";
import GridRow from "./GridRow";
import { createGrid } from "../redux/board";
import { createNewPiece, movePiece } from "../redux/pieces";
import { levelUp, newGame } from "../redux/game";

const keysObj = {
  40: "down",
  37: "left",
  39: "right",
  32: "space",
  90: "z",
  88: "x",
};

let levelTimer;

class Grid extends Component {
  constructor() {
    super();
    this.handleKeys = this.handleKeys.bind(this);
    this.endGame = this.endGame.bind(this)
    this.gameTimer = this.gameTimer.bind(this);
  }

  componentDidMount() {
    this.props.build();
    this.createKeyEvent();
    this.gameTimer();
    this.props.createPiece(this.props.grid);
  }

  gameTimer() {
    // levelTimer = setInterval(() => {
    //   let event = { keyCode: 40 };
    //   this.handleKeys(event);
    // }, this.props.level * 1000);
  }

  handleKeys(event) {
    const move = keysObj[event.keyCode];
    this.props.movePiece(move, this.props.piece, this.props.board);
  }

  createKeyEvent = () => {
    window.addEventListener("keydown", this.handleKeys);
  };

  endGame() {
    if (this.props.game && !this.props.game.playing) {
      clearInterval(levelTimer)
      return true
    } else {
      return false
    }

  }

  render() {
    return (
      <div>
        {(this.endGame()) ? <div><h1>Game over, bud</h1>
        <button onClick={() => {
          this.props.newGame() 
          this.gameTimer()
        }
        }>Play Again</button></div>:
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
        </table>}
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
    movePiece: (move, piece, grid) => dispatch(movePiece(move, piece, grid)),
    levelUp: (level) => dispatch(levelUp(level)),
    newGame: () => dispatch(newGame()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Grid);
