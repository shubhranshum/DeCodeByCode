import Navbar from "../components/Navbar/navbar.jsx";
import Problem from "../components/Problem/problem.jsx";

export default function ProblemPage() {
    return (
        <>
            <Navbar activePage={"Problems"} />
            <div className = "mt-15"><Problem /></div>
        </>
    );
}