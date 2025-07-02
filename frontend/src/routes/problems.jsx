import ProblemDashboard from '../components/Problem/problemDashboard.jsx';
import Navbar from "../components/Navbar/navbar.jsx";

export default function ProblemsPage() {
    return (
        <>
            <Navbar activePage={"Problems"}/>
            <div className="mt-15"><ProblemDashboard /></div>
        </>
    );
}