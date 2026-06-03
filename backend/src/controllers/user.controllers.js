import User from "../models/user.model.js";
import express from "express"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const generateAccessTokenAndRefreshToken = async (userId) => {

       try {
         const user = await User.findById(userId).select("+refreshToken")
 
         const accessToken = await user.generateAccessToken()
 
         const refreshToken = await user.generateRefreshToken()
 
          user.refreshToken = refreshToken
         
          await user.save({validateBeforeSave : false})
 
         return {accessToken,refreshToken}
       } catch (error) {
             console.log("TOKEN ERROR:", error);
            throw new ApiError(401, error?.message || "Error when generating token");
       }

}

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

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and Password are required");
    }

    const user = await User.findOne({ email }).select("+password +refreshToken");

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Incorrect Password");
    }

    const { refreshToken, accessToken } = await generateAccessTokenAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true,
    };
    
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                "User Logged In"
            )
        );
});


const logoutUser = asyncHandler(async(req,res) =>{

    User.findByIdAndUpdate(req.user._id,
        {
            $set : {refreshToken : undefined}
        },
        {
            new : true
        }
    )

    const option = {
        httpOnly : true,
        secure : true
    }

    res.status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json(
        new ApiResponse(
            200,{}, "User Logged Out"
        )
    )

})

export  {registerUser, loginUser, logoutUser}