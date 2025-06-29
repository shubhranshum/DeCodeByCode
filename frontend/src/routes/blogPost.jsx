import React from "react";
import Navbar from "../components/Navbar/navbar.jsx";

import CreateBlogForm from "../components/Blog/createBlog.jsx";

const BlogPost = () => {
    return (
        <>
            <Navbar activePage={"BlogPost"} />
            <CreateBlogForm />
        </>
    );
};
export default BlogPost;