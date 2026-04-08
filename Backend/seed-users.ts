import mongoose from "mongoose"
import dotenv from "dotenv"
import path from "path"
import bcrypt from "bcryptjs"
import User from "./Models/userModel.js"
import usersData from "./data/users.js"

dotenv.config({ path: path.resolve(process.cwd(), "Backend/.env") })

const MONGO_URI = process.env.MONGO_URI || ""

async function seedUsers() {
  try {
    console.log("Connecting to MongoDB...")
    await mongoose.connect(MONGO_URI)
    
    console.log("🔥 STEP 1: Clearing existing users...")
    await User.deleteMany({})
    
    console.log(`👤 STEP 2: Seeding ${usersData.length} users...`)
    
    for (const u of usersData) {
      console.log(`Processing ${u.name}...`)
      const hashedPassword = await bcrypt.hash(u.password, 10)
      
      await User.create({
        ...u,
        password: hashedPassword
      })
    }
    
    console.log("✅ SUCCESS: All users seeded!")
    process.exit()
  } catch (error) {
    console.error("❌ ERROR: User seeding failed!")
    console.error(error)
    process.exit(1)
  }
}

seedUsers()
