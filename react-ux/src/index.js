import React, {Fragment} from "react"
import ReactDOM from "react-dom"
import {Provider} from "react-redux"
import {createStore, applyMiddleware} from "redux"
import thunk from "redux-thunk"

import { BrowserRouter, Route, Switch} from 'react-router-dom'

import reducers from "./reducers"
import PostsIndex from './containers/PostsIndex'
import PostsDetail from './containers/PostsDetail'
import PostsNew from './containers/PostsNew'

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

const store = createStoreWithMiddleware(reducers,
                                        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())



ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={PostsIndex}/>
                <Route exact path="/posts/new" component={PostsNew} />
                <Route exact path="/posts/:id" component={PostsDetail}/>
            </Switch>
        </BrowserRouter>
    </Provider>
, document.getElementById("root"))