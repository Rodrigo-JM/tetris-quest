import { createGrid } from "./board";

const LEVELED_UP = "LEVELED_UP";
const NEW_GAME = "NEW_GAME";
const ENDED_GAME = "ENDED_GAME";
const ADDED_LINES = "ADDED_LINES";
const ADDED_POINTS = "ADDED_POINTS";
const PAUSED_GAME = "PAUSED_GAME";
const RESUMED_GAME = "RESUMED_GAME"


const pausedGame = () => {
  return {
    type: PAUSED_GAME,
  }
}

const leveledUp = (level) => {
  return {
    type: LEVELED_UP,
    level,
  };
};

const addedPoints = (points) => {
  return {
    type: ADDED_POINTS,
    points
  }
}

const pointsChart = {
  1: function (level) {return 40 * (level + 1)},
  2: function (level) {return 100 * (level + 1)},	
  3: function (level) {return 300 * (level + 1)},	
  4: function (level) {return 1200 * (level + 1)}
}


const newGameAction = () => {
  return {
    type: NEW_GAME,
  };
};

const addedLines = (lines) => {
  return  {
    type: ADDED_LINES,
    lines
  }
}

const countPoints = (game, linesToAdd) => {
  return function (dispatch) {
    console.log(linesToAdd, 'lines to add')
    const pointsToAdd = pointsChart[linesToAdd](game.level) + game.points

    dispatch(addedPoints(pointsToAdd))
  }
}

export const addLines = (linesToAdd, game) => {
  return function (dispatch) {
    if (game.lines + linesToAdd >= 10) {
      dispatch(addedLines((game.lines + linesToAdd) % 10))
      dispatch(countPoints(game, linesToAdd))
      dispatch(levelUp(game.level));
    } else {
      dispatch(countPoints(game, linesToAdd))
      dispatch(addedLines(game.lines + linesToAdd))
    }
  }
}

export const pauseGame = () => {
  return function (dispatch) {
    dispatch(pausedGame())
  }
}

export const newGame = () => {
  return function (dispatch) {
    dispatch(createGrid());
    dispatch(newGameAction());
  };
};

export const levelUp = (level) => {
  return function (dispatch) {
    const levelup = level + 1;

    dispatch(leveledUp(levelup));
  };
};

const gameReducer = (state = { playing: true, level: 1, lines: 0, points: 0}, action) => {
  switch (action.type) {
    case PAUSED_GAME:
      return {
        ...state,
        playing: (state.playing && state.playing !== 'paused') ? 'paused' : true
      }
    case ADDED_POINTS:
      return {
        ...state,
        points: action.points
      }
    case ADDED_LINES: 
      return {
        ...state,
        lines: action.lines
      }
    case NEW_GAME:
      return {
        level: 1,
        playing: true,
      };
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
