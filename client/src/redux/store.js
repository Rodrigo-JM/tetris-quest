import { createStore, combineReducers, applyMiddleware } from 'redux'
import {createLogger} from 'redux-logger'
import thunk from "redux-thunk"
import boardReducer from "./board";
import piecesReducer from './pieces';
import tilesReducer from './piece';
import gameReducer from './game'


const rootReducer = combineReducers({board: boardReducer, piece: piecesReducer, game: gameReducer})
const logger = createLogger({collapsed: true})
const store = createStore(rootReducer, applyMiddleware(thunk, logger))

export default store