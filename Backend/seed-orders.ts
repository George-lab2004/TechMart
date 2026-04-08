import mongoose from "mongoose"
import dotenv from "dotenv"
import path from "path"
import User from "./Models/userModel.js"
import Product from "./Models/productModel.js"
import Order from "./Models/ordersModel.js"

dotenv.config({ path: path.resolve(process.cwd(), "Backend/.env") })

const MONGO_URI = process.env.MONGO_URI || ""

async function seedOrders() {
  try {
    console.log("Connecting to MongoDB...")
    await mongoose.connect(MONGO_URI)
    
    console.log("🗑️  STEP 1: Clearing existing orders...")
    await Order.deleteMany({})
    
    console.log("👥 STEP 2: Fetching users and products...")
    const users = await User.find({})
    const products = await Product.find({})
    
    if (users.length === 0 || products.length === 0) {
      console.error("❌ ERROR: Need at least one user and one product to seed orders!")
      process.exit(1)
    }

    console.log(`📦 STEP 3: Seeding 20 new orders...`)
    
    const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"]
    const paymentMethods = ["stripe", "paypal", "cod"]
    
    for (let i = 0; i < 20; i++) {
      const user = users[Math.floor(Math.random() * users.length)]
      const orderNumber = `TM-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`
      
      // Select 1 to 3 random products
      const itemsCount = Math.floor(Math.random() * 3) + 1
      const selectedProducts = []
      const usedIndices = new Set()
      
      while (selectedProducts.length < itemsCount && selectedProducts.length < products.length) {
        const idx = Math.floor(Math.random() * products.length)
        if (!usedIndices.has(idx)) {
          selectedProducts.push(products[idx])
          usedIndices.add(idx)
        }
      }
      
      const orderItems = selectedProducts.map(p => ({
        name: p.name,
        qty: Math.floor(Math.random() * 2) + 1,
        image: p.images?.[0]?.url || "",
        price: p.price,
        productID: p._id
      }))
      
      const itemsPrice = orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
      const taxPrice = Number((0.15 * itemsPrice).toFixed(2))
      const shippingPrice = itemsPrice > 500 ? 0 : 10
      const totalPrice = Number((itemsPrice + taxPrice + shippingPrice).toFixed(2))
      
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      const isPaid = status === "delivered" || Math.random() > 0.3
      const paidAt = isPaid ? new Date() : undefined
      const deliveredAt = status === "delivered" ? new Date() : undefined

      await Order.create({
        user: user._id,
        orderNumber,
        shippingAddress: {
          streetNumber: `${Math.floor(Math.random() * 100) + 1}`,
          buildingNumber: `${Math.floor(Math.random() * 10) + 1}A`,
          city: "New York",
          country: "USA",
          postalCode: 10001 + Math.floor(Math.random() * 100),
          phone: "+1-555-0123"
        },
        orderItems,
        status,
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        isPaid,
        paidAt,
        deliveredAt,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
      })
      
      if ((i + 1) % 5 === 0) console.log(`Processed ${i + 1}/20 orders...`)
    }
    
    console.log("✅ SUCCESS: 20 orders seeded and linked to real users!")
    process.exit()
  } catch (error) {
    console.error("❌ ERROR: Order seeding failed!")
    console.error(error)
    process.exit(1)
  }
}

seedOrders()
