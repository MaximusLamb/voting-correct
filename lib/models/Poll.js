const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({

  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
  },
  options: [String],
});

module.exports = mongoose.model('Poll', pollSchema);
