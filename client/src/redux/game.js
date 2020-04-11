const LEVELED_UP = "LEVELED_UP";

const leveledUp = (level) => {
  return {
    type: LEVELED_UP,
    level,
  };
};

const ENDED_GAME = "ENDED_GAME"
// export const endGame = () => {
//     return function (dispatch) {

//     }
// }

export const levelUp = (level) => {
  return function (dispatch) {
    const levelup = level + 1;

    dispatch(leveledUp(levelup));
  };
};

const gameReducer = (state = { playing: true, level: 1 }, action) => {
  switch (action.type) {
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
