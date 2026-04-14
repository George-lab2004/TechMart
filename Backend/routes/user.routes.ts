import { Router } from "express"
import { signIn, signUp, logOut, getUserProfile, updateUserProfile, deleteUser, getAllUsers, updateUserByAdmin, addUserAddress, updateUserAddress, deleteUserAddress, forgetPassword, verifyOTP, resetPassword, verifyEmail } from "../controller/userController.js"
import { protect, admin } from "../Middleware/authMiddleware.js"
import { demoGuard } from "../Middleware/demoMiddleware.js"
import { validate } from "../Middleware/validate.js"
import { registerSchema, loginSchema, updateProfileSchema, forgetPasswordSchema, verifyOtpSchema, resetPasswordSchema } from "../validators/user.schema.js"
import { authLimiter } from "../Middleware/Limiter.js"

export const userRouter = Router()

userRouter.get("/verify-email/:email", verifyEmail)
userRouter.post("/signUp", authLimiter, validate(registerSchema), signUp)
userRouter.post("/signIn", authLimiter, validate(loginSchema), signIn)
userRouter.post("/logout", logOut)
userRouter.post("/forgetPassword", authLimiter, validate(forgetPasswordSchema), forgetPassword)
userRouter.post("/verifyOtp", authLimiter, validate(verifyOtpSchema), verifyOTP)
userRouter.post("/resetPassword", authLimiter, validate(resetPasswordSchema), resetPassword)

userRouter.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, demoGuard, validate(updateProfileSchema), updateUserProfile)

userRouter.route('/profile/address')
    .post(protect, demoGuard, addUserAddress)
    .put(protect, demoGuard, updateUserAddress)

userRouter.route('/profile/address/:addressId')
    .delete(protect, demoGuard, deleteUserAddress)

userRouter.route('/allUsers')
    .get(protect, admin, getAllUsers)

userRouter.route('/:id')
    .put(protect, admin, demoGuard, updateUserByAdmin)
    .delete(protect, admin, demoGuard, deleteUser)
