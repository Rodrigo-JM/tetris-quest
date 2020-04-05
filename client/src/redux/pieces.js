//1 per game
//spawns pieces
//handles player input
//stores offset datasets



const CREATED_PIECE = 'CREATED_PIECE';

const createdPiece = piece => {
    return {
        type: CREATED_PIECE,
        piece
    }
}

export const createPiece = (centerLocation, type) => {
    return function(dispatch) {
        let location = [4, 19]
    
        if (centerLocation) {
            location = centerLocation;
        }
    
        const piece = {
            type: type,
            center: location,
        }
    
        dispatch(createdPiece(piece))
    }    
}


const piecesReducer = (state = {}, action) => {
    switch (action.type) {
        case CREATED_PIECE:
            return action.piece
        default: 
            return state
    }
}

export default piecesReducer