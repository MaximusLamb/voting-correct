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
}, {
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.id;
    }
  }
});

userSchema.virtual('memberships', {
  ref: 'Membership',
  localField: '_id',
  foreignField: 'user'
});

module.exports = mongoose.model('User', userSchema);
