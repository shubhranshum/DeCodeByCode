import React from "react";
import ProfilePage from "../components/Profile/profilePage";
import Navbar from "../components/Navbar/navbar";
const Profile = () => {
    return (
        <>
            <Navbar activePage={"BlogPost"} />
            <div className="pt-15.5">
                <ProfilePage />
            </div>
        </>
    );
};

export default Profile;