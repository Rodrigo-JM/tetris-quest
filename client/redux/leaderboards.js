import axios from "axios"

const GOT_LEADERBOARDS = "GOT_LEADERBOARDS"

const gotLeaderboards = leaderboards => {
    return {
        type: GOT_LEADERBOARDS,
        leaderboards
    }
}

export const getLeaderboards = () => {
    return async function(dispatch) {
        try {
            const {data} = await axios.get('/api/users/leaderboards')

            dispatch(gotLeaderboards(data))
        } catch (error) {
            
        }
    }
}

const leaderboardsReducer = (state = [], action) => {
    switch (action.type) {
        case GOT_LEADERBOARDS:
            return action.leaderboards
        default:
            return state
    }
}

export default leaderboardsReducer