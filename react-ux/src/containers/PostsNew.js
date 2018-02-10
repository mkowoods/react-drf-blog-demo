import React from 'react'
import {connect} from "react-redux";
import {Link, Redirect} from 'react-router-dom'
import {createPost} from '../actions'

class PostsNew extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            title: "",
            categories: "",
            content: "",
            errors: []
        }
    }

    handleInputChange(e){
        //console.log("PostsNew event", e);
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    validateForm(){
        const errors = [];
        if(!this.state.title){
            errors.push({key:"title", value: "Title is Empty" })
        }
        if(!this.state.categories){
            errors.push({key:"categories", value: "Categories is Empty"})
        }
        if(!this.state.title){
            errors.push({key:"content", value: "Content is Empty"})
        }
        return errors
    }

    handleSubmit(e){
        e.preventDefault()
        console.log(e, this.state)
        const errors = this.validateForm();
        if(errors.length > 0){
            this.setState({ errors })
        } else {
            this.props.createPost(this.state, (id) => {this.props.history.push(`/posts/${id}`)}); //handles redirect to base URL
        }
    }

    renderErrors(){
        const template = (err) => (<a href="#" key={err.key} className="list-group-item list-group-item-danger">{err.value}</a>)
        return this.state.errors.map(template)
    }


    render(){
        return(
        <div className="container">
            <div className="row">
                <div className="col-6" >
                    <form onSubmit={(e) => this.handleSubmit(e)}>
                        <div className="form-group">
                            <label htmlFor="titleInput">Title</label>
                            <input
                                name="title"
                                type="text"
                                className="form-control"
                                id="titleInput"
                                placeholder="Enter title"
                                value = {this.state.title}
                                onChange = {(e) => this.handleInputChange(e)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="categoriesInput">Categories</label>
                            <input
                                name="categories"
                                type="text"
                                className="form-control"
                                id="categoriesInput"
                                placeholder="Enter categories"
                                value = {this.state.categories}
                                onChange = {(e) => this.handleInputChange(e)}

                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="contentInput">Contents</label>
                            <textarea
                                name="content"
                                className="form-control"
                                id="contentInput"
                                rows="4"
                                value = {this.state.content}
                                onChange = {(e) => this.handleInputChange(e)}

                            />
                        </div>
                        <div>
                            <button type="submit" className="btn btn-primary">Save</button>
                            <Link className="btn btn-secondary" to="/">Cancel</Link>
                        </div>
                    </form>
                </div>
                <div className="col-6">
                    <div className="list-group">
                        {this.renderErrors()}
                    </div>
                </div>
            </div>
        </div>

        )
    }
}

// function mapStateToProps(state){
//     return {
//         posts: state.posts,
//     }
// }

// function mapDispatchToProps(dispatch){
//     return {
//         onLoad: () => {dispatch(fetchAllPosts())}
//     }
// }

export default connect(null, { createPost })(PostsNew);