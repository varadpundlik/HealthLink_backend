const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
  },
  healthConditions: [String],
  medications: [
    {
      name: String,
      dosage: String,
      frequency: String,
      issuedOn: Date,
    },
  ],
  appointments: [
    {
      date: Date,
      doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
      },
      notes: String,
    },
  ],
  reminder: [
    {
      medicine: String,
      timing: [String],
      startDate: Date,
      endDate: Date,
      declinedOn: [Date],
    },
  ],
});

const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;
