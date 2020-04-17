//1 per game
//spawns pieces
//handles player input
//stores offset datasets
import { killPiece, clearLine } from "./board";
import {addScore} from './user'

const NEW_GAME = "NEW_GAME"

import {
  JLSTZ_OFFSET_TESTS,
  I_OFFSET_TESTS,
  O_OFFSET_TESTS,
} from "./rotationTests";

const CREATED_PIECE = "CREATED_PIECE";
const CLEAR_TILES = "CLEAR_TILES";
const ENDED_GAME = "ENDED_GAME";

const endGame = () => {
  return {
    type: ENDED_GAME,
  };
};

const getTestData = (pieceType) => {
  if (pieceType === "O") {
    return O_OFFSET_TESTS;
  } else if (pieceType === "I") {
    return I_OFFSET_TESTS;
  } else {
    return JLSTZ_OFFSET_TESTS;
  }
};

const previewTiles = (tiles, grid) => {
  let preViewTiles = [...tiles];

  if (grid.length) {
    while (testTilesForOverlap(preViewTiles, grid, 0, -1)) {
      preViewTiles = preViewTiles.map((tile) => {
        return [tile[0], tile[1] - 1];
      });
    }

  }

  return preViewTiles;
};

const clearTiles = () => {
  return {
    type: CLEAR_TILES,
  };
};

const createdPiece = (piece) => {
  return {
    type: CREATED_PIECE,
    piece,
  };
};

const pieceTypes = ["J", "L", "T", "I", "O", "S", "Z"];

const rotatePiece = (piece, grid) => {
  let testData = getTestData(piece.type);
  let safeGuardPiecePosition = [...piece.center]; //save old piece center position in case our rotation is impossible;

  for (let i = 0; i < 5; i++) {
    let offsetVal1 = testData[piece.oldRotationIndex][i];
    let offsetVal2 = testData[piece.rotationIndex][i];
    let endOffset = [
      offsetVal1[0] - offsetVal2[0],
      offsetVal1[1] - offsetVal2[1],
    ];
    let pieceTiles = buildTilesForPiece(piece, endOffset);
    if (testTilesForOverlap(pieceTiles, grid)) {
      piece.oldRotationIndex = piece.rotationIndex;
      return pieceTiles;
    } else {
      piece.center = [...safeGuardPiecePosition];
    }
  }

  piece.rotationIndex = piece.oldRotationIndex;
  piece.center = safeGuardPiecePosition;
  return false;
};

const testTilesForOverlap = (tiles, grid, xOffset = 0, yOffset = 0) => {
  const isLegal = tiles.reduce((bool, tile) => {
    let xCoord = tile[0] + xOffset;
    let yCoord = tile[1] + yOffset;
    if (xCoord < 0 || yCoord < 0 || xCoord > 9 || grid[yCoord][xCoord] > 0) {
      return false;
    }
    return bool;
  }, true);

  return isLegal;
};

const isMoveLegal = (move, piece, grid) => {
  switch (move) {
    case "left":
      return testTilesForOverlap(piece.tiles, grid, -1);
    case "right":
      return testTilesForOverlap(piece.tiles, grid, 1);
    default:
      return false;
  }
};

export const createPiece = (centerLocation, type, tiles = [], grid = [], game = {}, user = {}) => {
  return function (dispatch) {
    let location = [4, 19];

    if (centerLocation) {
      location = centerLocation;
    }

    const piece = {
      type: type,
      center: location,
      rotationIndex: 0,
      oldRotationIndex: 0,
      tiles: tiles,
      preview: [],
    };

    if (!piece.tiles.length) {
      piece.tiles = buildTilesForPiece(piece, [0, -1]);
    }
    if (piece.tiles.length) {
      piece.preview = previewTiles(piece.tiles, grid);
    }

    if (grid.length && !testTilesForOverlap(piece.tiles, grid)) {
      dispatch(addScore(user, game.points))
      dispatch(endGame());
      return;
    }

    dispatch(createdPiece(piece));
  };
};

export const createNewPiece = (grid, game = {}, user = {}) => {
  return function (dispatch) {
    let type = pieceTypes[Math.floor(Math.random() * Math.floor(7))];

    dispatch(createPiece(null, type, undefined, grid, game, user));
  };
};

export const movePiece = (move, piece, grid, game, user) => {
  return function (dispatch) {
    let oldPiece = { ...piece };
    let newRotation = piece.rotationIndex;

    if (move === "right" && isMoveLegal(move, piece, grid)) {
      piece.center[0] += 1;
      piece.tiles = buildTilesForPiece(piece, [0, 0]);
    } else if (move === "left" && isMoveLegal(move, piece, grid)) {
      piece.center[0] -= 1;

      piece.tiles = buildTilesForPiece(piece, [0, 0]);
    } else if (move === "x" || move === "up") {
      piece.rotationIndex = (((newRotation + 1) % 4) + 4) % 4;

      piece.tiles = rotatePiece(piece, grid);
      if (!piece.tiles) {
        piece = oldPiece;
      }
    } else if (move === "z") {
      piece.rotationIndex = (((newRotation - 1) % 4) + 4) % 4;

      piece.tiles = rotatePiece(piece, grid);
      if (!piece.tiles) {
        piece = oldPiece;
      }
    } else if (move === "down") {
      if (testTilesForOverlap(piece.tiles, grid, 0, -1)) {
        piece.center[1] -= 1;

        piece.tiles = buildTilesForPiece(piece, [0, 0]);
      } else {
        dispatch(killPiece(piece, grid, piece.tiles));
        dispatch(createNewPiece(grid, game, user));
        dispatch(clearLine(grid, game));
        return;
      }
    } else if (move === "space") {
      dispatch(killPiece(piece, grid, piece.preview));
      dispatch(createNewPiece(grid, game, user));
      dispatch(clearLine(grid, game));
      return;
    }
    
    piece.preview = previewTiles(piece.tiles, grid);
    const newPiece = { ...piece };
    dispatch(createdPiece(newPiece));
  };
};

const piecesReducer = (state = {}, action) => {
  switch (action.type) {
    case NEW_GAME: 
      return {}
    case CREATED_PIECE:
      return action.piece;
    default:
      return state;
  }
};

const buildTilesForPiece = (piece, offset) => {
  piece.center[0] = piece.center[0] + offset[0];
  piece.center[1] = piece.center[1] + offset[1];

  const L_SHAPES = [
    [
      [piece.center[0] - 1, piece.center[1]],
      [piece.center[0], piece.center[1]],
      [piece.center[0] + 1, piece.center[1]],
      [piece.center[0] + 1, piece.center[1] + 1],
    ],
    [
      [piece.center[0], piece.center[1] + 1],
      piece.center,
      [piece.center[0], piece.center[1] - 1],
      [piece.center[0] + 1, piece.center[1] - 1],
    ],
    [
      [piece.center[0] + 1, piece.center[1]],
      piece.center,
      [piece.center[0] - 1, piece.center[1]],
      [piece.center[0] - 1, piece.center[1] - 1],
    ],
    [
      [piece.center[0], piece.center[1] - 1],
      piece.center,
      [piece.center[0], piece.center[1] + 1],
      [piece.center[0] - 1, piece.center[1] + 1],
    ],
  ];

  const J_SHAPES = [
    [
      [piece.center[0] - 1, piece.center[1] + 1],
      [piece.center[0] - 1, piece.center[1]],
      piece.center,
      [piece.center[0] + 1, piece.center[1]],
    ],
    [
      [piece.center[0] + 1, piece.center[1] + 1],
      [piece.center[0], piece.center[1] + 1],
      piece.center,
      [piece.center[0], piece.center[1] - 1],
    ],
    [
      [piece.center[0] + 1, piece.center[1] - 1],
      [piece.center[0] + 1, piece.center[1]],
      piece.center,
      [piece.center[0] - 1, piece.center[1]],
    ],
    [
      [piece.center[0] - 1, piece.center[1] - 1],
      [piece.center[0], piece.center[1] - 1],
      piece.center,
      [piece.center[0], piece.center[1] + 1],
    ],
  ];

  const S_SHAPES = [
    [
      [piece.center[0] - 1, piece.center[1]],
      piece.center,
      [piece.center[0], piece.center[1] + 1],
      [piece.center[0] + 1, piece.center[1] + 1],
    ],
    [
      [piece.center[0], piece.center[1] + 1],
      piece.center,
      [piece.center[0] + 1, piece.center[1]],
      [piece.center[0] + 1, piece.center[1] - 1],
    ],
    [
      [piece.center[0] + 1, piece.center[1]],
      piece.center,
      [piece.center[0], piece.center[1] - 1],
      [piece.center[0] - 1, piece.center[1] - 1],
    ],
    [
      [piece.center[0], piece.center[1] - 1],
      piece.center,
      [piece.center[0] - 1, piece.center[1]],
      [piece.center[0] - 1, piece.center[1] + 1],
    ],
  ];

  const Z_SHAPES = [
    [
      [piece.center[0] - 1, piece.center[1] + 1],
      [piece.center[0], piece.center[1] + 1],
      piece.center,
      [piece.center[0] + 1, piece.center[1]],
    ],
    [
      [piece.center[0] + 1, piece.center[1] + 1],
      [piece.center[0] + 1, piece.center[1]],
      piece.center,
      [piece.center[0], piece.center[1] - 1],
    ],
    [
      [piece.center[0] + 1, piece.center[1] - 1],
      [piece.center[0], piece.center[1] - 1],
      piece.center,
      [piece.center[0] - 1, piece.center[1]],
    ],
    [
      [piece.center[0] - 1, piece.center[1] - 1],
      [piece.center[0] - 1, piece.center[1]],
      piece.center,
      [piece.center[0], piece.center[1] + 1],
    ],
  ];

  const T_SHAPES = [
    [
      [piece.center[0] - 1, piece.center[1]],
      piece.center,
      [piece.center[0], piece.center[1] + 1],
      [piece.center[0] + 1, piece.center[1]],
    ],
    [
      [piece.center[0], piece.center[1] + 1],
      piece.center,
      [piece.center[0] + 1, piece.center[1]],
      [piece.center[0], piece.center[1] - 1],
    ],
    [
      [piece.center[0] + 1, piece.center[1]],
      piece.center,
      [piece.center[0], piece.center[1] - 1],
      [piece.center[0] - 1, piece.center[1]],
    ],
    [
      [piece.center[0], piece.center[1] - 1],
      piece.center,
      [piece.center[0] - 1, piece.center[1]],
      [piece.center[0], piece.center[1] + 1],
    ],
  ];

  const I_SHAPES = [
    [
      [piece.center[0] - 1, piece.center[1]],
      piece.center,
      [piece.center[0] + 1, piece.center[1]],
      [piece.center[0] + 2, piece.center[1]],
    ],
    [
      [piece.center[0], piece.center[1] + 1],
      piece.center,
      [piece.center[0], piece.center[1] - 1],
      [piece.center[0], piece.center[1] - 2],
    ],
    [
      [piece.center[0] + 1, piece.center[1]],
      piece.center,
      [piece.center[0] - 1, piece.center[1]],
      [piece.center[0] - 2, piece.center[1]],
    ],
    [
      [piece.center[0], piece.center[1] - 1],
      piece.center,
      [piece.center[0], piece.center[1] + 1],
      [piece.center[0], piece.center[1] + 2],
    ],
  ];

  const O_SHAPES = [
    [
      [piece.center[0], piece.center[1] + 1],
      [piece.center[0] + 1, piece.center[1] + 1],
      [piece.center[0] + 1, piece.center[1]],
      piece.center,
    ],
    [
      [piece.center[0] + 1, piece.center[1]],
      [piece.center[0] + 1, piece.center[1] - 1],
      [piece.center[0], piece.center[1] - 1],
      piece.center,
    ],
    [
      [piece.center[0], piece.center[1] - 1],
      [piece.center[0] - 1, piece.center[1] - 1],
      [piece.center[0] - 1, piece.center[1]],
      piece.center,
    ],
    [
      [piece.center[0] - 1, piece.center[1]],
      [piece.center[0] - 1, piece.center[1] + 1],
      [piece.center[0], piece.center[1] + 1],
      piece.center,
    ],
  ];

  if (piece.type === "L") {
    return L_SHAPES[piece.rotationIndex];
  } else if (piece.type === "J") {
    return J_SHAPES[piece.rotationIndex];
  } else if (piece.type === "S") {
    return S_SHAPES[piece.rotationIndex];
  } else if (piece.type === "Z") {
    return Z_SHAPES[piece.rotationIndex];
  } else if (piece.type === "T") {
    return T_SHAPES[piece.rotationIndex];
  } else if (piece.type === "I") {
    return I_SHAPES[piece.rotationIndex];
  } else if (piece.type === "O") {
    return O_SHAPES[piece.rotationIndex];
  }
};

export default piecesReducer;
