import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllUsers, deleteUser } from "../../slices/authSlice";
import { FaUser, FaEnvelope, FaShieldAlt, FaTrash } from "react-icons/fa";

const GetAllUsers = () => {
  const dispatch = useDispatch();
  const { allUsers, loading, error, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(id));
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-600 font-medium p-6 bg-red-100 rounded-xl shadow-lg">
        Error: {error}
      </div>
    );

  return (
    <div className="min-h-screen p-1 ">
      <div className="bg-blue-600 text-white py-4 px-6 rounded-xl shadow-md mb-8 text-center">
        <h2 className="text-3xl font-bold">User Management 👥</h2>
      </div>

      {allUsers && allUsers.length > 1 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {allUsers
            .filter((u) => u._id !== user?.user._id)
            .map((u) => (
              <div
                key={u._id}
                className="shadow-[0_0_10px_rgba(0,0,0,0.3)]  bg-white border border-blue-100 rounded-xl  hover:shadow-lg p-5 transition-all duration-300 flex flex-col"
              >
                <div className="space-y-3 flex-grow">
                  <p className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                    <FaUser className="text-blue-600" />
                    {u.name}
                  </p>
                  <p className="flex items-center gap-2 text-gray-600 break-words">
                    <FaEnvelope className="text-blue-500" />
                    {u.email}
                  </p>
                  <p className="flex items-center gap-2 text-gray-600">
                    <FaShieldAlt
                      className={`${
                        u.role === "admin" ? "text-purple-600" : "text-green-600"
                      }`}
                    />
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        u.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {u.role}
                    </span>
                  </p>
                </div>

                {/*===============  Delete Button =============== */}
                {user?.user?.role === "admin" && (
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-medium rounded-lg shadow hover:bg-red-600 transition"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 p-8 bg-white border rounded-xl shadow-inner">
          No users found.
        </div>
      )}
    </div>
  );
};

export default GetAllUsers;
