import React from "react";

const MessageBubble = ({ message, user }) => {
  return (


    <>
      {message.image && (
        <div
          className={`chat ${
            user._id == message.senderId ? "chat-end" : "chat-start"
          }`}
        >
          <div className="chat-bubble w-auto max-w-[400px] max-h-[350px] p-2">
            <img
              src={message.image}
              alt="attachment"
              className="rounded-2xl w-auto h-auto  max-w-[350px] max-h-[350px]"
            />
          </div>
        </div>
      )}

      {message.text && (
        <div
          className={`chat ${
            user._id == message.senderId ? "chat-end" : "chat-start"
          }`}
        >
          <div className="chat-bubble p-4 max-w-[500px] break-words text-m  ">{message.text}</div>
        </div>
      )}
    </>
  );
};

export default MessageBubble;
