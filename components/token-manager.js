const jwt = require('jsonwebtoken');

const generateToken = (user, type) => {
    let token;
    switch(type){
        case 'access':
            token = jwt.sign({username: user}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30s'});
            break;
        case 'refresh':
            token = jwt.sign({username: user}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '5m'});
            break;
    }
    return token;
}

const sendNewToken = (user, res) => {
    console.log("Sending new token...");
    const accessToken = generateToken(user.username, 'access');
    res.cookie('refreshToken', generateToken(user.username, 'refresh'), { sameSite: 'none', secure: true, httpOnly: true });
    console.log("Username:",user.username);
    return res.status(200).send({
        username: user.username,
        accessToken: accessToken
    });
}

const sendFailToken = (res) => {
    res.cookie('refreshToken',"", { sameSite: 'none', secure: true, httpOnly: true });
    return res.status(403).send("Failed to refresh token.");
}


exports.generateToken = generateToken;
exports.sendNewToken = sendNewToken;
exports.sendFailToken = sendFailToken;