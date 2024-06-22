const express = require('express')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const app = express();
const bcrypt = require('bcrypt')
const User = require('../models/users')
dotenv.config();
app.use(cors());
app.use(express.json({ limit: '750mb' }));
const saltRounds = 10;


//function for sendmail script
const sendMail = async (email, token, type) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL,
            pass: process.env.MAIL_PASSWORD
        },
    });
    let message = '';
    let subject = ''

    if (type === "verify") {
        message = `Please click the following link to verify your email http://localhost:3001/verify/${token}`;
        subject = "Verify Your Email"
    }
    if (type === "reset-password") {
        message = `Please click the following link to reset your password http://localhost:3001/reset-password/${token}`;
        subject = "Reset Password"
    }
    
    const mailOptions = {
        from: process.env.MAIL,
        to: email,
        subject: subject,
        text: message
    }
    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log("An errror while sending mail: ", error);
    }
}


//register script
exports.register = async (req, res) => {
    try {
        const { username, fullName, birthday, email, password, pp } = req.body;
        const existingUsername = await User.findOne({username});
        const existingEmail = await User.findOne({email});
        if(existingUsername || existingEmail) {
            return res.status(400).json({ status: "fail", message: "Username or email already register!" })
        };
        const user = new User({
            username,
            fullName,
            birthday,
            email,
            password: await bcrypt.hash(password, saltRounds),
            vertificatonToken: crypto.randomBytes(20).toString("hex"),
            pp
        });
        await user.save();
        sendMail(req.body.email, user.vertificatonToken, "verify")
        res.status(201).json({ status: "success", message: "User created successfully!"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({status: "fail", message: "User can't registering!"})
    }
}

//vertification mail script
exports.verificationMail = async (req, res) => {
    try {
        const { verificationToken } = req.params;
        const user = await User.findOne( {vertificatonToken: verificationToken } );
        user.verified = true;
        user.vertificatonToken = crypto.randomBytes(20).toString("hex")
        await user.save()

        res.status(200).json({ status: "success", message: "Verification success!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "fail", message: "Verification failed!" });
    }
}

//login script
exports.login = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await User.findOne({ email, username });
        if (!user) return res.status(404).json({ status: "fail", message: "User not found!" });

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(401).json({ status: "fail", message: "Forgot your password?" });

        const token = jwt.sign(
            { id: user._id, username: user.username, fullName: user.fullName, email: user.email, pp: user.pp },
            process.env.secretKey,
            { expiresIn: '1d' }
        );
        return res.status(200).json({ token });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "fail", message: "An error occurred while logging in your account!" });
    }
}

//get user by id script
exports.getMe = async (req, res) => {
    try {
        const {userId} = req.params;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ status: "fail", message: "User not found!"});
        return res.status(200).json({user});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "fail", message: "An error occurred get user"});
    }
}

//edit user script
exports.editUser = async (req, res) => {
    try {
        const { username, fullName, birthday, email, password, pp } = req.body;
        const userId = req.params;
        const existingUsername = await User.findOne({username});
        const existingEmail = await User.findOne({email});
        if(existingUsername || existingEmail) {
            return res.status(400).json({ status: "fail", message: "Username or email already register!" })
        };
        const user = await User.findByIdAndUpdate(userId, {
            username,
            fullName,
            birthday,
            email,
            password: await bcrypt.hash(password, saltRounds),
            vertificatonToken: crypto.randomBytes(20).toString("hex"),
            pp
        });
        await user.save();
        return res.status(200).json({ status: "success", message: "User updated successfully"});
    } catch (error) {
        return res.status(500).json({status: "fail", message: "User can't editing user!"})
    }
}

// send reset password link script
exports.sendResetPasswordLink = async (req, res) => {
    try {
        const vertificatonToken = req.params;
        const user = await User.findOne(vertificatonToken);
        sendMail(user.email, user.vertificatonToken, "reset-password");
        return res.status(200).json({ status: "success", message: "Reset password link sending your email "});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "fail", message: "An error occurred sending reset password link your mail"});
    }
}

// update password script
exports.updatePassword = async (req, res) => {
    try {
        const token = req.params;
        const { password } = req.body;
        const user = await User.findOneAndUpdate({ vertificatonToken: token },
            { 
                password: await bcrypt.hash(password, saltRounds),
                vertificatonToken: crypto.randomBytes(20).toString("hex")
             },
        );
        await user.save();
        return res.status(200).json({ status: "success", message: "Password updated successfully"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "fail", message: "An error occurred updating password"});
    }
}

//delete user script
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params;
        await User.findByIdAndRemove(userId);
        return res.status(200).json({ status: "success", message: "User deleted successfully"})

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "fail", message: "An error occurred deleting your Account"});
    }
}