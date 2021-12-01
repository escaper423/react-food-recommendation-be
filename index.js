require('dotenv').config();

const fs = require('fs')
const http = require('http')
const https = require('https')
const path = require('path')

const httpsOptions = {
    key: fs.readFileSync(path.join(__dirname,'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname,'cert','cert.pem')),
}

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

const PORT = {
    http: 3002,
    https: 3003
};

const whiteList = [`http://localhost:3000`]

//using json
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

//cors settings
app.use(cors({
    credentials: true,
    origin: whiteList
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

//starting server
console.log("Server Started at "+today.toDateString() + " " + today.toTimeString());
http.createServer(app).listen(PORT.http, () => {console.log("Listening to http: "+PORT.http)});
https.createServer(httpsOptions, app).listen(PORT.https, () => {console.log("Listening to https: "+PORT.https)});

