
const LEVELED_UP = 'LEVELED_UP'

const leveledUp = (level) => {
    return  {
        type: LEVELED_UP,
        level
    }
}

export const levelUp = (level) => {
    return function (dispatch) {
        const levelup = level + 1

        dispatch(leveledUp(levelup))
    }
}



const gameReducer = (state = 1, action) => {
    switch (action.type) {
        case LEVELED_UP:
            return action.level

        default:
            return state
    }
}  

export default gameReducer