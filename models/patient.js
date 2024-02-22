const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  healthConditions: [String],
  medications: [{
    name: String,
    dosage: String,
    frequency: String
  }],
  appointments: [{
    date: Date,
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor'
    },
    notes: String
  }],
  adherenceData: [{
    date: Date,
    adherencePercentage: Number
  }]
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;
