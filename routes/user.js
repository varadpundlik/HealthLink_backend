const express =require("express");
const usercontrol=require("../controllers/user");
const userrouter =express.Router();

userrouter.post("/login",usercontrol.login);
userrouter.post("/register",usercontrol.register);
userrouter.get("/current",usercontrol.currentUser);

module.exports=userrouter;