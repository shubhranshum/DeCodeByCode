import LoginPage from '../components/Authentication/loginPage.jsx';
import Navbar from "../components/Navbar/navbar.jsx";
import {useUser} from "../context/userContext.jsx";

const Login = () => {
    const {user} = useUser();
    if (user) {
        window.location.href = "/"; // Redirect to home if user is already logged in
    }
    return (
        <>
            <Navbar activePage={"Login"}/>
            <LoginPage/>
        </>
    );
}
export default Login;