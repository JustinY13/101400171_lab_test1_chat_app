const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },

    firstname: {
        type: String,
        required: true,
        trim: true,
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    created_on: {
        type: Date,
        default: Date.now
    },

});
/*
UserSchema.pre('save', (next) => {
    let now = Date.now()
    this.date_sent = now
    if (!this.date_sent) {
      this.date_sent = now
    }
    next()
});
*/
const User = mongoose.model("User", UserSchema);
module.exports = User;