const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:  { type: String, required: true ,trim :true, lowercase:true, unique:true,minlength:[3, "Username must be at least 3 characters long"], maxlength:30},
    email:     { type: String, required: true, trim :true, lowercase:true, unique:true, minlength:[5, "Email must be at least 5 characters long"], maxlength:50},
    password:  { type: String, required: true, trim :true, minlength:[6, "Password must be at least 6 characters long"], maxlength:1024},
})
const user = mongoose.model('User', userSchema);
const userModel = module.exports = user;