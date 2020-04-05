//1 per game
//creates grid
//keeps track of tile locations
//determines validity of coordinates
//checks for line clears
//clears lines

const CREATED_GRID = 'CREATED_GRID';

const createdGrid = grid => {
    return {
        type: CREATED_GRID,
        grid
    }
}

export const createGrid = () => {
    return function (dispatch) {
        const grid = new Array(20);
        grid.fill(Array(10).fill(0))

        dispatch(createdGrid(grid))
    }
}

const boardReducer = (state = [], action) => {
    switch (action.type) {
        case CREATED_GRID:
            return action.grid
        
        default:
            return state
    }
}

export default boardReducer