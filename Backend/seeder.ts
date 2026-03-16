import mongoose from "mongoose"
import dotenv from "dotenv"
import colors from "colors"
import bcrypt from "bcryptjs"
import users from "./data/users.js"
import products from "./data/products.js"
import categories from "./data/categories.js"
import User from "./Models/userModel.js"
import Product from "./Models/productModel.js"
import Order from "./Models/ordersModel.js"
import connectDB from "./config/db.js"
import Category from "./Models/categoryModel.js"

dotenv.config()
connectDB()

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();

    const hashedUsers = await Promise.all(
      users.map(async (u) => ({
        ...u,
        password: await bcrypt.hash(u.password, 10),
      }))
    )

    const createdUsers = await User.insertMany(hashedUsers);
    const createdCategories = await Category.insertMany(categories)
    const adminUser = createdUsers[0]._id;

    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    await Product.insertMany(sampleProducts);

    console.log(colors.green(colors.inverse('Data Imported!')));
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();

    console.log(colors.red(colors.inverse('Data Destroyed!')));
    process.exit();
  } catch (error) {
    console.error(colors.red(colors.inverse(`${error}`)))
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}