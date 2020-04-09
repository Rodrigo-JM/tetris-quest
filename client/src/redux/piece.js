//1 per piece
//spawns tiles in proper locations
//conains movement rotation functions
import {
  JLSTZ_OFFSET_TESTS,
  I_OFFSET_TESTS,
  O_OFFSET_TESTS,
} from "./rotationTests";
import piecesReducer from "./pieces";

// const piecesToObj = {
//     'L': {
//         0:
//     }
// }

const checkBorders = (tiles, grid) => {
  let type = "";
  for (let i = 0; i < 4; i++) {
    let tile = tiles[i];
    if (tile[0] >= grid[0].length) {
      type = "left";
    } else if (tile[0] < 0) {
      type = "right";
    } else if (tile[1] >= grid.length) {
      type = "down";
    }
  }
  return type;
};

const canSpawn = (piece, grid, tiles) => {
      let canSpawn = true;
      for (let i = 0; i < 4; i++) {
        let tile = tiles[i];
        if (
          tile[0] >= grid[0].length ||
          tile[0] < 0 ||
          tile[1] >= grid.length
        ) {
          canSpawn = false;
        }
      }
      return canSpawn;

};

const checkAndBuildPiece = (piece, grid, oldRotation, offset = [0, 0]) => {
  console.log(piece) 
  let pieceTiles = buildTilesForPiece(piece, offset);
  if (canSpawn(piece, grid, pieceTiles)) {
    return pieceTiles;
  } else if (checkBorders(pieceTiles, grid) === "left") {
    return checkAndBuildPiece(piece, grid, oldRotation, [-1, 0]);
  } else if (checkBorders(pieceTiles, grid) === "right") {
    return checkAndBuildPiece(piece, grid, oldRotation, [1, 0]);
  } else if (checkBorders(pieceTiles, grid) === "down") {
    return checkAndBuildPiece(piece, grid, oldRotation, [0, -1]);
  }
};

const CREATED_TILES = "CREATED_TILES";

const createdTiles = (tiles) => {
  return {
    type: CREATED_TILES,
    tiles,
  };
};

export const createTiles = (piece, grid, oldRotationIndex = 0) => {
  return function (dispatch) {
    const pieceTiles = checkAndBuildPiece(piece, grid, oldRotationIndex);
    console.log(pieceTiles, 'piece tiles')
    dispatch(createdTiles(pieceTiles));
  };
};

const tilesReducer = (state = [], action) => {
  switch (action.type) {
    case CREATED_TILES:
      return action.tiles;
    default:
      return state;
  }
};

//
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
    ]
  ];

  const S_SHAPES = [
    [[], [], [], [], []],
    [[], [], [], [], []],
    [[], [], [], [], []],
    [[], [], [], [], []],
  ];

  const Z_SHAPES = [
    [[], [], [], [], []],
    [[], [], [], [], []],
    [[], [], [], [], []],
    [[], [], [], [], []],
  ];

  const T_SHAPES = [
    [[], [], [], [], []],
    [[], [], [], [], []],
    [[], [], [], [], []],
    [[], [], [], [], []],
  ];

  if (piece.type === "L") {
    return L_SHAPES[piece.rotationIndex];

  } else if (piece.type === "J") {

    return J_SHAPES[piece.rotationIndex];
  }
};

export default tilesReducer;
