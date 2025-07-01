import Navbar from "@/components/Navbar/navbar";
import BlogDetails from "@/components/Blog/blogDetail";

export default function BlogDetail() {
    return (
        <>
            <Navbar />
            <div className = "pt-15.5"><BlogDetails /></div>
            
        </>
    );
}