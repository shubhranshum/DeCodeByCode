import Navbar from "../../components/Navbar/navbar.jsx";
import ContestView from "../../components/Contest/contest.jsx";

export default function ContestPage() {
    return (
        <>
            <Navbar activePage={"Problems"} />
            <div className = "mt-15"><ContestView /></div>
        </>
    );
}