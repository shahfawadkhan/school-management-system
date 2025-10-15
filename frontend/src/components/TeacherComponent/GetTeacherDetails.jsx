import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTeacherById } from "../../api/teacherApi";

const GetTeacherDetails = () => {
  const { teacherId } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  
  const navigate = useNavigate();

  

  useEffect(() => {
    const loadTeacher = async () => {
      try {
        setLoading(true);
        const res = await getTeacherById(teacherId);
        console.log("Teacher data:", res);
        setTeacher(res);
      } catch (err) {
        console.error("Error loading teacher:", err);
        setError(
          err?.response?.data?.message || err.message || "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    if (teacherId) {
      loadTeacher();
    }
  }, [teacherId]);

  if (loading)
    return <p className="p-6 text-gray-500">Loading teacher details...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!teacher) return <p className="p-6 text-gray-500">Teacher not found</p>;

  return (
    <div className="inset-0 absolute  backdrop-blur-md z-50 p-6 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-md rounded-md p-6 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-4">
          {teacher.user?.name || "No Name"}
        </h1>

        <p className="text-gray-600 mb-2">
          <span className="font-medium">Email:</span>{" "}
          {teacher.user?.email || "N/A"}
        </p>

        <p className="text-gray-600 mb-2">
          <span className="font-medium">Subjects:</span>{" "}
          {teacher.subjects?.length > 0
            ? teacher.subjects.map((s) => s.name).join(", ")
            : "N/A"}
        </p>

        <p className="text-gray-600 mb-2">
          <span className="font-medium">Phone:</span>{" "}
          {teacher.mobileNo || "N/A"}
        </p>

        <p className="text-gray-600 mb-2">
          <span className="font-medium">Address:</span>{" "}
          {teacher.address || "N/A"}
        </p>

        <button
          className="text-white bg-blue-600 text-center p-2 w-[100px] rounded cursor-pointer"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default GetTeacherDetails;
