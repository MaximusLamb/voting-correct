const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({


  title: {
    type: String,
    require: true
  },
  description: {
    type: String,
  },
  image: {
    type: String
  }
});

module.exports = mongoose.model('Organization', organizationSchema);
