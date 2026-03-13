const Inquiry = require("../models/InquiryModel");

const createInquiry = async (req,res)=>{
  try{
    const inquiry = await Inquiry.create(req.body);
    res.status(201).json(inquiry);
  }catch(error){
    res.status(500).json(error);
  }
};

const getAllInquiry = async(req,res)=>{
  try{
    const inquiry = await Inquiry.find();
    res.json(inquiry);
  }catch(error){
    res.status(500).json(error);
  }
};

const getInquiryById = async(req,res)=>{
  try{
    const inquiry = await Inquiry.findById(req.params.id);
    res.json(inquiry);
  }catch(error){
    res.status(500).json(error);
  }
};

const updateInquiry = async(req,res)=>{
  try{
    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id,req.body,{new:true});
    res.json(inquiry);
  }catch(error){
    res.status(500).json(error);
  }
};

const deleteInquiry = async(req,res)=>{
  try{
    await Inquiry.findByIdAndDelete(req.params.id);
    res.json({message:"Deleted"});
  }catch(error){
    res.status(500).json(error);
  }
};

module.exports={
createInquiry,
getAllInquiry,
getInquiryById,
updateInquiry,
deleteInquiry
};