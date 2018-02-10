import {combineReducers} from 'redux'
import _ from 'lodash'


import {
    FETCH_ALL_POSTS_SUCCESS,
    CREATE_POST_SUCCESS,
    FETCH_POST_SUCCESS,
    DELETE_POST_SUCCESS
} from '../actions';

function fetchAllPostsReducer(state={}, action){

    switch (action.type){
        case FETCH_ALL_POSTS_SUCCESS:
            return _.mapKeys(action.payload, 'id')

        case FETCH_POST_SUCCESS:
            return {...state, [action.payload.id]: action.payload}

        case CREATE_POST_SUCCESS:
            return Object.assign({[action.payload.id] : action.payload}, state)

        case DELETE_POST_SUCCESS:
            let newState = {...state};
            delete newState[action.payload]
            return newState;
    }
    return state;
}


const rootReducer = combineReducers({
    posts: fetchAllPostsReducer
})

export default rootReducer