import { useEffect } from 'react'
import React from 'react'

import GenerateReport from '../../components/GenerateReport';
import Reports from '../../components/Reports';

export default function Accounting() {
    useEffect(() => {
        document.title = `Manager | Accounting`;
    }, []);
    return (
        <div className='GeneralContent container-fluid'>
            <div className="row">
                <div className="col-4">    <GenerateReport /></div>
                <div className="col-8 ">      <Reports /></div>
            </div>
        </div>
    )
}
