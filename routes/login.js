const express = require('express');
const router = express.Router();
const userInfo = require('../models/users');
const bc = require('bcrypt');
const jwt = require('jsonwebtoken');
const {generateToken} = require('../components/token-manager');
const cookieParser = require('cookie-parser');

router.use(cookieParser());

router.use(function(req, res, next) {
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
  });
  
router.post('/', async (req, res) => {
    //auth user
    console.log("\nprocessing login sequence");
    try {
        const { username, password } = req.body;
        
        const user = await userInfo.findOne({ username: username });

        if (user) {
            const isValid = await bc.compare(password, user.password);
            if (isValid) {
                const accessToken = generateToken(username,'access');
                const refreshToken = generateToken(username,'refresh');

                console.log("\nLogin succeed");
                console.log("accessToken: "+accessToken);
                console.log("refreshToken: "+refreshToken+"\n");
                res.cookie('refreshToken', refreshToken, { sameSite: 'none', secure: true, httpOnly: true} );
                res.status(200).send(
                    {
                        username: username,
                        accessToken: accessToken
                    });
                    
            }
            else {
                res.status(400).send("Invalid password");
            }
        }
        else {
            res.status(401).send("User does not exist");
        }
    }
    catch(e){
        console.log(e);
        res.status(500).send("Server error.");
    }
})

module.exports = router;