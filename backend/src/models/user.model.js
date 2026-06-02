import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
    {
        username :{
            type : String,
            required : true,
        },

        fullname: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false,
        },

        phone: {
            type: String,
            trim: true,
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },

       
        avatar: {
            type: String,       
            default: null,
        },

        bio: {
            type: String,
            maxlength: 300,
            default: "",
        },

        university: {
            type: String,         
            trim: true,
        },

        faculty: {
            type: String,        
            trim: true,
        },

        semester: {
            type: Number,
            min: 1,
            max: 12,
        },

        skills: [
            {
                type: String,    
                trim: true,
            }
        ],

        //verification if user is student or not
        isVerified: {
            type: Boolean,
            default: false,
        },

        verificationStatus: {
            type: String,
            enum: ["unsubmitted", "pending", "approved", "rejected"],
            default: "unsubmitted",
        },

        studentIdCardUrl: {
            type: String,        
            default: null,
        },

        verifiedAt: {
            type: Date,
            default: null,
        },

        verifiedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",          // admin who approved/rejected
            default: null,
        },

        rejectionReason: {
            type: String,         // shown to user if rejected
            default: null,
        },

       
        walletBalance: {
            type: Number,
            default: 0,
            min: 0,
        },

      
        averageRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },

        totalRatings: {
            type: Number,
            default: 0,
        },

      
        refreshToken: {
            type: String,
            select: false,     
        },

        emailVerificationToken: {
            type: String,
            select: false,
        },

        emailVerificationExpiry: {
            type: Date,
            select: false,
        },

        passwordResetToken: {
            type: String,
            select: false,
        },

        passwordResetExpiry: {
            type: Date,
            select: false,
        },

        isEmailVerified: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);




userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); 
    this.password = await bcrypt.hash(this.password, 10);
  
});



userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { 
          _id: this._id, 
          role: this.role 
        },   
        process.env.ACCESS_TOKEN_SECRET,
        { 
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY 
        }
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { 
            _id: this._id 
        },
        process.env.REFRESH_TOKEN_SECRET,
        { 
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY 
        }
    );
};


userSchema.methods.updateRating = function (newRating) {
    const total = this.averageRating * this.totalRatings + newRating;
    this.totalRatings += 1;
    this.averageRating = +(total / this.totalRatings).toFixed(2);
};


const User = mongoose.model("User", userSchema);
export default User;