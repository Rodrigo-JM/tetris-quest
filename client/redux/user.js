import axios from 'axios'


const FETCH_ME = "FETCH_ME";
const LOGGED_USER = "LOGGED_USER";
const LOGGED_OUT_USER = "LOGGED_OUT_USER";
const CHANGED_THEME = "CHANGED_THEME"
const ADDED_SCORE = "ADDED_SCORE";


const addedScore = user => {
    return {
        type: ADDED_SCORE,
        user
    }
}
const changedTheme = (user) => {
    return {
        type: CHANGED_THEME,
        user
    }
}

const loggedUser = user => {
    return {
        type: LOGGED_USER,
        user
    }
}

const loggedOutUser = () => {
    return {
        type: LOGGED_OUT_USER
    }
}

export const addScore = (user, score) => {
    return async function(dispatch) {
        try {
            const {data} = await axios.post(`api/users/highscores/${user.id}/add`, {score})
            
            dispatch(loggedUser(data))
        } catch (error) {
            console.log(error)
        }
    }
}

export const logoutUser = () => {
    return async function(dispatch) {
        try {
            await axios.delete('/logout')

            dispatch(loggedOutUser())
        } catch (error) {
            console.log(error)
        }
    }
}

export const fetchMe = () => {
    return async function(dispatch) {
        try {
            const { data } = await axios.get('/me')
            dispatch(loggedUser(data))
        } catch (error) {
            console.log(error)
        }
    }
}

export const changeTheme = (user, theme) => {
    return async function (dispatch) {
        try {
            if (user.id) {
                const { data } = await axios.put(`api/users/${user.id}/theme`, {theme})
    
                dispatch(changedTheme(data))
            }
        } catch (error) {
            console.log(error)
        }
    }
}

export const signUser = (user) => {
    return async function(dispatch) {
        try {
            const { data } = await axios.post('/signup', user)
            console.log(data)
            dispatch(loggedUser(data))
        } catch (error) {
            console.log(error)
        }
    }
}

export const logUser = (user) => {
    return async function(dispatch) {
        try {
            const { data } = await axios.put('/login', user)
            console.log(data)
            dispatch(loggedUser(data))
        } catch (error) {
            console.log(error)
        }


    }
}

const userReducer = (state = {}, action) => {
    switch (action.type) {
        case LOGGED_OUT_USER: 
            return {}
        case LOGGED_USER:
            return (action.user.id) ? action.user : {}
        default:
            return state
    }
}

export default userReducer