const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  }
});

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;
