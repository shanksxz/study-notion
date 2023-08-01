const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const bcrypt = require("bcrypt");

//resetPasswordToken
exports.resetPasswordToken = async (req, res) => {


    try {

        const { email } = req.body;
        if (!email) {
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            })
        }

        const user = User.findOne({ email })
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User doesnt exist"
            });
        }

        //generate token    
        const token = crypto.randomUUID();

        //update user by adding token and exp time
        const updateDetails = await User.findOneAndUpdate(
            { email: email },
            {
                token: token,
                resetPasswordExpires: Date.now() + 5 * 60 * 1000
            },
            { new: true }
        )

        //create url
        const url = `https://localhost:3000/update-password/${token}`;

        //send mail
        await mailSender(email, "Password Reset Link", `Password Reset Link : ${url}`)

        //return response
        return res.json({
            success: true,
            message: "Email sent successfully"
        })

    } catch (error) {
        console.log("err in sending mail : ", error)
        return res.status(500).json({
            success: false,
            message: "couldnt able to send the mail"
        })
    }

}


//resetPassword
exports.resetPassword = async (req, res) => {

    try {

        //why extracting token from rew.body?
        const { password, confirmPassword, token } = req.body;

        if (!password || !confirmPassword) {
            return res.json({
                success: false,
                message: "password cannot be empty"
            })
        }

        if (password !== confirmPassword) {
            return res.json({
                success: false,
                message: "password doesnt match"
            });
        }


        //update password in db using token(to find user)
        const userDetails = await User.findOne({ token: token });

        //cant find user?
        if (!userDetails) {
            return res.json({
                success: false,
                message: "token is invalid"
            })
        }

        //token time check
        if (userDetails.resetPasswordExpires > Date.now()) {
            return res.json({
                success: false,
                message: "Token expires"
            })
        }


        //hash pass
        const hashedPassword = await bcrypt.hash(password, 10);

        //password update
        await User.findOneAndUpdate(
            { token: token },
            { password: hashedPassword },
            { new: true }
        )


        //return response
        return res.status(200).json({
            success:true,
            message:"Password reset successfully"
        })

    } catch (error) {
        console.log("err in reseting the pass  : ", error)
        return res.status(500).json({
            success: false,
            message: "couldnt able to reset the password"
        })
    }

}