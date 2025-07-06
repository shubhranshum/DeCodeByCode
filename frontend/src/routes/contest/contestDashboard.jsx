import ContestDashboard from '../../components/Contest/contestDashboard.jsx';
import Navbar from '../../components/Navbar/navbar.jsx';

const Contest = () => {
    return (
        <>  <Navbar activePage={"BattleGround"} />
            <div className="pt-20"> {/* Adjust this value to your navbar's height */}
                <ContestDashboard />
            </div>
        </>
    );
}

export default Contest;