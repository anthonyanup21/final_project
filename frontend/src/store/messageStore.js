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
    sendMessage: async (text, image, preview) => {
        const { messages, messagesQueue, stegoEncodeImage } = get()

        //check if the image need to be stegnographed
        if (image && text.slice(0, 6) == "@stego") {
            //implement stego image here
            const str = text.replace("@stego&", "")
            const params = new URLSearchParams(str);
            const key = params.get("key")
            const message = params.get("text")
            if (key && message) {
                const newImage = await stegoEncodeImage(key, message, image)
                image = newImage
                text = ""
            }

        }

        // set({ isSendingMessage: true })
        const tempId = "tempid" + Date.now()

        const formData = new FormData()
        formData.append("text", text)
        formData.append("image", image)
        formData.append("tempId", tempId)

        const tempMessage = {
            tempId,
            senderId: useAuthStore.getState().user._id,
            text,
            image: preview,
            formData

        }
        //optiemistic rendering
        set({ messages: [...messages, tempMessage], messagesQueue: [...messagesQueue, tempMessage] })


        try {
            if (get().messagesQueue.length == 1) {
                get().processMessageQueue()


            }


        } catch (error) {
            set({ isSendingMessage: false })

            toast.error(error.response.data.message || "something went wrong")
            console.log(error)

        }

    },
    stegoEncodeImage: async (key, text, imageFile) => {
        try {
            const message = text

            // Simple XOR encryption using key
            const encryptMessage = (msg, key) => {
                let encrypted = "";
                for (let i = 0; i < msg.length; i++) {
                    const msgChar = msg.charCodeAt(i);
                    const keyChar = key.charCodeAt(i % key.length);
                    encrypted += String.fromCharCode(msgChar ^ keyChar);
                }
                return encrypted;
            };

            const encryptedMessage = encryptMessage(message, key);

            // Convert text to binary (with EOF marker)
            const textToBinary = (text) =>
                text
                    .split("")
                    .map((c) => c.charCodeAt(0).toString(2).padStart(8, "0"))
                    .join("") + "1111111111111110"; // EOF marker

            const binaryMessage = textToBinary(encryptedMessage);

            // Load image
            const img = await new Promise((resolve) => {
                const image = new Image();
                image.src = URL.createObjectURL(imageFile);
                image.onload = () => resolve(image);
            });

            // Draw to canvas
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            // Capacity check
            if (binaryMessage.length > data.length / 4) {
                throw new Error("Message too long for this image!");
            }

            // Encode message bits into red channel
            let index = 0;
            for (let i = 0; i < data.length && index < binaryMessage.length; i += 4) {
                data[i] = (data[i] & 0xfe) | parseInt(binaryMessage[index]);
                index++;
            }

            ctx.putImageData(imageData, 0, 0);

            // Convert to Blob
            const blob = await new Promise((resolve) =>
                canvas.toBlob((b) => resolve(b), "image/png")
            );

            return blob;

        } catch (error) {
            console.log("Error in stegoEncodeImage:", error);
        }
    },

    processMessageQueue: async () => {

        const messageData = get().messagesQueue[0]

        const res = await axiosInstance.post(`/message/send/${get().selectedUser._id}`, messageData.formData)
        const { newMessage, tempId: returnedTempId } = res.data


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


    },
    downloadImage: async (url) => {

        const forcedUrl = url.replace("/upload/", "/upload/fl_attachment:quickChat_image/");
        const link = document.createElement("a");
        link.href = forcedUrl;
        link.click();
        document.body.removeChild(link); // remove after click



    }

}))

export default useMessageStore