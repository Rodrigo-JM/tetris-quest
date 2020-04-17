import axios from 'axios'


const FETCH_ME = "FETCH_ME";
const LOGGED_USER = "LOGGED_USER";
const LOGGED_OUT_USER = "LOGGED_OUT_USER";

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
            console.log(data)
            dispatch(loggedUser(data))
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