const express = require('express');
const DeliveryController = require('../controllers/delivery');
const DeliveryRouter = express.Router();
const validateToken = require("../middleware/validateTokenhandler");

DeliveryRouter.post('/home-delivery',validateToken,DeliveryController.createHomeDelivery);
module.exports = DeliveryRouter;
