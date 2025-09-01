import React, { useEffect } from "react";
import useMessageStore from "../store/messageStore";
import User from "./User";

const UserContainer = () => {
  const { allUsers, getAllUsers,isUserLoading ,setSelectedUser } = useMessageStore();

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers])


  if (isUserLoading)
    return (
      <div className="flex justify-center items-center h-full">
        <span className="loading loading-spinner loading-md "></span>
      </div>
    );

    const handleClick=(user)=>{
      setSelectedUser(user)
    }

  return (
    <div className="h-full flex flex-col">
      {/* Search Bar */}
      <div className="p-3">
        <input
          type="text"
          placeholder="Search…"
          className="input input-bordered w-full"
        />
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto">
        {allUsers.map((user) => (
          
          <button key={user._id} className="w-full" onClick={()=>handleClick(user) }>
          <User  user={user}/>
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserContainer;
