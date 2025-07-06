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
import ProblemPage from './routes/problem/problem.jsx';
import ProblemsPage from './routes/problem/problems.jsx';
import SignUp from './routes/signUpPage.jsx';
import CreateBlogForm from './routes/blog/blogPost.jsx';
import UpdateProfileForm from './components/Profile/ProfilePage/editProfileModal.jsx';
import Problem from './components/Admin/CreateProblem/adminProblem.jsx';
import Contest from './routes/contest/contestDashboard.jsx'
import ContestView from './components/Contest/contest.jsx';
import ContestProblemPage from './routes/contest/problem.jsx';

import EditProblem from './routes/Admin/CreateProblem/editProblem.jsx';
import EditContest from './routes/Admin/CreateContest/editContest.jsx';
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
        <Route path="problems/:problemId" element={<ProblemPage />} />
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

        <Route path="/admin/edit-problem/:problemId" element={<EditProblem/>} />
        <Route path="/admin/problems/:problemId" element={<Problem/>} />
        <Route path = "/profile/update" element={<UpdateProfileForm/>} />

        <Route path="/contests" element={<Contest />} />
        <Route path="/contests/:contestId" element={<ContestView />} />
        <Route path="/contests/:contestId/problems/:problemId" element={<ContestProblemPage />} />
        <Route path="/admin/edit-contest/:contestId" element={<EditContest />} />


        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}
