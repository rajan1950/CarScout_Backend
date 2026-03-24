const userSchema = require('../models/UserModel');
const { sendWelcomeEmail, sendResetPasswordEmail } = require('../utils/MailUtils');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;

const bcrypt = require('bcrypt');

const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
const STRONG_PASSWORD_MESSAGE = "Password must be at least 8 characters and include uppercase, lowercase, number, and special character";

//post method for user registration
const registerUser = async (req, res) => {
    try {

        const { firstname, lastname, email, password, role } = req.body;

        const existingUser = await userSchema.findOne({ email: email });
        if (existingUser) {
            return res.status(409).json({
                message: "Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const savedUser = await userSchema.create({
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: hashedPassword,
            role: role
        });

        // Send email in background so registration response is not delayed.
        sendWelcomeEmail(email, firstname).catch(() => { });

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

                // Generate JWT token with user ID and role
                const token = jwt.sign(
                    { id: foundUserFromEmail._id, role: foundUserFromEmail.role },
                    secret
                );

                res.status(200).json({
                    message: "login successful",

                    token: token,
                    role: foundUserFromEmail.role,
                    user: {
                        _id: foundUserFromEmail._id,
                        firstname: foundUserFromEmail.firstname,
                        lastname: foundUserFromEmail.lastname,
                        email: foundUserFromEmail.email,
                        role: foundUserFromEmail.role,
                        name: [foundUserFromEmail.firstname, foundUserFromEmail.lastname]
                            .filter(Boolean)
                            .join(" ")
                            .trim()
                    }
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

//get method for fetching user by ID
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

//put method for updating user details
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

//delete method for deleting user
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

const forgotpassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        const foundUserFromEmail = await userSchema.findOne({ email });
        if (!foundUserFromEmail) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const token = jwt.sign(
            { id: foundUserFromEmail._id, email: foundUserFromEmail.email, purpose: 'reset-password' },
            secret,
            { expiresIn: "15m" }
        );

        const url = `http://localhost:5173/resetpassword/${token}`;
        await sendResetPasswordEmail(foundUserFromEmail.email, url);

        return res.status(200).json({
            message: "Reset password link sent to email"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error while sending reset password link",
            error: error.message
        });
    }
};

const resetpassword = async (req, res) => {

    const { newpassword, token } = req.body;

    try {

        if (!token || !newpassword) {
            return res.status(400).json({
                message: "Token and new password are required"
            });
        }

        if (!STRONG_PASSWORD_REGEX.test(newpassword)) {
            return res.status(400).json({
                message: STRONG_PASSWORD_MESSAGE
            });
        }

        const decodedUser = jwt.verify(token, secret);

        if (decodedUser.purpose !== 'reset-password') {
            return res.status(401).json({
                message: "Invalid reset token"
            });
        }

        const userId = decodedUser.id || decodedUser._id;
        const hashedPassword = await bcrypt.hash(newpassword, 10);
        const auditEntry = {
            action: 'reset-password',
            changedAt: new Date(),
            ip: req.ip || '',
            userAgent: req.get('user-agent') || ''
        };

        const updatedUser = await userSchema.findByIdAndUpdate(
            userId,
            {
                $set: {
                    password: hashedPassword,
                    passwordChangedAt: new Date()
                },
                $push: {
                    passwordAuditLogs: auditEntry
                }
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        return res.status(200).json({
            message: "Password reset successful"
        });


    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: "Reset token has expired"
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                message: "Invalid reset token"
            });
        }

        return res.status(500).json({
            message: "Error while resetting password",
            error: error.message
        });
    }
}


module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    forgotpassword,
    resetpassword

};