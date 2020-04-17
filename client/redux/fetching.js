const LOGGED_USER = "LOGGED_USER";


const fetchingReducer = (state = true, action) => {
    switch (action.type) {
        case LOGGED_USER:
            return false
        default:
            return state
    }
}

export default fetchingReducer