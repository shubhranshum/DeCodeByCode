import React from 'react';
import HomePage from '../components/Home/home.jsx';
import Navbar from "../components/Navbar/navbar.jsx";


const Home = () => {
    return (
        
        <div className="pt-15.5">
        <Navbar activePage="Home"/>
            <HomePage />
        
        </div>
    );
}
export default Home;

