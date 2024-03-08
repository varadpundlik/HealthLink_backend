const PatientRouter = require("./patient");
const userrouter = require("./user");
const routes = (app) => {
  app.use("/patient", PatientRouter);
  app.use("/user",userrouter);
};

module.exports = routes;
