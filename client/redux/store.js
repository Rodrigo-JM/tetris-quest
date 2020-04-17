import { createStore, combineReducers, applyMiddleware } from 'redux'
import {createLogger} from 'redux-logger'
import thunk from "redux-thunk"
import boardReducer from "./board";
import piecesReducer from './pieces';
import gameReducer from './game'
import userReducer from './user'
import fetchingReducer from './fetching';
import leaderboardsReducer from './leaderboards';

const rootReducer = combineReducers({board: boardReducer, piece: piecesReducer, game: gameReducer, user: userReducer, isFetching: fetchingReducer, leaderboards: leaderboardsReducer})
const logger = createLogger({collapsed: true})
const store = createStore(rootReducer, applyMiddleware(thunk, logger))

export default store