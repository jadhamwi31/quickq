<<<<<<< HEAD
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
=======
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import './style.css';
import PackageJson from '../../../package.json';

export default function Index() {
    const [brand, setBrand] = useState<any>([]);

    useEffect(() => {
        const getBrand = async () => {
            const response = await fetch('/brand', {
                headers: {
                    Authorization: `Bearer ${Cookies.get('jwt')}`,
                },
            });

            if (response.ok) {
                const json = await response.json();
                setBrand(json.data.brand);
            }
        };

        getBrand();
    }, []);

    return (
        <>
            <div className="bg"></div>
            <div className="bg bg2"></div>
            <div className="bg bg3"></div>
            <div className="content12">
                {brand && brand.logo && (
                    <img
                        src={`${PackageJson.proxy}/images/${brand.logo}`}
                        style={{
                            borderRadius: '15px',
                            width: '250px',
                            height: '250px',
                            display: "block",
                            marginInline: "auto"

                        }}
                        alt=""
                    />
                )}<br />
                {brand && brand.name && <h1 style={{
                    textAlign: "center"
                }}>{brand.name}</h1>}<br />
                {brand && brand.slogan && (
                    <h3 style={{
                        textAlign: "center"
                    }}>
                        <i>{brand.slogan}</i>
                    </h3>
                )}<br />
            </div>
        </>
>>>>>>> 593ddda476d8c3314a5baaaa92ca7e4950143d17
    );
}
