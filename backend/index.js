const express = require('express');
const cors = require('cors');
const PORT = 3000;
const mongoose = require('mongoose');
const auth = require('./middlewares/auth');
const dotenv = require('dotenv').config();
const router = require('./routes/auth.js');
const homeRouter = require('./routes/home.js');
const logoutRouter = require('./routes/logout.js');
const problemHandling = require('./routes/problemHandling.js');
const codeRunner = require('./routes/codeRunner.js');
const makeAdmin = require('./routes/makeAdmin.js');

const blogRouter = require('./routes/blog');
const profile = require('./routes/profile');
const adminRouter = require('./routes/admin.js');


const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', // Frontend URL
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));
// Increase payload size limit
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/makeYourView';
console.log(url);
// Connect to MongoDB
mongoose.connect(url).then(()=>{
    console.log('Connected to MongoDB');
}).catch((err)=>{
    console.error('Error connecting to MongoDB:', err);
})


app.use('/', router);
app.use('/',blogRouter)

app.use('/',auth,[homeRouter,problemHandling,logoutRouter,codeRunner,makeAdmin,profile]);


app.use('/admin', auth, adminRouter);
app.listen(PORT,(err)=>{
    if(err){
        console.error('Error starting the server:', err);
    } else {
        console.log(`Server is running on http://localhost:${PORT}`);
    }
})
