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
    );
}
