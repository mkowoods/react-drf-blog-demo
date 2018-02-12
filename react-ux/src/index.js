import _ from "lodash";

import React, {Fragment} from "react"
import ReactDOM from "react-dom"
import {Provider} from "react-redux"
import {createStore, applyMiddleware, compose} from "redux"
import thunk from "redux-thunk"
import { Router, Route, Switch} from 'react-router-dom'
import createHistory from "history/createBrowserHistory"

import {loadStateFromLocalStorage, saveStateToLocalStorage} from "./util";

import reducers from "./reducers"
import PostsIndex from './containers/PostsIndex'
import PostsDetail from './containers/PostsDetail'
import PostsNew from './containers/PostsNew'
import NoMatch from './components/NoMatch'
import PrivateRoute from './routes'


import {checkAuthentication, historyChanged, clearPostsCacheIfStale} from "./actions";


const persistedState = loadStateFromLocalStorage();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store  = createStore(
    reducers,
    persistedState,
    composeEnhancers(applyMiddleware(thunk))
);

//on start-up
// Check if user is logged in
store.dispatch(checkAuthentication());

// Check if cache is stale, if so drop it and restart
store.dispatch(clearPostsCacheIfStale())

//setup browser history and add history to router
const history = createHistory();
const unlisten = history.listen((location, action) => {
    // location is an object like window.location
    console.log(action, location.pathname, location.state)
    store.dispatch(historyChanged())
});

// Set listener for the store to update localStorage

store.subscribe(_.throttle(() => {
    saveStateToLocalStorage({
        posts: store.getState().posts,
        lastRefreshDate: store.getState().lastRefreshDate
    })
    }, 1000)
);

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Switch>
                <Route exact path="/" component={PostsIndex}/>
                <PrivateRoute exact store={store} path="/posts/new" component={PostsNew} />
                <Route exact path="/posts/:id" component={PostsDetail}/>
                <Route exact path="/error/404" component={NoMatch}/>
                <Route component={NoMatch}/>
            </Switch>
        </Router>
    </Provider>
, document.getElementById("root"))