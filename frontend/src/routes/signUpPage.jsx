import React from 'react';
import SignUpPage from '../components/Authentication/signUpPage.jsx';
import Navbar from "../components/Navbar/navbar.jsx";
import {useUser} from "../context/userContext.jsx";
import Home from "./home.jsx"; // Import Home component

const SignUp = () => {
    const {user} = useUser();
    if (user) {
        if (user) {
            window.location.href = "/"; // Redirect to home if user is already logged in
        }
    }
    return (
        <>
        <Navbar activePage={"SignUp"}/>
            <SignUpPage/>
        </>
    );
}
export default SignUp;