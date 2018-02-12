import React from 'react'
import {Link} from 'react-router-dom'
export default () => {
    return (
        <div className="container">
            <div className="row">
                <div className="col-12" style={{textAlign: "center"}}>
                    <h1 style={{fontSize: "10rem", color: "blue", }}>404</h1>
                    <Link className="" to="/"> Head Back Home  </Link>
                </div>
            </div>
        </div>
    )
}