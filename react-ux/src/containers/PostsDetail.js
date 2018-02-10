import React, {Fragment} from 'react'
import {connect} from 'react-redux'
import {fetchPost, deletePost} from "../actions";

import {Link} from 'react-router-dom';


class PostsDetail extends React.Component {

    //this isnt right but dot if for now
    componentDidMount(){

        console.log(this.props.post)
        if( !this.props.post ){
            const id = this.props.match.params.id;
            this.props.fetchPost(id);
        }
    }

    handleClickDelete(e){
        const id = this.props.match.params.id;
        this.props.deletePost(id, () => {this.props.history.push("/")});

    }

    render(){
        if(!this.props.post){
            return <h3>Loading...</h3>;
        }
        return (
           <div className="container">
               <div className="row">
                   <div className="col-12">
                       <Link className="float-left" to="/"> &lt;&lt; Back to Posts </Link>
                       <button disabled={!this.props.post.is_owner} className="btn btn-danger float-right" onClick={(e) => this.handleClickDelete(e)}>Delete Post</button>
                   </div>
               </div>
               <div className="row">
                   <div className="col-12" >
                       <h3>{this.props.post.title}</h3>
                       <h6>{this.props.post.categories}</h6>
                       <p>{this.props.post.content}</p>
                   </div>
               </div>
           </div>
        )
    }
}

function mapStateToProps({ posts }, ownProps){
    return {
        post: posts[ownProps.match.params.id],
    }
}

// function mapDispatchToProps(dispatch){
//     return {
//         onLoad: () => {dispatch(fetchAllPosts())}
//     }
// }

export default connect(mapStateToProps, { deletePost, fetchPost })(PostsDetail);
