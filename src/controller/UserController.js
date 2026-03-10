const userSchema = require('../models/UserModel');

const bcrypt = require('bcrypt');

//post method for user registration
const registerUser = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const savedUser = await userSchema.create({ ...req.body, password: hashedPassword });
        res.status(201).json({
            message: "User registered successfully",
            user: savedUser
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
//get method for fetching all users
const getAllUsers = async (req, res) => {
    try {
        const users = await userSchema.find();
        res.status(200).json({
            message: "Users fetched successfully",
            users
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await userSchema.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            message: "User fetched successfully",
            user
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const updatedUser = await userSchema.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            message: "User updated successfully",
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const deletedUser = await userSchema.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            message: "User deleted successfully",
            user: deletedUser
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};