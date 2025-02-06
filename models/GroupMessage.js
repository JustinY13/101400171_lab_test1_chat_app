const mongoose = require('mongoose');

const GroupMessageSchema = new mongoose.Schema({
    from_user: {
        type: String,
        required: true,
    },

    room: {
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

GroupMessageSchema.pre('save', (next) => {
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

const GroupMessage = mongoose.model("Group Message", GroupMessageSchema);
module.exports = GroupMessage;