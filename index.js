require('dotenv').config();

const express = require('express');
const app = express();

const cors = require('cors');
const db = require('./components/db');

const registerRoutes = require('./routes/register');
const loginRoutes = require('./routes/login');
const logoutRoutes = require('./routes/logout');
const refreshRoutes = require('./routes/refresh');
const boardRoutes = require('./routes/board');
const commentRoutes = require('./routes/comment');
const replyRoutes = require('./routes/reply');

const PORT = 3001;
const baseURL = "http://localhost:3000"

//using json
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

//cors settings
app.use(cors({
    credentials: true,
    origin: baseURL
}))

//using routes
app.use('/register',registerRoutes);
app.use('/login',loginRoutes);
app.use('/logout',logoutRoutes);
app.use('/refresh',refreshRoutes);
app.use('/board',boardRoutes);
app.use('/comment',commentRoutes);
app.use('/reply',replyRoutes);

//db connecting
db.Connect();

let today = new Date();
console.log("Server Started at "+today.toDateString() + " " + today.toTimeString()+" Listening to "+PORT);
app.listen(PORT);

