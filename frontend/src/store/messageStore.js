import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client"
import useAuthStore from "./authStore";
import { use } from "react";

const useMessageStore = create((set, get) => ({
    isUserLoading: false,
    isGettingMessages: false,
    allUsers: [],
    messages: [],
    messagesQueue: [],
    selectedUser: null,
    isSendingMessage: false,
    setSelectedUser: (user) => {
        set({ selectedUser: user })

    },
    getAllUsers: async () => {
        set({ isUserLoading: true })
        try {
            const users = await axiosInstance.get("/message/users")
            set({ allUsers: users.data, isUserLoading: false })
        } catch (error) {
            set({ isUserLoading: false })
            toast.error(error.response.data.message || "something went wrong")
            console.log(error)

        }

    },
    getMessages: async (user) => {
        set({ isGettingMessages: true })
        try {
            const res = await axiosInstance.get(`/message/${user._id}`)
            set({ isGettingMessages: false, messages: res.data.messages })
        } catch (error) {
            set({ isGettingMessages: false })
            toast.error(error.response.data.message || "something went wrong")
            console.log(error)

        }

    },
    sendMessage: async (messageData) => {
        const {  messages, messagesQueue } = get()

        // set({ isSendingMessage: true })
        const tempId = "tempid" + Date.now()
        const { text, image } = messageData
        const tempMessage = {
            tempId,
            senderId: useAuthStore.getState().user._id,
            text,
            image

        }
        //optiemistic rendering
        set({ messages: [...messages, tempMessage], messagesQueue: [...messagesQueue, tempMessage] })


        try {
            get().processMessageQueue()


        } catch (error) {
            set({ isSendingMessage: false })

            toast.error(error.response.data.message || "something went wrong")
            console.log(error)

        }

    },

    processMessageQueue: async () => {

        const messageData = get().messagesQueue[0]
        const res = await axiosInstance.post(`/message/send/${get().selectedUser._id}`, { ...messageData, tempId:messageData.tempId })
        const { newMessage, tempId:returnedTempId } = res.data
  

        set((state) => ({
            messages: state.messages.map((message) => (message.tempId == returnedTempId ? newMessage : message)),
            messagesQueue: state.messagesQueue.filter((msg) => msg.tempId != returnedTempId)
        }))


        if (get().messagesQueue.length > 0) {
            get().processMessageQueue();
        }



    },
    removeSelectedUser: () => {
        set({ selectedUser: null, messages: [], isGettingMessages: false })
    },
    reset: () => {
        set({
            isUserLoading: false,
            isGettingMessages: false,
            allUsers: [],
            messages: [],
            selectedUser: null,
            isSendingMessage: false,
        })
    },
    //socket.io
    subscribeNewMessage: () => {
        const { selectedUser } = get()
        if (!selectedUser) return
        const { socket } = useAuthStore.getState()
        socket.on("newMessage", (newMessage) => {
            if (newMessage.senderId != selectedUser._id) return //update message only if the message is sent from selected user
            set({ messages: [...get().messages, newMessage] })
        })


    },
    unSubscribeNewMessage: () => {
        const { socket } = useAuthStore.getState()
        socket.off("newMessage")


    }

}))

export default useMessageStore