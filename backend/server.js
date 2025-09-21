import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./db/connectDB.js"
import authRoutes from "./routes/auth.route.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import messageRoutes from "./routes/message.route.js"
import http from "http"
import {Server} from "socket.io"
import path from "path"

dotenv.config()
const app = express()
const server=http.createServer(app)
const __dirname=path.resolve()//backend folder location
//socket.io
export const io=new Server(server,{
    cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
})
const onlineUsers={}

export const getReciverSocketId=(userId)=>{
    return onlineUsers[userId]

}
io.on("connection",(socket)=>{
    console.log("a user connected",socket.id)
    const userId=socket.handshake.query.userId
    if (userId){
        onlineUsers[userId]=socket.id
    }

    io.emit("getOnlineUsers",Object.keys(onlineUsers))
    socket.on("disconnect",()=>{
        console.log("user disconnected",socket.id)
        delete onlineUsers[userId]
        io.emit("getOnlineUsers",Object.keys(onlineUsers))
    })
})

if(process.env.ENV!="production"){
    app.use(cors({origin:"http://localhost:5173",credentials:true}))


}
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }));


app.use(cookieParser())
app.use("/api/auth",authRoutes)
app.use("/api/message",messageRoutes)
app.use(express.static(path.join(__dirname,"../frontend/dist")))//dist folder location



//if we get aly request other than above url then send them the static file
if(process.env.ENV=="production"){
app.get(/.*/,(req,res)=>{
    res.sendFile(path.join(__dirname,"../frontend/dist/index.html"))
})}

connectDB().then(() => {
    server.listen(process.env.PORT, () => {
        console.log(`server is running at port ${process.env.PORT||3000}`)
    })
})
