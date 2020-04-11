//1 per game
//creates grid
//keeps track of tile locations
//determines validity of coordinates
//checks for line clears
//clears lines

import piecesReducer from "./pieces";
import tilesReducer from "./piece";

const CREATED_GRID = "CREATED_GRID";

const createdGrid = (grid) => {
  return {
    type: CREATED_GRID,
    grid,
  };
};

// export const endGame = (grid) => {
//     return function (dispatch) {
//         if (grid[19])
//     }
// }

export const clearLine = (grid) => {
  return function (dispatch) {
    let completeLine = [];

    let newGrid = grid.filter((rows) => {
      if (rows.includes(0)) {
        return true
      } else {
          completeLine.push(0)
          return false
      }
    });

    completeLine.forEach(line => {
        newGrid.push(Array(10).fill(0))
    })

    dispatch(createdGrid(newGrid));
  };
};

export const killPiece = (piece, grid, tiles) => {
  return function (dispatch) {
    // we are going to take the dead piece tiles and modify the grid, but one row index above, since tiles we're overlapping others when we found the piece to be dead
    for (let i = 0; i < tiles.length; i++) {
      grid[tiles[i][1]][tiles[i][0]] = 1;
    }

    dispatch(createdGrid(grid));
  };
};

export const createGrid = () => {
  return function (dispatch) {
    let grid = new Array(20);
    for (let i = 0; i < grid.length; i++) {
      grid[i] = Array(10).fill(0);
    }

    dispatch(createdGrid(grid));
  };
};

const boardReducer = (state = [], action) => {
  switch (action.type) {
    case CREATED_GRID:
      return action.grid;

    default:
      return state;
  }
};

export default boardReducer;
