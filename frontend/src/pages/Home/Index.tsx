import React from 'react';
import './style.css';
const bg = require('../../assets/bg.jpg');
const logo = require('../../assets/logo.png');
export default function index() {
    return (
        <div>
            <div className="site-wrapper" style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover" }}>
                <div className="site-wrapper-inner">
                    <div className="container-fluid">
                        <div className="masthead clearfix">
                            <div className="container-fluid inner">
                                <div style={{
                                    width: "300px",
                                    marginRight: "auto"
                                }} >
                                    <h1 className="masthead-brand" style={{
                                        float: 'right',
                                        paddingTop: "50px",
                                        marginLeft: "25px"
                                    }}>QuickQ</h1>
                                    <img src={logo} width="150px" alt="" style={{
                                        float: 'left'
                                    }} />

                                </div>

                            </div>
                        </div>
                        <div className="inner cover">
                            <h1 className="cover-heading">Cover your page.</h1>
                            <p className="lead">Cover is a one-page template for building simple and beautiful home pages. Download,
                                edit the text, and add your own fullscreen background photo to make it your own.</p>
                            <p className="lead">
                                <a href="#" className="btn btn-lg btn-default">Learn more</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
