const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const problemStatSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  problemid: { type: Schema.Types.ObjectId, ref: 'Problem', required: true },
  problemtitle: { type: String, required: true },
  status:{
    type: String,
  },
  
  attempts: { type: Number, default: 0 },
  solution: { type: String },
  solvedAt: { type: Date },
  timetaken: { type: Number },
  memorytaken: { type: Number },
  



  
}, { timestamps: true });

module.exports = mongoose.model('ProblemStats', problemStatSchema);
