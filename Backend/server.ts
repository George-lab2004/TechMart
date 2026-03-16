import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '.env') })
import connectDB from './config/db.ts'
import { ProductsRouter } from './routes/products.routes.ts'
import { errorHandler, notFound } from './Middleware/errorMiddleware.ts'
const port = process.env.PORT || 8000
connectDB()
const app = express()
const allowedOrigins = ['http://localhost:5173', 'https://tech-mart-e1dv.vercel.app']

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
            return
        }
        callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
}))
app.use(express.json())
app.use('/images', express.static(path.join(process.cwd(), 'public/images')))
app.get('/',(_req,res)=>{
        res.status(200).json({
            message: 'TechMart API is running',
            status: 'ok',
        })
})

app.use("/api",ProductsRouter)
app.use(notFound)
app.use(errorHandler)
// app.get('/api/product/:id',async(req,res,next)=>{
//     const id = req.params.id
//     const results = products.find((p) => p._id.toString() === id)
//     res.json(results)
// })
if (process.env.VERCEL !== '1') {
    app.listen(port, () => console.log(`server is running on port ${port}`))
}

export default app