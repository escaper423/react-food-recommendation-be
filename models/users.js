const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username: String,
        email: String,
        password: String,
        registerdate: String,
        role: String,
    }
);

module.exports = mongoose.model('users', userSchema);