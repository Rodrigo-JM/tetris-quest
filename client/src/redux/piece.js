//1 per piece
//spawns tiles in proper locations
//conains movement rotation functions

const canSpawn = (piece, grid) => {
    switch (piece.type) {
        case 'BLOCK': 
            if(grid[piece.center[1]][piece.center[0]]) {
                return false
            } else {
                return true
            }
        default:
            return null
    }
}


const CREATED_TILES = 'CREATED_TILES'

const createdTiles = tiles => {
    return {
        type: CREATED_TILES,
        tiles
    }
}

export const createTiles = (piece, grid) => {
    return function(dispatch) {
        if (canSpawn(piece, grid)) {
            const tiles = [[piece.center[0], piece.center[1]]]

            dispatch(createdTiles(tiles))
        }
    }
}

const tilesReducer = (state = [], action) => {
    switch (action.type) {
        case CREATED_TILES:
            return action.tiles
        default: 
            return state
    }    

}

export default tilesReducer