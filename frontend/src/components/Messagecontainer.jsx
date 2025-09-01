import React, { useEffect ,useRef} from "react";
import SelectedUserContainer from "./SelectedUserContainer";
import useMessageStore from "../store/messageStore";
import useAuthStore from "../store/authStore";
import MessageBubble from "./MessageBubble";
const Messagecontainer = () => {
  const autoScroll = useRef(null);

  const {
    messages,
    selectedUser,
    getMessages,
    isGettingMessages,
    subscribeNewMessage,
    unSubscribeNewMessage,
  } = useMessageStore();
  const { user } = useAuthStore();
  useEffect(() => {
    getMessages(selectedUser);
    subscribeNewMessage();

    return () => {
      unSubscribeNewMessage();
    };
  }, [selectedUser]);

  useEffect(() => {
    autoScroll?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isGettingMessages)
    return (
      <div className="flex justify-center items-center mt-40">
        <span className="loading loading-spinner loading-md"></span>
      </div>
    );

  return (
    <div className="p-2 space-y-3" >
      {messages.map((message) => (
        <MessageBubble message={message} user={user} />
      ))}
      <div ref={autoScroll}></div>
    </div>
  );
};

export default Messagecontainer;
