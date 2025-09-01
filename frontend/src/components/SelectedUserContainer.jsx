import React from 'react'
import useMessageStore from '../store/messageStore'
import { MdCancel } from "react-icons/md";
import { IoIosVideocam } from "react-icons/io";
import useAuthStore from '../store/authStore';



const SelectedUserContainer = () => {
  const {selectedUser,removeSelectedUser}=useMessageStore()
  const {onlineUsers}=useAuthStore()

  const handleCalcle=()=>{
    removeSelectedUser()

  }
  
  return (
     <div className="p-2 pb-2 border-b border-base-300 bg-base-100 shadow-sm flex-shrink-0">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-content font-semibold text-lg text-bold">
            {selectedUser?.profilePic?<img src={selectedUser.profilePic} className='rounded-full w-12 h-12 '/>:selectedUser?.fullName[0]}
          </div>
        </div>
        <div className="flex-1">
          <h2 className="font-semibold text-base-content text-lg">{selectedUser?.fullName||"no user"}</h2>
          <div className="flex items-center space-x-2">

            <div className={`w-2 h-2 ${onlineUsers.includes(selectedUser._id)?"bg-success":"bg-error"} rounded-full`}></div>
            <p className={`text-sm ${onlineUsers.includes(selectedUser._id)?"text-success":"text-error"} font-medium`}>{onlineUsers.includes(selectedUser._id)?"Online":"Offline"}</p>


          </div>
        </div>
        <div className="flex items-center space-x-2">
         
          <button className="btn btn-ghost btn-sm text-base-content/60 hover:text-base-content">
            <IoIosVideocam size={23}/>
          </button>
          <button className="btn btn-ghost btn-sm text-base-content/60 hover:text-base-content" onClick={handleCalcle}>
          <MdCancel size={23}/>
          </button>
        </div>
      </div>
    </div>
  )
}

export default SelectedUserContainer