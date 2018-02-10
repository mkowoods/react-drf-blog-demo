import _ from "lodash";

//Adapted from: https://docs.djangoproject.com/en/dev/ref/csrf/#ajax
function getCookie(name){
    let cookieValue = null;
    if (document.cookie && document.cookie !== ''){
        const cookies = document.cookie.split(";");
        for(let idx in cookies){
            //console.log(idx)
            let cookie = _.trim(cookies[idx]);
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

console.log("csrftoken", );




export const FETCH_ALL_POSTS_REQUEST = 'FETCH_ALL_POSTS_REQUEST';
export const FETCH_ALL_POSTS_SUCCESS = 'FETCH_ALL_POSTS_SUCCESS';
export const FETCH_ALL_POSTS_ERROR   = 'FETCH_ALL_POSTS_ERROR';
export const FETCH_POST_REQUEST = 'FETCH_POST_REQUEST';
export const FETCH_POST_SUCCESS = 'FETCH_POST_SUCCESS';
export const FETCH_POST_ERROR   = 'FETCH_POST_ERROR';
export const CREATE_POST_SUCCESS = 'CREATE_POST_SUCCESS';
export const CREATE_POST_ERROR   = 'CREATE_POST_ERROR';
export const DELETE_POST_SUCCESS = 'DELETE_POST_SUCCESS';
export const DELETE_POST_ERROR = 'DELETE_POST_ERROR';


function fetchAllPostsRequest(){
    return {
        type: FETCH_ALL_POSTS_REQUEST
    }
}

function fetchAllPostsSuccess(payload){
    console.log("fetchAllPostsSuccess", payload)
    return {
        type: FETCH_ALL_POSTS_SUCCESS,
        payload
    }
}

function fetchAllPostsError(err){
    console.error("ERROR: fetchAllPostsError", err);
    return {
        type: FETCH_ALL_POSTS_ERROR,
        err
    }
}

export function fetchAllPosts(){
    const url = '/api/posts?format=json';
    return(dispatch) => {
        dispatch(fetchAllPostsRequest())
        fetch(url, {credentials: "include"}).then(resp => {
            if(!resp.ok){
                dispatch(fetchAllPostsError(resp));
                return false;
            }
            resp.json().then(json => {
                if(resp.ok){
                    dispatch(fetchAllPostsSuccess(json))
                } else {
                    dispatch(fetchAllPostsError(json))
                }
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
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie("csrftoken")
            }),
            credentials: "include"
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

function deletePostError(){
    return {type: DELETE_POST_ERROR}
}

export function deletePost(id, callback){
    const url = `/api/posts/${id}`;
    console.log('deletePost', url)
    return(dispatch) => {
        fetch(url, {
            method: 'DELETE',
            headers: new Headers({"X-CSRFToken": getCookie("csrftoken")}),
            credentials: "include"
        }).then(resp => {
                if(resp.ok){
                    dispatch(deletePostSuccess(id));
                    callback && callback(); //only execute callback if it exists
                } else {
                    dispatch(deletePostError())
                }
            })
    }
}

function fetchPostRequest(){
    return {
        type: FETCH_POST_REQUEST
    }
}

function fetchPostSuccess(payload){
    console.log("fetchPostSuccess", payload)
    return {
        type: FETCH_POST_SUCCESS,
        payload
    }
}

function fetchPostError(err){
    console.error("ERROR: fetchPostError", err);
    return {
        type: FETCH_POST_ERROR,
        err
    }
}


export function fetchPost(id, callback){
    const url = `/api/posts/${id}?format=json`;
    console.log('fetchPost Called')
    return(dispatch) => {
        dispatch(fetchPostRequest())
        fetch(url, {credentials:"include"}).then(resp => {
            if(!resp.ok){
                dispatch(fetchPostError(resp));
                return false;
            }
            resp.json().then(json => {
                if(resp.ok){
                    dispatch(fetchPostSuccess(json))
                    callback && callback(); //only execute callback if it exists
                } else {
                    dispatch(fetchPostError(json))
                }
            })
        })
    }
}
