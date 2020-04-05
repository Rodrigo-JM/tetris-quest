import { createStore, combineReducers, applyMiddleware } from 'redux'
import {createLogger} from 'redux-logger'
import thunk from "redux-thunk"
import boardReducer from "./board";

const rootReducer = combineReducers({board: boardReducer})
const logger = createLogger({collapsed: true})
const store = createStore(rootReducer, applyMiddleware(thunk, logger))

export default store