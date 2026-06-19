import User from "../models/user.model.js";
import express from "express"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

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

const getCurrentUser = asyncHandler(async (req,res) =>{
    const user = await User.findById(req.user._id).select("-password -refreshToken")

    if(!user) {
        throw new ApiError(401, "User not found")   
    }

    return res.status(200).json(new ApiResponse(200, user , "Current user fetched successfully"))
} )

const logoutUser = asyncHandler(async(req,res) =>{

    await User.findByIdAndUpdate(req.user._id,
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


const refreshAccessToken = asyncHandler(async(req,res) =>{

        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

        if(!incomingRefreshToken){
            throw new ApiError(401, "Unauthorized Request")
        }

        try {
            const decodedToken = jwt.verify( incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

            const user = await User.findById(decodedToken?._id)

            if(!user) 
            {
                throw new ApiError(401, "Invalid Refresh Token")
            }

            if(incomingRefreshToken !== user?.refreshToken)
            {
                throw new ApiError(401, "Refresh Token is Expirerd")    
            }
            
            const options = {
                httpOnly : true,
                secure : true
            }

            const {accessToken, refreshToken : newRefreshToken} = await generateAccessTokenAndRefreshToken(user._id)

            return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(201,
                    {
                        accessToken, refreshToken : newRefreshToken
                    },
                    "Access Token Refreshed"
                )
            )
        } catch (error) {
            throw new ApiError(401, error?.message ||  "Invalid Refresh Token")
        }

  } 
    
  )

const updateUserProfile = asyncHandler(async (req, res) => {
    const { fullname, phone, bio, university, faculty, semester, skills } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (fullname !== undefined) {
        if (fullname.trim().length < 2) {
            throw new ApiError(400, "Fullname must be at least 2 characters");
        }
        user.fullname = fullname.trim();
    }
    if (phone !== undefined) user.phone = phone.trim();
    if (bio !== undefined) user.bio = bio.trim();
    if (university !== undefined) user.university = university.trim();
    if (faculty !== undefined) user.faculty = faculty.trim();
    
    if (semester !== undefined) {
        const parsedSemester = Number(semester);
        if (Number.isNaN(parsedSemester) || parsedSemester < 1 || parsedSemester > 12) {
            throw new ApiError(400, "Semester must be a number between 1 and 12");
        }
        user.semester = parsedSemester;
    }
    
    if (skills !== undefined) {
        if (Array.isArray(skills)) {
            user.skills = skills.map(skill => skill.trim()).filter(Boolean);
        } else if (typeof skills === "string") {
            user.skills = skills.split(",").map(skill => skill.trim()).filter(Boolean);
        }
    }

    await user.save();

    const updatedUser = await User.findById(user._id).select("-password -refreshToken");

    return res.status(200).json(
        new ApiResponse(200, updatedUser, "Profile updated successfully")
    );
});

export  {registerUser, loginUser, logoutUser, refreshAccessToken, getCurrentUser, updateUserProfile}