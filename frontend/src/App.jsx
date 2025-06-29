import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import About from './routes/about-us.jsx';
import Admin from './routes/Admin/admin.jsx';


import Home from './routes/home.jsx';
import Landing from './routes/LandingPage.jsx';
import Login from './routes/loginPage.jsx';
import ProblemPage from './routes/problem.jsx';
import ProblemsPage from './routes/problems.jsx';
import SignUp from './routes/signUpPage.jsx';
import BlogPage from './routes/blog.jsx';
import BlogDetails from './components/Blog/blogDetail.jsx';
import CreateBlogForm from './components/Blog/createBlog.jsx';
import ProfilePage from './components/Profile/profilePage.jsx';
import UserBlog from './components/Profile/userBlog.jsx';
import EditBlogForm from './components/Blog/editBlog.jsx';
import AdminProblem from './components/Admin/adminProblem.jsx';



import EditProblem from './routes/Admin/CreateProblem/editProblem.jsx';



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
        <Route path = "/edit-blog/:id" element={<EditBlogForm/>} />
        <Route>
          <Route path="/profile/userblogs" element={<UserBlog />} />
        </Route>
        {/* <Route path ="/create" */}

        <Route path="/admin/edit-problem/:id" element={<EditProblem/>} />
        <Route path="/admin/problem/:id" element={<AdminProblem/>} />


        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}
