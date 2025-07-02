import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import About from './routes/about-us.jsx';
import Admin from './routes/Admin/admin.jsx';


import BlogDetails from './routes/blog/blogDetails.jsx';
// import CreateBlogForm from './components/Blog/createBlog.jsx';
import EditBlogForm from './components/Blog/editBlog.jsx';
import ProfilePage from './routes/profilePage.jsx';
import UserBlog from './routes/userBlogs.jsx';
import BlogPage from './routes/blog/blog.jsx';
import Home from './routes/home.jsx';
import Landing from './routes/LandingPage.jsx';
import Login from './routes/loginPage.jsx';
import ProblemPage from './routes/problem.jsx';
import ProblemsPage from './routes/problems.jsx';
import SignUp from './routes/signUpPage.jsx';
import CreateBlogForm from './routes/blog/blogPost.jsx';
import UpdateProfileForm from './components/Profile/ProfilePage/editProfileModal.jsx';
import Problem from './components/Admin/adminProblem.jsx';


import EditProblem from './routes/Admin/CreateProblem/editProblem.jsx';
// index.js or App.js (at top level)
import { getTheme, setTheme } from "./utils/theme";

const theme = getTheme();
setTheme(theme); // This sets [data-theme='light'] or [data-theme='dark']


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/about-us" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="problems" element={<ProblemsPage/>}></Route>
        <Route path="problem/:id" element={<ProblemPage />} />
        <Route path="/admin" element={<Admin/>}/>

        
        <Route path="/blogs" element={<BlogPage />} />
        <Route path ="/create-blog" element={<CreateBlogForm/>} />
        <Route path="/blog/:id" element={<BlogDetails />} />
        <Route path ="/profile" element={<ProfilePage/>} />
        <Route path = "/profile/user/:username" element={<ProfilePage/>} />
        <Route path = "/edit-blog/:id" element={<EditBlogForm/>} />
        <Route>
          <Route path="/profile/userblogs" element={<UserBlog />} />
        </Route>
        {/* <Route path ="/create" */}

        <Route path="/admin/edit-problem/:id" element={<EditProblem/>} />
        <Route path="/admin/problem/:id" element={<Problem/>} />
        <Route path = "/profile/update" element={<UpdateProfileForm/>} />


        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}
