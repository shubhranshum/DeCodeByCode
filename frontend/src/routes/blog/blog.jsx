import Blog from "@/components/Blog/blog";
import Navbar from "../../components/Navbar/navbar.jsx";

const BlogPage = () => {
    return (
        <>
            <Navbar activePage={"BlogPage"} />
            <div > {/* Adjust this value to your navbar's height */}
                <Blog />
            </div>
        </>
    );
};

export default BlogPage;
