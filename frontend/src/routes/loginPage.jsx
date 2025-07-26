import LoginPage from '../components/Authentication/loginPage.jsx';
import Navbar from "../components/Navbar/navbar.jsx";
import {useContext} from "react";
import {UserContext} from "../context/userContext.jsx";

const Login = () => {
    const {user} = useContext(UserContext);
    if (user) {
        window.location.href = "/"; // Redirect to home if user is already logged in
    }
    return (
        <>
            <Navbar activePage={"Login"}/>
            <div className="pt-10"><LoginPage/></div>
            
        </>
    );
}
export default Login;