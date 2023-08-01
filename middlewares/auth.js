const User = require('../models/User');
const jwt = require('jsonwebtoken');
require("dotenv").comfig();


//auth
exports.auth = async (req, res, next) => {
    try {

        //get token
        const { token } = req.body || req.cookies.token || req.header("Authorization").replace("Bearer ", "");

        //token missing?
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token is missing"
            });
        }

        //verify token?
        try {
            const decode = await jwt.verify(token, process.env.JWT_SECRET);
            console.log("decoded token : ", decode);
            req.user = decode //why this
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Token is invalid"
            });
        }

        next()

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "error in token validation"
        });
    }
}


//isStudent
exports.isStudent = (req,res,next) =>{
    try {
        if(req.user.role !== "Student"){
            return res.status(401).json({
                success:false,
                message:"This is a protected routes for student"
            })
        }
        next()
    } catch (error) {
        return res.status(501).json({
            success:false,
            message:"user accountType is not matching"
        })
    }
}


//isInstructor
exports.isInstructor = (req,res,next) =>{
    try {
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is a protected routes for instructor"
            })
        }
        next()
    } catch (error) {
        return res.status(501).json({
            success:false,
            message:"user accountType is not matching"
        })
    }
}


//isAdmin
exports.isAdmin = (req,res,next) =>{
    try {
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a protected routes for admin"
            })
        }
        next()
    } catch (error) {
        return res.status(501).json({
            success:false,
            message:"user accountType is not matching"
        })
    }
}



