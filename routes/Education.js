const express = require('express');
const EducationController = require('../controllers/Education');
const EducationRouter = express.Router();

EducationRouter.get('/content', EducationController.getAllContent);
EducationRouter.post('/content', EducationController.createContent);
EducationRouter.put('/content/:id', EducationController.updateContent);
EducationRouter.delete('/content/:id', EducationController.deleteContent);
EducationRouter.delete('/content/search', EducationController.searchContent);
module.exports = EducationRouter;


