import {combineReducers} from 'redux'
import _ from 'lodash'


import {
    HISTORY_CHANGED,
    FETCH_REQUEST,
    FETCH_ERROR,
    FETCH_ALL_POSTS_SUCCESS,
    CREATE_POST_SUCCESS,
    FETCH_POST_SUCCESS,
    DELETE_POST_SUCCESS,
    CHECK_SESSIONID_COOKIE_SUCCESS,
    CHECK_SESSIONID_COOKIE_FAIURE, CLEAR_POSTS_CACHE
} from '../actions';


function isFetching(state = false, action){
    switch(action.type) {
        case FETCH_REQUEST:
            return true;
        case HISTORY_CHANGED:
        case FETCH_ERROR:
        case FETCH_ALL_POSTS_SUCCESS:
        case FETCH_POST_SUCCESS:
        case DELETE_POST_SUCCESS:
        case CREATE_POST_SUCCESS:
            return false;
    }
    return state
}

function httpError(state = null, action){
    switch(action.type){
        case FETCH_ERROR:
            return action.httpError;
        case HISTORY_CHANGED:
        case FETCH_REQUEST:
        case FETCH_ALL_POSTS_SUCCESS:
        case FETCH_POST_SUCCESS:
        case DELETE_POST_SUCCESS:
        case CREATE_POST_SUCCESS:
            return null;

    }

    return state
}



function isAuthenticated(state = false, action){
    switch (action.type){
        case CHECK_SESSIONID_COOKIE_SUCCESS:
            return true;
        case CHECK_SESSIONID_COOKIE_FAIURE:
            return false;
    }
    return state;
}

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

        case CLEAR_POSTS_CACHE:
            return {}
    }
    return state;
}

function lastRefreshDate(state=0, action){
    // last time FETCH_ALL_POSTS_SUCCESS was triggered
    switch(action.type){
        case FETCH_ALL_POSTS_SUCCESS:
            return Math.round(Date.now()/1000);
        case CLEAR_POSTS_CACHE:
            return 0;
    }
    return state
}


const rootReducer = combineReducers({
    posts: fetchAllPostsReducer,
    isAuthenticated,
    isFetching,
    httpError,
    lastRefreshDate

})

export default rootReducer