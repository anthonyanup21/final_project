import React from "react";
import { IoMdDownload } from "react-icons/io";
import useMessageStore from "../store/messageStore";

const MessageBubble = ({ message, user }) => {
  const {downloadImage}=useMessageStore()
  return (
    <>
      {message.image && (
        <div
          className={`chat ${
            user._id == message.senderId ? "chat-end" : "chat-start"
          }`}
        >
          <div className="chat-bubble w-auto max-w-[400px] max-h-[350px] p-2 relative">
            <img
              src={message.image}
              alt="attachment"
              className="rounded-2xl w-auto h-auto  max-w-[350px] max-h-[350px]"
              down
            />

            <span className="absolute top-1/2 left-1/2 z-10">
              {" "}
              {message.tempId && (
                <span className="loading loading-spinner text-error"></span>
              )}
            </span>
            {!message.tempId && (
              <button className="btn btn-ghost absolute top-0 right-0" onClick={()=>downloadImage(message.image)}>
                <IoMdDownload size={20} />
              </button>
            )}
          </div>
        </div>
      )}

      {message.text && (
        <div
          className={`chat ${
            user._id == message.senderId ? "chat-end" : "chat-start"
          }`}
        >
          <div className="chat-bubble p-4 max-w-[500px] break-words text-m relative ">
            {message.text}

            <span className="absolute top-1/4 left-1/3">
              {" "}
              {message.tempId && (
                <span className="loading loading-xs loading-spinner text-error"></span>
              )}
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default MessageBubble;
