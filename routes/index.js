const PatientRouter = require("./patient");

const routes = (app) => {
  app.use("/patient", PatientRouter);
};

module.exports = routes;
