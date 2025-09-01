import React, { useRef } from "react";
import Navbar from "../components/Navbar";
import useAuthStore from "../store/authStore";
import dayjs from "dayjs";
import toast from "react-hot-toast";

const Settings = () => {
  const { user, isLoading, updateProfile } = useAuthStore();
  const imageUpload = useRef(null);
  const handleClick = () => {
    imageUpload.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const render = new FileReader();
      render.readAsDataURL(file);
      render.onload = async () => {
        const base64Image = render.result;
        await updateProfile({ profilePic: base64Image });
      };
    }
  };
  return (
    <div className="h-screen flex flex-col bg-base-200">
      {/* Navbar fixed at top */}
      <Navbar />

      {/* Main content (centered card, no scroll) */}
      <div className="flex-1 flex items-center justify-center">
        <div className="card w-full max-w-md bg-base-100 shadow-lg border border-base-300">
          <div className="card-body">
            <h2 className="card-title mb-4 flex justify-center items-center">
              Account Settings
            </h2>

            {/* Profile Pic */}
            <div className="flex flex-col items-center mb-6">
              <div className="avatar">
                <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  {isLoading ? (
                    <div className="flex justify-center items-center p-9">
                      <span className="loading loading-spinner loading-md  "></span>
                    </div>
                  ) : user.profilePic ? (
                    <img src={user.profilePic} alt="Profile" />
                  ) : (
                    <div className="flex justify-center items-center font-extrabold text-3xl p-7">
                      {user.fullName[0]}
                    </div>
                  )}
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                ref={imageUpload}
                onChange={handleFileChange}
                className="hidden"
                disabled={isLoading}
              />
              <button
                className="btn btn-primary btn-sm mt-3"
                onClick={handleClick}
              >
                Change Photo
              </button>
            </div>

            {/* Full Name */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                value={user.fullName}
                readOnly
                className="input input-bordered w-full bg-base-200 cursor-not-allowed"
              />
            </div>

            {/* Email */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                value={user.email}
                readOnly
                className="input input-bordered w-full bg-base-200 cursor-not-allowed"
              />
            </div>

            {/* Created At */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Account Created On</span>
              </label>
              <input
                type="text"
                value={dayjs(user.createdAt).format("DD/MM/YYYY")}
                readOnly
                className="input input-bordered w-full bg-base-200 cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
