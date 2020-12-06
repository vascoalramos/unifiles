
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    auto: true
  },
  username: {
    type: String,
    required: true
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: 2,
    select: false
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  role: { 
    type: String, 
    required: true,
    enum: ["Admin", "Producer", "Consumer"]
  },
  is_active: { 
    type: Boolean, 
    required: true,
  },
  avatar: { 
    type: String, 
    required: true,
  },
  institution: { 
    type: String, 
    required: true,
  }
});
/* Example
    "first_name": "Fábio",
    "last_name": "Gonçalves",
    "username": "fabiog",
    "email": "fabiog@gmail.com",
    "role": "Admin",
    "password": "b6e318dabf42695e3943d896106c3e0cc5254866",
    "isActive": "true",
    "avatar": "xpto.png",
    "institution": "Uminho"
    */
const User = mongoose.model('users', userSchema, 'users');

module.exports = User;