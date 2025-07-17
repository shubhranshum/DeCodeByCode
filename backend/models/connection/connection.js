// models/Connection.js
const mongoose = require('mongoose');   
const { Schema } = mongoose;

const ConnectionSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reciever: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  

  
},
{ timestamps: true }
);

// Optional: Add unique compound index to avoid duplicate connections
ConnectionSchema.index({ requester: 1, recipient: 1 }, { unique: true });

module.exports = mongoose.model('Connection', ConnectionSchema);
