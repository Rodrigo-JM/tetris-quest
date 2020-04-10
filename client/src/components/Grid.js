import React, { Component } from "react";
import { connect } from "react-redux";
import GridRow from "./GridRow";
import { createGrid } from "../redux/board";
import { createPiece, movePiece } from "../redux/pieces";
import { createTiles } from "../redux/piece";
import { levelUp } from "../redux/game";

const keysObj = {
  40: "down",
  37: "left",
  39: "right",
  32: "space",
  90: "z",
  88: "x",
};

let currentPieceLocation = [];

const locationChanged = (location) => {
  if (
    location[0] !== currentPieceLocation[0] ||
    location[1] !== currentPieceLocation[1]
  ) {
    currentPieceLocation = location;
    return true;
  } else {
    return false;
  }
};

const rotationChanged = (newRotation, oldRotationIndex) => {
  if (newRotation === oldRotationIndex) {
    return false;
  } else {
    return true;
  }
};

let levelTimer;

export class Grid extends Component {
  constructor() {
    super();
    this.handleKeys = this.handleKeys.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.gameTimer = this.gameTimer.bind(this);
  }

  componentDidMount() {
    this.props.build();
    this.createKeyEvent();
    this.gameTimer();
    this.props.createPiece(null, 'S');
  }

  gameTimer() {

    // levelTimer = setInterval(
    //   () => {
    //       let event = {keyCode: 40} 
    //       this.handleKeys(event)
    //   },
    //   this.props.level * 1000
    // );
  }

  handleUpdate() {
      this.props.createTiles(this.props.piece, this.props.board);
  }

  handleKeys(event) {
    const move = keysObj[event.keyCode];
    this.props.movePiece(move, this.props.piece);

    this.handleUpdate();
  }

  createKeyEvent = () => {
    window.addEventListener("keydown", this.handleKeys);
  };

  render() {
    return (
      <table>
        <tbody>
          {this.props.board
            .map((row, index) => {
              return <GridRow index={index} key={index} row={row} />;
            })
            .reverse()}
        </tbody>
      </table>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    board: state.board,
    piece: state.piece,
    tiles: state.pieceTiles,
    level: state.level,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    build: () => dispatch(createGrid()),
    createPiece: (center, type) => dispatch(createPiece(center, type)),
    createTiles: (piece, grid) => dispatch(createTiles(piece, grid)),
    movePiece: (move, piece) => dispatch(movePiece(move, piece)),
    levelUp: (level) => dispatch(levelUp(level)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Grid);
