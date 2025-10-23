import React from "react";
import Navbar from "../components/Navbar";
import UserContainer from "../components/UserContainer";
import MessageContainer from "../components/Messagecontainer";
import InputContainer from "../components/InputContainer";
import useMessageStore from "../store/messageStore";
import NoChatSelected from "../components/NoChatSelected";
import SelectedUserContainer from "../components/SelectedUserContainer";

const HomePage = () => {
  const { selectedUser } = useMessageStore();
  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Left: users */}
        <div className="w-70 border-r border-base-300">
          <UserContainer />
        </div>

        {/* Right: chat */}
        {selectedUser ? (
          <div className="flex-1 flex flex-col">
            <SelectedUserContainer />
            {/* Messages Section */}
            <div className="flex-1 overflow-y-auto bg-base-100">
              <MessageContainer />
            </div>



            {/* Input always at bottom */}
            <InputContainer />
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <NoChatSelected />
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
