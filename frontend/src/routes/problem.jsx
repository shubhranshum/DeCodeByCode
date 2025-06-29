import Navbar from "../components/Navbar/navbar.jsx";
import Problem from "../components/Problem/problem.jsx";

export default function ProblemPage() {
    return (
        <>
            <Navbar activePage={"Problems"} />
            <Problem />
        </>
    );
}