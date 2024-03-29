const HomeDelivery = require('../models/delivery').HomeDelivery;


exports.createHomeDelivery = async (req, res) => {
  try {
    console.log("into function >>>>")
    const {
      address,
      contactNumber,
      medicines
    } = req.body;

    const newHomeDelivery = new HomeDelivery({
      patientId: req.user.patientId,
      address,
      contactNumber,
      medicines

    });
    console.log("hiii del data is :",newHomeDelivery);


    await newHomeDelivery.save();

    return res.status(201).json({ message: 'Home delivery request successfully added', data: newHomeDelivery });
  } catch (e) {
    return res.status(500).json({ message: 'Error in your home delivery request', error: e.message });
  }
};
