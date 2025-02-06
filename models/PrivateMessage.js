const mongoose = require('mongoose');

const PrivateMessageSchema = new mongoose.Schema({
    from_user: {
        type: String,
        required: true,
    },
    to_user: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    date_sent: {
        type: Date,
        default: Date.now
    },
});

PrivateMessageSchema.pre('save', (next) => {
    console.log("Before Save")
    let now = Date.now()
     
    this.date_sent = now
    // Set a value for createdAt only if it is null
    if (!this.date_sent) {
      this.date_sent = now
    }
    
    // Call the next function in the pre-save chain
    next()
});

const PrivateMessage = mongoose.model("Private Message", PrivateMessageSchema);
module.exports = PrivateMessage;