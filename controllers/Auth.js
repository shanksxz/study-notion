const User = require('../models/User');
const Profile = require('../models/Profile');
const OTP = require('../models/OTP');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
require("dotenv").config();

//sendOTP
exports.sendOTP = async (req, res) => {

    try {

        //fetching email from req body
        const { email } = req.body;

        //check if user aalready exist
        const checkUserPresent = await User.findOne({ email });

        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: "User Already Exist"
            });
        }

        //generate
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        console.log("OTP GENERATED : ", otp);

        //check unique otp or not? //bakwas logic f
        const result = await OTP.findOne({ otp: otp });
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
        }

        const otpPayload = { email, otp };

        //create an entry in db
        const otpBody = await OTP.create(otpPayload);
        console.log("otp entry : ", otpBody);


        //return response
        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            otp,
        })

    } catch (error) {

        console.log("error in sending otp", error);
        return res.status(500).json({
            success: false,
            message: "Cannot Send Otp at an moment"
        })

    }
}
//signUp

exports.signUp = async (res, res) => {
    try {

        const { firstName, lastName, email, password, confirmPassword, accountType, contactNumber, otp } = req.body;


        //authentication
        if (!firstName || !lastName || !email || !password || !confirmPassword || !contactNumber || !otp) {
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            })
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "password and confirmpassword does not match"
            })
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "user is already present"
            })
        }

        //most recent otp stored - otp validation
        const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        console.log("recent otp : ", recentOtp);

        //validating recent and input otp
        if (recentOtp.length === 0) {
            //otp not founnd
            res.status(400).json({
                success: false,
                message: "otp not found in db"
            })
        }
        else if (otp !== recentOtp.otp) {
            //invalid otp
            res.status(400).json({
                success: false,
                message: "invalid otp"
            })
        }


        //hash password
        let hashedpass = await bcrypt.hash(password, 10);


        //creating an profile to pass
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null
        })

        //create entry
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedpass,
            accountType,
            contactNumber,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstname}${lastName}`
        })

        res.status(200).json({
            success: true,
            messsage: "user created successfully"
        })


    } catch (error) {
        console.log("err in signup", err);
        return res.status(500).json({
            success: false,
            message: "Cannot Signup At this moment try again later"
        })
    }
}



//Login
exports.Login = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            //empty
            return res.status(403).json({
                success: false,
                message: "All fields are required"
            })
        }

        const user = await User.findOne({ email });

        if (!userExist) {
            //user not exist lol
            return res.status(403).json({
                success: false,
                message: "user doesnt exist"
            })
        }



        //verify password
        if (await bcrypt.compare(password, user.password)) {
            //payload
            const payload = {
                email: user.email,
                id: user._id,
                role: user.accountType
            }
            // password match
            let token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h"
            })
            userExist = user.toObject();
            userExist.token = token;
            userExist.password = undefined;

            //create cookie and send resposne

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 100),
                httpOnly: true
            }

            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                userExist,
                message: "Successfully Logged in"
            })

        }

        else {
            return res.status(401).json({
                success: false,
                message: "password is incorrect"
            })
        }
    


    } catch (error) {
    console.log("err in login", err);
    return res.status(500).json({
        success: false,
        message: "Cannot login At this moment try again later"
    })
}
}

//changePassword
exports.changePassword = async (req,res) => {
    const {oldPassword, newPassword, confirmPassword} = req.body

    //validation
    if(email){
        //empty
    }

    const user = User.findOne({email});
    if(!user){
        //user not found
    }

    //match new and confirm pass
    if(confirmPassword !== newPassword){

    }

    //check if password is not as the previous one
    if(user.password = newPassword){

    }

    user.password = newPassword;




}

