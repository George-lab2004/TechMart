import { Request, Response, NextFunction } from "express"
import { asyncHandler } from "../Middleware/asyncHandler.js"
import User from "../Models/userModel.js"
import bcrypt from "bcryptjs"
import { sendEmail, sendResetPasswordEmail } from "../emails/email.js"
import jwt from "jsonwebtoken"

const signUp = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password } = req.body

    const hashedPassword = await bcrypt.hash(password, 8)

    const user = await User.create({
        name,
        email,
        password: hashedPassword // ✅ FIX
    })

    sendEmail(email, name).catch((error) => {
        console.error("sendEmail failed:", error?.message || error)
    })

    res.status(201).json({ message: "SUCCESS", user })
})

const signIn = async (req: Request, res: Response) => {
    const { email, password } = req.body

    // 1. check fields exist
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" })
    }

    // 2. find user
    const user = await User.findOne({ email }).lean()
    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" })
    }

    // 3. check password FIRST before doing anything else
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        return res.status(401).json({ message: "Invalid email or password" })
    }

    // 4. only reach here if password is correct — sign token
    const token = jwt.sign(
        { userId: user._id, name: user.name, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: "1d" }
    )

    // 5. set cookie
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
    })

    // 6. send response — one single res.json, not two
    return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token
    })
}

const logOut = asyncHandler(async (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0)
    })
    res.status(200).json({ message: "Logged out successfully" })
})

const getUserProfile = asyncHandler(async (req, res) => {
    // req.user is populated by protect middleware
    if (req.user) {
        res.status(200).json({
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            isAdmin: req.user.isAdmin
        })
    } else {
        res.status(404)
        throw new Error("User not found")
    }
})

const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user?._id)

    if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        if (req.body.password) {
            user.password = await bcrypt.hash(req.body.password, 8)
        }

        const updatedUser = await user.save()

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        })
    } else {
        res.status(404)
        throw new Error("User not found")
    }
})

const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)

    if (user) {
        if (user.isAdmin) {
            res.status(400)
            throw new Error("Cannot delete admin user")
        }
        await User.deleteOne({ _id: user._id })
        res.status(200).json({ message: "User deleted successfully" })
    } else {
        res.status(404)
        throw new Error("User not found")
    }
})
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password')
    res.status(200).json(users)
})

const updateUserByAdmin = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)

    if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.isAdmin = req.body.isAdmin !== undefined ? req.body.isAdmin : user.isAdmin

        const updatedUser = await user.save()

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        })
    } else {
        res.status(404)
        throw new Error("User not found")
    }
})

const addUserAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user?._id)

    if (user) {
        const { streetNumber, buildingNumber, floorNumber, apartmentNumber, city, country, landmark, notes, postalCode, phone } = req.body

        const newAddress = {
            address: [{
                streetNumber,
                buildingNumber,
                floorNumber,
                apartmentNumber,
                city,
                country,
                landmark,
                notes,
                postalCode
            }],
            phone
        }

        user.delivery.push(newAddress)
        await user.save()

        res.status(201).json({ message: "Address added successfully", delivery: user.delivery })
    } else {
        res.status(404)
        throw new Error("User not found")
    }
})
const forgetPassword = asyncHandler(async (req, res) => {
    const { email } = req.body
    console.log("HIT forgetPassword for email:", email);
    const user = await User.findOne({ email })
    if (!user) {
        res.status(404)
        throw new Error("User not found")
    }
    const otp = Math.floor(1000 + Math.random() * 9000).toString()
    user.resetPasswordOTP = otp
    user.resetPasswordOTPExpiry = new Date(Date.now() + 10 * 60 * 1000)
    await user.save()

    sendResetPasswordEmail(email, user.name, otp).catch((error) => {
        console.error("sendResetPasswordEmail failed:", error?.message || error)
    })
    res.status(200).json({ message: "OTP sent successfully" })
})

const verifyOTP = asyncHandler(async (req, res) => {
    const { email, otp } = req.body
    console.log("Verifying OTP for:", email, "Received OTP:", otp);

    const user = await User.findOne({ email })
    if (!user) {
        console.log("User not found for email:", email)
        res.status(404)
        throw new Error("User not found")
    }

    console.log("Stored OTP:", user.resetPasswordOTP, "Stored Expiry:", user.resetPasswordOTPExpiry);

    if (user.resetPasswordOTP !== otp || !user.resetPasswordOTPExpiry || user.resetPasswordOTPExpiry < new Date()) {
        console.log("OTP mismatch or expired");
        res.status(400)
        throw new Error("Invalid or expired OTP")
    }

    res.status(200).json({ message: "OTP verified correctly" })
})

const resetPassword = asyncHandler(async (req, res) => {
    const { email, otp, newPassword } = req.body
    const user = await User.findOne({ 
        email, 
        resetPasswordOTP: otp,
        resetPasswordOTPExpiry: { $gt: Date.now() } 
    })

    if (!user) {
        res.status(400)
        throw new Error("Invalid or expired OTP")
    }

    const hashedPassword = await bcrypt.hash(newPassword, 8)
    user.password = hashedPassword
    user.resetPasswordOTP = undefined
    user.resetPasswordOTPExpiry = undefined
    
    await user.save()

    res.status(200).json({ message: "Password reset successful" })
})

export {
    signUp,
    signIn,
    logOut,
    getUserProfile,
    updateUserProfile,
    deleteUser,
    getAllUsers,
    updateUserByAdmin,
    addUserAddress,
    forgetPassword,
    verifyOTP,
    resetPassword
}

