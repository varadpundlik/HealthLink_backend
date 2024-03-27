const bcrypt = require("bcrypt");
const config = require("../config");
const User = require("../models/user");
const Doctor=require("../models/doctor");
const jwt=require("jsonwebtoken");
const constants = require("../constant/index");

const { USER_NOT_FOUND, USER_CREATED, USER_LOGIN_FAILED } = constants;

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      res.status(400);
      throw new Error("All fields are mandatory!");
    }

    const userAvailable = await User.findOne({ email });
    if (userAvailable) {
      res.status(400);
      throw new Error("User already registered!");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ _id: user.id, email: user.email });
  } catch (error) {
    res.status(400).send("User data is not valid"+error.message);
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("All fields are mandatory!");
    }

    const user = await User.findOne({ email });

    // Compare password with hashed password
    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken= jwt.sign({
        user:{
          username:user.username,
          email :user.email,
          id : user.id,
        },

      },config.Access_token_secret,
        {expiresIn: "15m"}
      );
      
      res.status(200).json({ accessToken });
    } else {
      res.status(401);
      throw new Error("Email or password is not valid");
    }
  } catch (error) {
    res.status(500).send("Internal Server Error"+error.message);
  }
};


const currentUser = async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).send("Internal Server Error"+error.message);
  }
};

const listDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({}, "name address email specialization");
    res.json(doctors);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};



module.exports = { register, login, currentUser,listDoctors };