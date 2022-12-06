import express from "express"
import mongoose from "mongoose"
import router from "./router.js"
import fileUpload from 'express-fileupload'
import authRouter from './authRouter.js'
import authController from "./authController.js";
import path from 'path'
import cookieParser from 'cookie-parser'

const DB_URL = 'mongodb+srv://sasha:12345@cluster0.3ezynqu.mongodb.net/?retryWrites=true&w=majority'
const PORT = 5002
const app = express()

app.use(express.json())
app.use(express.static('public'))
app.use('/api', router)
app.use(fileUpload({}))
app.use('/auth', authRouter)
app.use(cookieParser())

async function startApp() {
    try {
        await mongoose.connect(DB_URL)
        app.listen(PORT, () => console.log(`server started on ${PORT}`))
    } catch (e) {
        console.log(e)
    }
}
startApp()

