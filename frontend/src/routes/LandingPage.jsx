import React from 'react';
import Navbar from '../components/Navbar/navbar.jsx';
import LandingPage from '../components/landingPage.jsx';
import AboutUs from '../components/About/about-us.jsx';

const Landing = () => {
    return (
        <>
            <Navbar activePage="LandingPage"/>
            <div className="pt-15.5"><LandingPage/></div>
            
            <AboutUs/>
        </>
    );
}
export default Landing;