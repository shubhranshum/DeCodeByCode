import Navbar from "../../components/Navbar/navbar.jsx";

import CreateBlogForm from "../../components/Blog/createBlog.jsx";

const BlogPost = () => {
    return (
        <>
            <Navbar  activePage={"BlogPost"}  />
            <div className="pt-15.5">
                <CreateBlogForm />
                </div>
            
        </>
    );
};
export default BlogPost;