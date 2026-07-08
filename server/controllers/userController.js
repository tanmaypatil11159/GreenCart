// Register User : api/user/register

import User from "../models/User.js";
import bcrypt, { truncates } from "bcryptjs"
import jwt from "jsonwebtoken"

const getCookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
});

// user registeration, path: /api/user/register
export const register = async (req, res)=>{
    try {
        const {name, email, password} = req.body;

        if(!name || !email || !password) {
            return res.json({success: false, message: 'Messing Details'})
        }

        const existingUser = await User.findOne({email});

        if(existingUser) {
            return res.json({success: false, message: 'User already exist'})
        }

        const hashedPassword = await bcrypt.hash(password,10)

        // this is brand new newuser
        const user = await User.create({name, email, password: hashedPassword})
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'})

        res.cookie('token', token, getCookieOptions())
        return res.json({success: true, user: {name: user.name, email: user.email }})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}

// user login, path: /api/user/login

export const login = async (req,res)=> {
    try {
        const {email, password} = req.body;
        if(!email || !password) 
            return res.json({success:false, message:"Email and Password are required!"})
        
        const user = await User.findOne({email})

        if(!user)
            return res.json({success:false, message:"Invalid email or password"})

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch) 
            return res.json({success: false, message: "Invalid email or password"})

                const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'})

        res.cookie('token', token, getCookieOptions())
        return res.json({success: true, user: {name: user.name, email: user.email }})


    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message});
    }
}


// user authentication, path: /api/user/is-auth
export const isAuth = async (req, res)=> {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).select("-password")
        return res.json({success: true, user})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// logout user, path: /api/user/logout

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', getCookieOptions())
        return res.json({success: true, message: "Logged Out"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}
