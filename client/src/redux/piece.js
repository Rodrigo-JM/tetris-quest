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

const buildTilesForPiece = (piece, offset) => {
  console.log(offset[0], offset[1]);
  switch (piece.type) {
    case "L":
      return [
        [piece.center[0] - 1 + offset[0], piece.center[1] + offset[1]],
        [piece.center[0] + offset[0], piece.center[1] + offset[1]],
        [piece.center[0] + 1 + offset[0], piece.center[1] + offset[1]],
        [piece.center[0] + 1 + offset[0], piece.center[1] + 1 + offset[1]],
      ];
    default:
      return null;
  }
};

const canSpawn = (piece, grid, tiles) => {
  switch (piece.type) {
    case "L":
      let canSpawn = true;
      for (let i = 0; i < 4; i++) {
        let tile = tiles[i];
        console.log(tile, "<<<<<<<<<<<<<<<");
        if (
          tile[0] >= grid[0].length ||
          tile[0] < 0 ||
          tile[1] >= grid.length
        ) {
          canSpawn = false;
        }
      }
      return canSpawn;
    default:
      return null;
  }
};

const checkAndBuildPiece = (piece, grid, offset = [0, 0]) => {
  let pieceTiles = buildTilesForPiece(piece, offset);
  if (canSpawn(piece, grid, pieceTiles)) {
      console.log('ita cans spwnawn')
    return pieceTiles;
  } else {
    console.log("it went");
    return checkAndBuildPiece(piece, grid, [0, -1]);
  }
};

const CREATED_TILES = "CREATED_TILES";

const createdTiles = (tiles) => {
  return {
    type: CREATED_TILES,
    tiles,
  };
};

export const createTiles = (piece, grid) => {
  return function (dispatch) {
    const pieceTiles = checkAndBuildPiece(piece, grid);

    dispatch(createdTiles(pieceTiles))
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

export default tilesReducer;
