const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { sendNewToken, sendFailToken } = require('../components/token-manager');
const tag = "- Refresh - "
router.use(cookieParser());

router.get('/', (req, res) => {
    const authHeader = req.headers['authorization'];
    let accessToken = authHeader && authHeader.split(' ')[1];
    const refreshToken = req.cookies.refreshToken;

    //console.log(tag+"\nRefreshing Token...");
    //console.log(tag+"Access Token: " + accessToken);
    //console.log(tag+"Refresh Token: " + refreshToken);

    if (accessToken) {
        //console.log(tag+"\nVerifying access token...");
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                //console.log(tag+"invalid access token. verifying refresh token...")
                jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (errr, user) => {
                    if (errr) {
                        //console.log(tag+"access and refresh token expired.");
                        return sendFailToken(res);
                    }
                    return sendNewToken(user, res);
                });
            }
            else {
                return sendNewToken(user, res);
            }
        });
    }
    else {
        //console.log(tag+"\nNo access token. verifying refresh token...");
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) {
                //console.log(tag+"invalid refresh token.");
                return sendFailToken(res);
            }
            else{
                return sendNewToken(user, res);
            }
        })
    }
})

module.exports = router;

