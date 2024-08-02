const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

userSchema.pre('save', function(next) {
    console.log('Saving user:', this.toObject());
    next();
  });


module.exports = mongoose.model('User', userSchema);