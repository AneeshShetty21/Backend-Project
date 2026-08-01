import express from 'express'
import cors from 'cors'
import cokkieParser from 'cookie-parser'

const app=express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:TRUE
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieStore())



export { app }