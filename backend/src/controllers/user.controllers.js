import User from "../models/user.model.js";
import express from "express"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async(req,res)=> {

    const {username, fullname, email, password} = req.body

     if([fullname,username,email,password].some((field) => !field || field.trim() == "" )) {
        throw new ApiError(401, "All fields are required")
     }
     

    const existedUser = await User.findOne({
        $or : [{username}, {email}]
    })

    if(existedUser){
        throw new ApiError(401, "User Already Exists")
    }

    const user = await User.create({
        fullname,
        username : username.toLowerCase(),
        password,
        email

    })

    const sentUser = await User.findById(user._id).select("-password -refreshToken")
    
    return res.status(200).json(
        new ApiResponse(200, sentUser, "User is Registered")
    )
})

export  {registerUser}