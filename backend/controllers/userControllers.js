import {User} from '../models/User.js';
import jwt from 'jsonwebtoken';
import sendMail from '../middlewares/sendMail.js';

// one controller for login
// one for signup
// one for getting otp on emails via nodemailer

export const loginUser = async(req,res) => {
    try{
        const {username , email} = req.body;

        let user = await User.findOne({email});

        // check if user already exists or not, if not then create new user and send otp to email for verification. If user already exists then also send otp to email for verification. This is because we are using same login form for both login and signup.

        

        if(!user)
        {
            user =  await User.create({
                username,
                email,
            });

        }

        const otp = Math.floor(Math.random() * 1000000);
        const verifyToken = jwt.sign({user ,  otp}, process.env.Activation_sec, {expiresIn : "5m"});

        await sendMail(email, "Lumina - OTP for account verification", otp);

        res.json({
            message : "OTP sent to your email successfully.",
            verifyToken,
        });
    }
    catch(error)
    {
        res.status(500).json({
            message : error.message,
        });
    }

}

// verifyToken controller

export const verifyUser = async(req,res) =>
{
    try{
        const {otp, verifyToken} = req.body;

        const verify = jwt.verify(verifyToken, process.env.Activation_sec);

        if(!verify) return res.status(400).json({
            message : "OTP Expired. Please try again.",
        });

        if(verify.otp != otp) return res.status(400).json({
            message : "Invalid OTP. Please try again.",
        });


        const token = jwt.sign({_id: verify.user._id}, process.env.Jwt_sec, {expiresIn : "7d"});

        res.json({
            message : "Logged in successfully.",
            user: verify.user,
            token,
        });

    }
    catch(error)
    {
        res.status(500).json({
            message: error.message,
        });
    }
}

export const myProfile = async(req,res) =>
{
    try{
        const user = await User.findById(req.user._id);

        res.json(user);
    }
    catch(error)
    {
        res.status(500).json({
            message : error.message,
        });
    }
}