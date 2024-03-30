const Patient = require("../models/patient");

const axios = require('axios');

function average(arr) {
  if (!arr.length) {
    return 0;
  }
  return arr.reduce((sum, val) => sum + val, 0) / arr.length;
}

function calculateEngagementScore(
  medicationDuration, 
  stepsWalked, 
  caloriesBurned, 
  sleepDuration, 
  waterIntake, 
  step, 
  sleep, 
  water, 
  calories
) {
  let stepsArray = [];
  let sleepArray = [];
  let waterArray = [];
  let caloriesArray = [];
  let medicationArray = [];
  
  let n = stepsWalked.length;
  let cnt = 0;
  let score = 0;
  
  for (let i = 0; i < n; i++) {
    if (cnt < 7) {
      cnt = 1;
      let temp = score / 7;
      medicationArray.push(temp);
      score = 0;
      
      if (medicationDuration[i]) {
        score++;
      }
    } else {
      if (medicationDuration[i]) {
        score++;
      }
    }
    
    cnt++;
  }
  
  for (let i = 0; i < n; i++) {
    let stepsRate = 100;
    let sleepRate = 100;
    let waterRate = 100;
    let caloriesRate = 100;
    
    if (stepsWalked[i] === step) {
      stepsRate = 1;
    } else {
      stepsRate = Math.abs(stepsWalked[i] - step) / step;
    }
    
    if (caloriesBurned[i] === calories) {
      caloriesRate = 1;
    } else {
      caloriesRate = Math.abs(caloriesBurned[i] - calories) / calories;
    }
    
    if (sleepDuration[i] === sleep) {
      sleepRate = 1;
    } else {
      sleepRate = Math.abs(sleepDuration[i] - sleep) / sleep;
    }
    
    if (waterIntake[i] === water) {
      waterRate = 1;
    } else {
      waterRate = Math.abs(waterIntake[i] - water) / water;
    }
    
    stepsArray.push(stepsRate);
    sleepArray.push(sleepRate);
    waterArray.push(waterRate);
    caloriesArray.push(caloriesRate);
  }
  
  const stepsAvg = average(stepsArray);
  const sleepAvg = average(sleepArray);
  const waterAvg = average(waterArray);
  const caloriesAvg = average(caloriesArray);
  const medicationAvg = average(medicationArray);
  
  const engagementScore = ((stepsAvg + sleepAvg + waterAvg + caloriesAvg + medicationAvg) / 5) * 10;
  
  return engagementScore;
}

const getEngagementScore = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).send("Patient not found");
    }
    
    let medicines = [];
    let water = [];
    let sleep = [];
    let steps = [];
    let calories = [];
    
    patient.analytics.forEach((element) => {
      if(element.medicineTaken != undefined )medicines.push(element.medicineTaken);
      else medicines.push(false);
      water.push(element.waterIntake);
      sleep.push(element.sleepDuration);
      steps.push(element.stepsWalked);
      calories.push(element.caloriesIntake);
    });
    
    const data = {
      medicineDuration: medicines,  // Corrected the property name
      stepsArray: steps,
      sleepArray: sleep,
      waterArray: water,
      caloriesArray: calories,
      stepthreshold: patient.analytics_thresholds.steps,
      sleepthreshold: patient.analytics_thresholds.sleep,
      watersthreshold: patient.analytics_thresholds.water,
      caloriessthreshold: patient.analytics_thresholds.calories
    };
    
    const response = calculateEngagementScore(
      data.medicineDuration,
      data.stepsArray,
      data.caloriesArray,
      data.sleepArray,
      data.waterArray,
      data.stepthreshold,
      data.sleepthreshold,
      data.watersthreshold,
      data.caloriessthreshold
    );
    
    res.status(200).send({ engagementScore: response });  // Corrected the response format

  } catch (error) {
    console.error(error.message);
    res.status(500).send(error.message);
  }
};

module.exports = { getEngagementScore };
