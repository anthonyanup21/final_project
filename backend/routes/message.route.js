import {Router} from "express"
import { getUsers,getMessages,sendMessage } from "../controllers/message.controller.js"
import { verifyToken } from "../middleware/verifyToken.js"
const route=Router()

route.get("/users",verifyToken,getUsers)
route.get("/:id",verifyToken,getMessages)
route.post("/send/:id",verifyToken,sendMessage)

export default route

