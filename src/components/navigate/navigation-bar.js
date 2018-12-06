import React, { Component } from 'react';
import {Link} from 'react-router-dom'

const NavigateBar = () => {
    return (
        <div className="Leftbar">
        <div class="icon-bar">
            <Link to='/'><i class="fa fa-home" ></i></Link>
            <div className="toollabel"><span className="labeltext">Home</span></div>
            <Link to='/dataelements'><i class="fa fa-search" ></i></Link>
            <div className="toollabel"><span className="labeltext">Create Data-Element</span></div>
            <Link to='/programstage'><i class="fa fa-envelope" ></i></Link>
            <div className="toollabel"><span className="labeltext">Create Program-Stage</span></div>
        </div>
        </div>
    );
};
export default NavigateBar;
