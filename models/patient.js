const mongoose = require("mongoose");
const user = require("./user");

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
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  test_results: [
    {
      test_name: String,
      test_date: Date,
      test_result: String,
    },
  ],
  anaytics:[
    {
      date: Date,
      heartRate: Number,
      bloodPressure: String,
      weight: Number,
      sugarLevel: Number,
      temperature: Number,
      oxygenLevel: Number,
      stepsWalked: Number,
      caloriesBurned: Number,
      sleepDuration: Number,
      waterIntake: Number,
      caloriesIntake: Number,
      callTime: Number,
      videoCallTime: Number,
      screenTIme: Number,
      messageCount: Number,
      medicineTaken: Number,
      medicineMissed: Number,
    }
  ]
});

const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;
