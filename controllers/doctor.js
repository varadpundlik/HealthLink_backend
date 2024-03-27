const bcrypt = require("bcrypt");
const Doctor = require("../models/doctor");
const jwt = require("jsonwebtoken");
const config = require("../config");

const registerDoctor = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
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
    res.status(500).send("Internal Server Error "+error.message);
  }
};

const currentDoctor = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).send("Internal Server Error "+error.message);
  }
};

module.exports = { registerDoctor, loginDoctor, currentDoctor };
