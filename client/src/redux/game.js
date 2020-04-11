import { createGrid } from './board'

const LEVELED_UP = "LEVELED_UP";
const NEW_GAME = "NEW_GAME"
const ENDED_GAME = "ENDED_GAME"


const leveledUp = (level) => {
  return {
    type: LEVELED_UP,
    level,
  };
};

const newGameAction = () => {
    return {
        type: NEW_GAME
    }
}

export const newGame = () => {
    return function(dispatch) {
        dispatch(createGrid());
        dispatch(newGameAction())
    }
}

export const levelUp = (level) => {
  return function (dispatch) {
    const levelup = level + 1;

    dispatch(leveledUp(levelup));
  };
};

const gameReducer = (state = { playing: true, level: 1 }, action) => {
  switch (action.type) {
    case NEW_GAME: 
        return {
            level: 1,
            playing: true
        }
    case ENDED_GAME:
      return {
        ...state,
        playing: false,
      };
    case LEVELED_UP:
      return {
        ...state,
        level: action.level,
      };
    default:
      return state;
  }
};

export default gameReducer;
