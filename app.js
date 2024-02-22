const express = require("express");
const config = require("./config");
const constant = require("./constant");
const cors = require("cors");
const mongoose = require("mongoose")

const app = express();
const port = config.port;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => res.send(constant.message));

mongoose.connect(config.db_host) 
    .catch(err => { console.log(err) })
    .then(console.log("DB connected"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
