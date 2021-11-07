const express = require('express');
const router = express.Router();

router.post('/', (req,res) => {
    res.cookie('refreshToken',"");
    res.status(200).send("Logout success.");
})

module.exports = router;