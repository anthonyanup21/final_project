import { create } from "zustand"
import { axiosInstance } from "../lib/axios.js"
import toast from "react-hot-toast"
import useMessageStore from "./messageStore.js"
import { io } from "socket.io-client"

const useAuthStore = create((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    login: async (email, password) => {

        try {
            set({ isLoading: true })

            const res = await axiosInstance.post("/auth/login", { email, password })
            set({ isLoading: false, isAuthenticated: true, user: res.data.user })
            toast.success("Logged in Successfylly")
            get().connectSocket()
        } catch (error) {
            set({ isLoading: false })
            toast.error(error.response.data.message || "something went wrong")
            console.log(error)
        }

    },
    signup: async (fullName, email, password) => {

        try {
            set({ isLoading: true })

            const res = await axiosInstance.post("/auth/signup", { fullName, email, password })
            set({ isLoading: false, user: res.data.user, isAuthenticated: true })
            toast.success("Account created successfully")
            get().connectSocket()

        } catch (error) {
            set({ isLoading: false })
            toast.error(error.response.data.message || "something went wrong")
            console.log(error)


        }

    },

    logout: async () => {
        try {
            set({ isLoading: true })
            await axiosInstance.get("/auth/logout")
            set({ user: null, isLoading: false, isAuthenticated: false })
            useMessageStore.getState().reset()
            toast.success("Logged out Successfylly")
            get().disConnectSocket()


        } catch (error) {
            set({ isLoading: false })
            toast.error(error.response.data.message || "something went wrong")
            console.log(error)

        }

    },
    checkAuth: async () => {

        try {
            const res = await axiosInstance.get("/auth/check-auth")
            set({ user: res.data.user, isCheckingAuth: false, isAuthenticated: true })
            get().connectSocket()


        } catch (error) {
            set({ user: null, isCheckingAuth: false, isAuthenticated: false })
            console.log(error)
        }


    },
    updateProfile: async ({ profilePic }) => {
        set({ isLoading: true })
        try {
            const response = await axiosInstance.put("/auth/update-profile", { profilePic })
            set({ isLoading: false, user: response.data.user })
            toast.success("Profile Updated");
        } catch (error) {
            set({ isLoading: false })
            toast.error(error.response.data.message || "something went wrong")
            console.log(error)


        }

    },
    connectSocket: async () => {
        const { user, socket } = get()
        const url=import.meta.env.MODE=="development"?"http://localhost:3000":"/"

        if (!user || socket?.connected) return //return if there is no auth user or if the user is alreday connected to socket.io
        const newSocket = io(url, {
            query: {
                userId: user._id
            }
        })

        newSocket.connect()
        set({ socket: newSocket })
        newSocket.on("getOnlineUsers",(userIds)=>{
            set({onlineUsers:userIds})

        })

    },
    disConnectSocket: async () => {
        const { socket } = get()
        if (socket?.connected) {
            socket.disconnect()
            set({ socket: null })
        }

    }


}))

export default useAuthStore