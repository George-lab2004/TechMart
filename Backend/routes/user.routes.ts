import { Router } from "express"
import { signIn, signUp, logOut, getUserProfile, updateUserProfile, deleteUser, getAllUsers, updateUserByAdmin, addUserAddress, forgetPassword, verifyOTP, resetPassword } from "../controller/userController.js"
import { protect, admin } from "../Middleware/authMiddleware.js"

export const userRouter = Router()

userRouter.post("/signUp", signUp)
userRouter.post("/signIn", signIn)
userRouter.post("/logout", logOut)
userRouter.post("/forgetPassword", forgetPassword)
userRouter.post("/verifyOtp", verifyOTP)
userRouter.post("/resetPassword", resetPassword)

userRouter.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile)

userRouter.route('/profile/address')
    .post(protect, addUserAddress)

userRouter.route('/allUsers')
    .get(protect, admin, getAllUsers)

userRouter.route('/:id')
    .put(protect, admin, updateUserByAdmin)
    .delete(protect, admin, deleteUser)

