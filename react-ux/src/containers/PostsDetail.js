import React, {Fragment} from 'react'
import {connect} from 'react-redux'
import {fetchPost, deletePost} from "../actions";

import {Link} from 'react-router-dom';


class PostsDetail extends React.Component {

    componentDidMount() {
        console.log(this.props.post);
        if (!this.props.post) {
            const id = this.props.match.params.id;
            this.props.fetchPost(id);
        }

    }

    handleClickDelete(e){
        const id = this.props.match.params.id;
        this.props.deletePost(id, () => {this.props.history.push("/")});

    }

    renderDetailData(){
       if(this.props.httpError){
           return (
               <Fragment>
                   <h2>{this.props.httpError.statusText || 'Somehting went Wrong!!'}</h2>
                   <h6>Code: {this.props.httpError.status}</h6>
               </Fragment>
           )
       }
        if(this.props.isFetching){
            return <h3>Loading...</h3>;
        }

        if(this.props.post){
            return (
                <Fragment>
                   <h3>{this.props.post.title}</h3>
                   <h6>{this.props.post.categories}</h6>
                   <p>{this.props.post.content}</p>
                </Fragment>
            )
        }


    }

    render(){

        return (
           <div className="container">
               <div className="row">
                   <div className="col-12">
                       <Link className="float-left" to="/"> &lt;&lt; Back to Posts </Link>
                       <button disabled={!this.props.isAuthenticated} className="btn btn-danger float-right" onClick={(e) => this.handleClickDelete(e)}>Delete Post</button>
                   </div>
               </div>
               <div className="row">
                   <div className="col-12" >
                       {this.renderDetailData()}
                   </div>
               </div>
           </div>
        )
    }
}

function mapStateToProps({ posts, isFetching, httpError, isAuthenticated, lastRefreshDate }, ownProps){
    return {
        post: posts[ownProps.match.params.id],
        isFetching,
        httpError,
        isAuthenticated
    }
}

// function mapDispatchToProps(dispatch){
//     return {
//         onLoad: () => {dispatch(fetchAllPosts())}
//     }
// }

export default connect(mapStateToProps, { deletePost, fetchPost })(PostsDetail);
