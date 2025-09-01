import React from "react";

const NoChatSelected = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-500">
      <h2 className="text-3xl font-extrabold">No Chat Selected</h2>
      <p className="text-m font-bold text-gray-400 mt-2">
        Select a user to start chatting
      </p>
    </div>
  );
};

export default NoChatSelected;
