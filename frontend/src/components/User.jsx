import React from "react";
import useMessageStore from "../store/messageStore";
import useAuthStore from "../store/authStore";
const User = ({ user }) => {
  const {selectedUser}=useMessageStore()
  const {onlineUsers}=useAuthStore()

  return (
    <div className={`flex items-center gap-4 p-2 hover:bg-base-200 cursor-pointer rounded-lg ${selectedUser?._id==user._id && "bg-base-200"}`}>
      {/* Avatar */}
      <div className={`avatar ${onlineUsers.includes(user._id)&&  "avatar-online"}`}>
        <div className="w-12  rounded-full bg-primary text-black ">
          {user.profilePic?<img 
            src={user.profilePic} 
            alt={user.fullName} 
          />:<div className="mt-2 w-full text-lg font-bold ">{user.fullName[0]}</div>}
          
        </div>
      </div>

      {/* User Info */}
      <div className="flex flex-col items-start">
        <span className="text-[18px] font-semibold">{user.fullName}</span>
        <span className="text-sm text-gray-500">{user.status || "Offline"}</span>
      </div>
    </div>
  );
};

export default User;
