const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },
  phone: {
    type: String
  },
  email: {
    type: String
  },
  communicationMedium: {
    type: String,
    enum: ['email', 'phone']
  },
  image: {
    type: String
  }
});

module.exports = mongoose.model('User', userSchema);
