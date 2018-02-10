import React, {Fragment} from 'react'
import {connect} from 'react-redux'
import {fetchAllPosts} from "../actions";

import {Link, Redirect} from 'react-router-dom'

class PostsIndex extends React.Component {

    componentDidMount(){
        this.props.fetchAllPosts()
    }

    handleOnCick(id){
        this.props.history.push(`posts/${id}`)
    }

    renderCards() {
        const keys_reversed = Object.keys(this.props.posts).reverse()
        const cards = keys_reversed.map(key => {
            const post = this.props.posts[key]
            return (
                <div className="card" key={post.id} onClick={(e) => this.handleOnCick(post.id)}>
                    <div className="card-block">
                        <h4 className="card-title"> {post.title} </h4>
                        <h5 className="small text-muted"></h5>
                        <h6 className="card-subtitle mb-2 text-muted">{post.categories}</h6>
                        <p className="card-text">{post.content}</p>
                    </div>
                    <div className="card-footer text-muted">
                        <div class="float-left">
                            {post.owner && `by ${post.owner}`}
                        </div>
                        <div class="float-right">
                            {post.create_date}
                        </div>
                    </div>
                </div>

            )
        })
        return cards
    }

    render(){
        console.log("PostsIndex", this.props.posts)

        return (
           <div className="container">
               <div className="row">
                   <div className="col-12">
                       <Link className="btn btn-primary float-right" to="/posts/new">Add Post</Link>
                   </div>
               </div>
                <div className="row">
                    <div className="col-12">
                       {this.renderCards()}
                    </div>
                </div>
           </div>
        )
    }
}

function mapStateToProps(state){
    return {
        posts: state.posts,
    }
}

// function mapDispatchToProps(dispatch){
//     return {
//         onLoad: () => {dispatch(fetchAllPosts())}
//     }
// }

export default connect(mapStateToProps, { fetchAllPosts })(PostsIndex);
