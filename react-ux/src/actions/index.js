import _ from "lodash";
import {getNowInSeconds} from "../util";

//Adapted from: https://docs.djangoproject.com/en/dev/ref/csrf/#ajax
function getCookie(name){
    let cookieValue = null;
    if (document.cookie && document.cookie !== ''){
        const cookies = document.cookie.split(";");
        for(let idx in cookies){
            let cookie = _.trim(cookies[idx]);
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

console.log("csrftoken", getCookie("csrftoken"));

function djangoFetch(url, params={}){
    //simple overide of django headers need to handle more complex cases
    let monkeyPatchedParams = {...params};
    monkeyPatchedParams.credentials = "include";
    if(!monkeyPatchedParams.headers){monkeyPatchedParams.headers = new Headers()}
    monkeyPatchedParams.headers.set('Content-Type', "application/json");
    monkeyPatchedParams.headers.set('X-CSRFToken', getCookie("csrftoken"));
    return fetch(url, monkeyPatchedParams)
}


//Global Acctions for all fetches
export const FETCH_REQUEST = 'FETCH_REQUEST';
export const FETCH_ERROR   = 'FETCH_ERROR';
export const HISTORY_CHANGED = 'HISTORY_CHANGED';


export const FETCH_ALL_POSTS_SUCCESS = 'FETCH_ALL_POSTS_SUCCESS';

export const FETCH_POST_SUCCESS = 'FETCH_POST_SUCCESS';
export const CREATE_POST_SUCCESS = 'CREATE_POST_SUCCESS';
export const CREATE_POST_ERROR   = 'CREATE_POST_ERROR';
export const DELETE_POST_SUCCESS = 'DELETE_POST_SUCCESS';
export const CHECK_SESSIONID_COOKIE_SUCCESS = 'SESSIONID_COOKIE_SUCCESS';
export const CHECK_SESSIONID_COOKIE_FAIURE = 'CHECK_SESSIONID_COOKIE_FAIURE';


export const CLEAR_POSTS_CACHE = 'CLEAR_POSTS_CACHE';

function postsAreFresh(state){
    const expiry = 120; //cache survives for 120 seconds
    return state.posts && Object.keys(state.posts).length > 0 &&  state.lastRefreshDate > (getNowInSeconds() - expiry)
}


export function clearPostsCacheIfStale(){
    console.log("clearPostsCacheIfStale called")
    return (dispatch, getState) => {
        const state = getState();
        console.log(state);
        if (!postsAreFresh(state)) {
            console.log("Posts No Longer Fresh going to clear posts")
            dispatch({type: CLEAR_POSTS_CACHE})
        }
    }
}


function fetchRequest(){
    return {
        type: FETCH_REQUEST
    }
}

function fetchtError(httpError){
    console.error("ERROR: fetchPostError", httpError);
    let {status, statusText} = httpError;
    return {
        type: FETCH_ERROR,
        httpError: {
            status,
            statusText
        } //returns the Response object that raised the error
    }
}


export function historyChanged(){
    //function called whenever react router history changes
    clearPostsCacheIfStale();
    return {
        type: HISTORY_CHANGED
    }
}




function fetchAllPostsSuccess(payload){
    console.log("fetchAllPostsSuccess", payload)
    return {
        type: FETCH_ALL_POSTS_SUCCESS,
        payload
    }
}



export function fetchAllPosts(){
    const url = '/api/posts?format=json';
    return (dispatch, getState) => {
        if(postsAreFresh(getState())){
            console.log("posts Are Fresh")
            return;
        }
        dispatch(fetchRequest());
        fetch(url, {credentials: "include"}).then(resp => {
            if(!resp.ok){
                dispatch(fetchtError(resp));
                return false;
            }
            resp.json().then(json => {
                dispatch(fetchAllPostsSuccess(json))
            })
        })
    }
}



function createPostSuccess(payload){
    console.log('postBlogSuccess', payload)
    return {
        type: CREATE_POST_SUCCESS,
        payload
    }
}

function createPostError(err){
    console.error("ERROR: actions/postBlogError", err);
    return {
        type: CREATE_POST_ERROR,
        err
    }
}


export function createPost(data, callback){
    const url = '/api/posts';
    return(dispatch) => {
        djangoFetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
        }).then(resp => {
            if(!resp.ok){
                dispatch(createPostError(resp));
                return false;
            }
            resp.json().then(json => {
                if(resp.ok){
                    dispatch(createPostSuccess(json))
                    const id = json.id;
                    callback(id) //the callback redirects the user to the route /posts/:id
                } else {
                    dispatch(createPostError(json))
                }
            })
        })
    }
}


function deletePostSuccess(id){
    return {
        type: DELETE_POST_SUCCESS,
        payload: id
    }
}



export function deletePost(id, callback){
    const url = `/api/posts/${id}`;
    console.log('deletePost', url);
    return(dispatch) => {
        dispatch(fetchRequest());
        djangoFetch(url, {
            method: 'DELETE',
        }).then(resp => {
                if(resp.ok){
                    dispatch(deletePostSuccess(id));
                    callback && callback(); //only execute callback if it exists
                } else {
                    dispatch(fetchtError(resp))
                }
            })
    }
}



function fetchPostSuccess(payload){
    console.log("fetchPostSuccess", payload)
    return {
        type: FETCH_POST_SUCCESS,
        payload
    }
}



export function fetchPost(id, callback){
    const url = `/api/posts/${id}?format=json`;
    console.log('fetchPost Called');
    return(dispatch) => {
        dispatch(fetchRequest());
        djangoFetch(url).then(resp => {
            if(!resp.ok){
                dispatch(fetchtError(resp));
                return false;
            }
            resp.json().then(json => {
                dispatch(fetchPostSuccess(json))
                callback && callback(); //only execute callback if it exists
            })
        })
    }
}

function checkSessionCookieSuccess(payload){
    console.log(payload);
    return {
        type: CHECK_SESSIONID_COOKIE_SUCCESS,
        payload
    }
}

function checkSessionCookieFailure(err){
    return {
        type: CHECK_SESSIONID_COOKIE_FAIURE
    }
}


export function checkAuthentication(){
    //const session_id = getCookie("sessionid") //valid session id
    //console.log(session_id)
    return (dispatch) => {
        djangoFetch('/api/current_user?format=json').then(resp => {
            if(!resp.ok){
                // dispatch(checkSessionCookieFailure(resp));
                console.error("checkSessionCookieFailure", resp);
                return false;
            } else {
                resp.json().then(json => {
                    if(json.is_authenticated ){
                        dispatch(checkSessionCookieSuccess(json))
                    } else {
                        dispatch(checkSessionCookieFailure(json))
                    }
                })
            }
        })
    }
}



