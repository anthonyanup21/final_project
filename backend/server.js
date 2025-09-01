import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./db/connectDB.js"
import authRoutes from "./routes/auth.route.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import messageRoutes from "./routes/message.route.js"
import http from "http"
import {Server} from "socket.io"

dotenv.config()
const app = express()
const server=http.createServer(app)

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

app.use(cors({origin:"http://localhost:5173",credentials:true}))
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }));


app.use(cookieParser())
app.use("/api/auth",authRoutes)
app.use("/api/message",messageRoutes)



connectDB().then(() => {
    server.listen(process.env.PORT, () => {
        console.log(`server is running at port ${process.env.PORT||3000}`)
    })
})
