import Blog from "@/components/Blog/blog";
import Navbar from "../../components/Navbar/navbar.jsx";

const BlogPage = () => {
    return (
        <>
            <Navbar activePage={"Blogs"} />
            <div className = "pt-15.5">
                <Blog />
            </div>
        </>
    );
};

export default BlogPage;
