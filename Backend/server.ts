import dotenv from "dotenv";
dotenv.config();
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import connectDB from './config/db.js'
import { ProductsRouter } from './routes/products.routes.js'
import { errorHandler, notFound } from './Middleware/errorMiddleware.js'
import { userRouter } from './routes/user.routes.js'
const port = process.env.PORT || 8000
connectDB()
const app = express()
app.use(express.json())
app.use(cookieParser())
const allowedOrigins = ['http://localhost:5173', 'https://tech-mart-e1dv.vercel.app']
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);
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

// Diagnostic Log
app.use((req, _res, next) => {
    console.log(`🌐 ${req.method} ${req.url}`);
    next();
});

app.use('/images', express.static(path.join(process.cwd(), 'public/images')))
app.get('/', (_req, res) => {
    res.status(200).json({
        message: 'TechMart API is running',
        status: 'ok',
    })
})

app.use("/api", ProductsRouter)
app.use("/api", userRouter)
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