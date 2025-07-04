import React from "react";
import UserBlogs from "@/components/Profile/ProfilePage/userBlog";
import Navbar from "@/components/Navbar/navbar";


const UserBlogsPage = () => {
   return (
        <>
            <Navbar activePage={"UserBlogs"} />
            <div className="pt-15.5"> {/* Adjust this value to your navbar's height */}
                <UserBlogs />
            </div>
        </>
    );
};
export default UserBlogsPage;