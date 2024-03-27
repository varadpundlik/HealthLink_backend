const Content = require('../models/Education');

const getAllContent = async (req, res) => {
  try {
    console.log('working ed api');
    const content = await Content.find();
    return res.status(200).json(content);
  } catch (e) {
    return res.status(500).send(e);
  }
};
const createContent = async (req, res) => {
  try {
    const newContent = new Content(req.body);
    await newContent.save();
    return res.status(201).json(newContent);
  } catch (e) {
    return res.status(500).send(e);
  }
};
const updateContent = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedContent = await Content.findByIdAndUpdate(id, req.body, { new: true });
    
    if (!updatedContent) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    return res.status(200).json(updatedContent);
  } catch (e) {
    return res.status(500).send(e);
  }
};
const deleteContent = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedContent = await Content.findByIdAndDelete(id);
    
    if (!deletedContent) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    return res.status(200).json({ message: 'Content deleted successfully' });
  } catch (e) {
    return res.status(500).send(e);
  }
};
const searchContent = async (req, res) => {
  try {
    const { keyword } = req.query;
    const content = await Content.find({
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
      ],
    });
    
    if (content.length === 0) {
      return res.status(404).json({ message: 'Content not found' });
    }
    
    return res.status(200).json(content);
  } catch (e) {
    return res.status(500).send(e);
  }
};

module.exports = { getAllContent,createContent,updateContent,deleteContent,searchContent };
