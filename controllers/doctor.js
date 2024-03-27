const bcrypt = require("bcrypt");
const Doctor = require("../models/doctor");
const jwt = require("jsonwebtoken");
const config = require("../config");
const Patient = require("../models/patient");

const registerDoctor = async (req, res) => {
  try {
    const { username, email, password, name, address, specialization } =
      req.body;
    if (
      !username ||
      !email ||
      !password ||
      !name ||
      !address ||
      !specialization
    ) {
      res.status(400);
      throw new Error("All fields are mandatory!");
    }

    const doctorAvailable = await Doctor.findOne({ email });
    if (doctorAvailable) {
      res.status(400);
      throw new Error("Doctor already registered!");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor = await Doctor.create({
      username,
      email,
      password: hashedPassword,
      name,
      address,
      specialization,
    });

    res.status(201).json({ _id: doctor.id, email: doctor.email });
  } catch (error) {
    res.status(400).send("Doctor data is not valid " + error.message);
  }
};

const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("All fields are mandatory!");
    }

    const doctor = await Doctor.findOne({ email });

    // Compare password with hashed password
    if (doctor && (await bcrypt.compare(password, doctor.password))) {
      const accessToken = jwt.sign(
        {
          user: {
            username: doctor.username,
            email: doctor.email,
            id: doctor.id,
          },
        },
        config.Access_token_secret,
        { expiresIn: "15m" }
      );

      res.status(200).json({ accessToken });
    } else {
      res.status(401);
      throw new Error("Email or password is not valid");
    }
  } catch (error) {
    res.status(500).send("Internal Server Error " + error.message);
  }
};

const getAppointment = async (req, res) => {
  try {
    const patients = await Patient.find()
    let appointments = [];
    patients.map((patient) => {
      patient.appointments.map((appointment) => {
        if (appointment.doctor == req.user.id) {
          appointments.push({
            appointmentId: appointment._id,
            date: appointment.date,
            patientId: patient._id,
            patientName: patient.firstName + " " + patient.lastName,
            patientEmail: patient.email,
            patientContact: patient.contactNumber,
          });
        }
      });
    });
    //console.log(appointments);
    return res.status(200).json(appointments);
  } catch (error) {
    res.status(500).send("Internal Server Error " + error.message);
  }
};

const addAppointmentNotes = async (req, res) => {
  try {
    const patient = await Patient.findById(req.body.patientId);
    console.log(patient)
    if (!patient) {
      return res.status(404).send("Patient not found");
    }
    const appointment = patient.appointments.find(
      (appointment) => appointment._id == req.body.appointmentId
    );
    if (!appointment) {
      return res.status(404).send("Appointment not found");
    }
    appointment.notes = req.body.notes;
    await patient.save();
    return res.status(200).send("Notes added successfully");
  } catch (error) {
    res.status(500).send("Internal Server Error " + error.message);
  }
};

const currentDoctor = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).send("Internal Server Error " + error.message);
  }
};

module.exports = { registerDoctor, loginDoctor, currentDoctor, getAppointment, addAppointmentNotes };
