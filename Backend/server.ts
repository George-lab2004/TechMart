import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env') })
import products from './data/products.ts'
import connectDB from './config/db.ts'
import { ProductsRouter } from './routes/products.routes.ts'
import { errorHandler, notFound } from './Middleware/errorMiddleware.ts'
const port = process.env.PORT || 8000
connectDB()
const app = express()
app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use('/images', express.static(path.join(process.cwd(), 'public/images')))
app.get('/',(req,res,next)=>{
    res.send( products)
})

app.use("/api",ProductsRouter)
app.use(notFound)
app.use(errorHandler)
// app.get('/api/product/:id',async(req,res,next)=>{
//     const id = req.params.id
//     const results = products.find((p) => p._id.toString() === id)
//     res.json(results)
// })
app.listen(port,()=> console.log(`server is running on port ${port}`))