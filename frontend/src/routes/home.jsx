import React from 'react';
import HomePage from '../components/Home/home.jsx';
import Navbar from "../components/Navbar/navbar.jsx";


const Home = () => {
    return (
        <>
        <Navbar activePage="Home"/>
            <HomePage />
        </>
    );
}
export default Home;

