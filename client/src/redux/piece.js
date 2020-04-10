//1 per piece
//spawns tiles in proper locations
//conains movement rotation functions
import {
  JLSTZ_OFFSET_TESTS,
  I_OFFSET_TESTS,
  O_OFFSET_TESTS,
} from "./rotationTests";
import piecesReducer from "./pieces";

const getTestData = (pieceType) => {
  if (pieceType === "O") {
    return O_OFFSET_TESTS;
  } else if (pieceType === "I") {
    return I_OFFSET_TESTS;
  } else {
    return JLSTZ_OFFSET_TESTS;
  }
}


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
    if (tile[0] >= grid[0].length || tile[0] < 0 || tile[1] >= grid.length) {
      canSpawn = false;
    }
  }
  return canSpawn;
};

const checkAndBuildPiece = (piece, grid, offset = [0, 0]) => {//we have oldRotation as standard to piece rotation and offset to [0, 0] so we can reuse this function to create tiles in case of rotations, as well as relocate the piece in case move tries to go through wall

  if (piece.oldRotationIndex !== piece.rotationIndex) {// we test this because rotations apply different offsets
    let testData = getTestData(piece.type)
    let safeGuardPiecePosition = [...piece.center]//save old piece center position in case our rotation is impossible;
    for (let i = 0; i < 5; i++) {
      let offsetVal1 = testData[piece.oldRotationIndex][i]
      let offsetVal2 = testData[piece.rotationIndex][i];
      let endOffset = [offsetVal1[0] - offsetVal2[0], offsetVal1[1] - offsetVal2[1]]
      let pieceTiles = buildTilesForPiece(piece, endOffset);
      if (canSpawn(piece, grid, pieceTiles)) {
        console.log('rotated, test', i, endOffset)
        piece.oldRotationIndex = piece.rotationIndex
        return pieceTiles;
      }  else {
        piece.center = safeGuardPiecePosition
      }
    }

    piece.rotationIndex = piece.oldRotationIndex;
    piece.center = safeGuardPiecePosition;

    return buildTilesForPiece(piece, offset)
    
  } else {
    let pieceTiles = buildTilesForPiece(piece, offset);

    if (canSpawn(piece, grid, pieceTiles)) {
      return pieceTiles;
    } else if (checkBorders(pieceTiles, grid) === "left") {
      return checkAndBuildPiece(piece, grid, [-1, 0]);
    } else if (checkBorders(pieceTiles, grid) === "right") {
      return checkAndBuildPiece(piece, grid, [1, 0]);
    } else if (checkBorders(pieceTiles, grid) === "down") {
      return checkAndBuildPiece(piece, grid, [0, -1]);
    }

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
    const pieceTiles = checkAndBuildPiece(piece, grid);
    console.log(pieceTiles, "piece tiles");
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
const buildTilesForPiece = (piece, offset, rotationOffset = false) => {

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

export default tilesReducer;
