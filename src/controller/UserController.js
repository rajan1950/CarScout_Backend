const userSchema = require('../models/UserModel');
const mailsend = require('../utils/MailUtils');

const bcrypt = require('bcrypt');

//post method for user registration
const registerUser = async (req, res) => {
  try {

    const { firstname, lastname, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const savedUser = await userSchema.create({
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: hashedPassword
    });

    // send welcome email
    await mailsend.sendWelcomeEmail(savedUser.email, savedUser.firstname);

    return res.status(201).json({
      message: "User registered successfully",
      user: savedUser
      
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const foundUserFromEmail = await userSchema.findOne({ email: email });
        console.log(foundUserFromEmail);

        if (foundUserFromEmail) {
            const isPasswordMatch = await bcrypt.compare(password, foundUserFromEmail.password);

            if (isPasswordMatch) {
                res.status(200).json({
                    message: "login successful",
                    data: foundUserFromEmail,
                    role: foundUserFromEmail.role
                });
            } else {
                res.status(401).json({
                    message: "invalid credentials"
                });
            }
        } else {
            res.status(404).json({
                message: "user not found"
            });
        }

    } catch (err) {
        res.status(500).json({
            message: "error while logging in",
            error: err.message
        });
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
    loginUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
};