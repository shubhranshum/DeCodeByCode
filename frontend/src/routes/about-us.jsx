import React from 'react';
import Navbar from '../components/Navbar/navbar.jsx';
import AboutUs from '../components/About/about-us.jsx';

const About = () => {
    return (
        <>
            <Navbar activePage="About Us"/>
           
            <div className="pt-15.5">
                             <AboutUs/>
                        </div>
        </>
    );
}
export default About;