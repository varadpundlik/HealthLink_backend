const express =require("express");
const usercontrol=require("../controllers/user");
const userrouter =express.Router();
const validatetoken=require("../middleware/validateTokenhandler");
userrouter.post("/login",usercontrol.login);
userrouter.post("/register",usercontrol.register);
userrouter.get("/current",validatetoken,usercontrol.currentUser);

userrouter.get("/doctors", usercontrol.listDoctors);

module.exports=userrouter;