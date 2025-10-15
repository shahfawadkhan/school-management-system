import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MdClose } from 'react-icons/md';
import { logout } from '../slices/authSlice';
import { toast } from 'react-toastify';

const Profile = ({ showProfile, setShowProfile }) => {
  const dispatch = useDispatch();

  const {user} = useSelector((state)=>state.auth)  
  
  const handleLogout = () => {
    dispatch(logout());
    toast.success("User Logout Successfully" ,{
                    theme : "dark"
                  })
    setShowProfile(false); 
  };

  return (
    <>
      {showProfile && (
        <div
          className="fixed inset-0 bg-opacity-40 backdrop-blur-sm z-40"
          onClick={() => setShowProfile(false)}
        />
      )}

      <div
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-auto w-80 bg-white shadow-[0_0_20px_0_rgba(0,0,0,0.25)] rounded-lg transition-all duration-300 z-50 p-6 ${
          showProfile ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        }`}
      >
        <button
          onClick={() => setShowProfile(false)}
          className="absolute top-3 right-3 text-gray-600 hover:text-blue-600 cursor-pointer text-2xl"
          aria-label="Close Profile Modal"
        >
          <MdClose />
        </button>

        <div className="mt-4">
          <h2 className="font-semibold text-gray-700 mb-1">Name</h2>
          <input
            className="border w-full p-3 rounded mt-1 focus:outline-blue-500"
            type="text"
            value={user?.user?.name || ''}
            readOnly
          />
        </div>

        <div className="mt-4">
          <h2 className="font-semibold text-gray-700 mb-1">Role</h2>
          <input
            className="border w-full p-3 rounded mt-1 bg-gray-100 text-gray-600 cursor-not-allowed"
            type="text"
            value={user?.user?.role || ''}
            readOnly
          />
        </div>

        <div className="mt-4">
          <h2 className="font-semibold text-gray-700 mb-1">Email</h2>
          <input
            className="border w-full p-3 rounded mt-1 focus:outline-blue-500"
            type="text"
            value={user?.user?.email || ''}
            readOnly
          />
        </div>
        <div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </>
  );
};

export default Profile;
