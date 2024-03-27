const doctorRouter = require("./doctor");
const PatientRouter = require("./patient");
const userrouter = require("./user");
const educationrouter = require("./Education");
const routes = (app) => {
  app.use("/patient", PatientRouter);
  app.use("/user",userrouter);
  app.use("/doctor",doctorRouter);
  app.use("/education_materials",educationrouter);
};

module.exports = routes;
