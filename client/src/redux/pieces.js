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
        let location = [4, 10]
    
        if (centerLocation) {
            location = centerLocation;
        }
        const piece = {
            type: type,
            center: location,
            rotationIndex: 0,
            oldRotationIndex: 0
        }
    
        dispatch(createdPiece(piece))
    }    
}

export const movePiece = (move, piece) => {
    return function(dispatch) {
        let newLocation = [...piece.center]
        let newRotation = piece.rotationIndex
        if (move === 'right') {
            newLocation[0] += 1;
        } else if (move === 'left') {
            newLocation[0] -= 1;
        } else if (move === 'x') {
            newRotation = ((newRotation + 1) % 4 + 4) % 4
        } else if (move === 'z') {
            newRotation = ((newRotation - 1) % 4 + 4) % 4
        } else if (move === 'down') {
            newLocation[1] -= 1; 
        }

        piece.center = newLocation;
        piece.rotationIndex = newRotation
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