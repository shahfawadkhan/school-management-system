import React, { useEffect, useState } from "react"
import { getAllSubjects } from "../../api/subjectsApi"
import { fetchAllClasses } from "../../api/classApi"
import { createExam } from "../../api/examApi"
import { FiBookOpen, FiCalendar, FiClipboard, FiCheckCircle } from "react-icons/fi"

const Exam = () => {
  const [examName, setExamName] = useState("")
  const [examDate, setExamDate] = useState("")
  const [subjects, setSubjects] = useState([])
  const [classes, setClasses] = useState([])
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  const [selectedClasses, setSelectedClasses] = useState([])
  const [selectedSubjects, setSelectedSubjects] = useState([])

  const handleMultiSelect = (value, selectedItems, setSelectedItems) => {
    setSelectedItems(
      selectedItems.includes(value)
        ? selectedItems.filter((item) => item !== value)
        : [...selectedItems, value]
    )
  }

  const handleCreateExam = async (e) => {
    e.preventDefault()
    try {
      const response = await createExam({
        name: examName,
        classes: selectedClasses,
        subjects: selectedSubjects,
        date: examDate,
      })

      setMessage(response?.data?.message || "Exam created successfully")
      setError("")

      setExamName("")
      setExamDate("")
      setSelectedClasses([])
      setSelectedSubjects([])
    } catch (error) {
      setError(error?.response?.data?.message || "Error while creating Exam")
    }
  }

  const loadClasses = async () => {
    try {
      const response = await fetchAllClasses()
      setClasses(response?.data || response)
    } catch (error) {
      setError("Error while fetching classes")
    }
  }

  const loadSubjects = async () => {
    try {
      const response = await getAllSubjects()
      setSubjects(response?.data || response)
    } catch (error) {
      setError("Error while fetching subjects")
    }
  }

  useEffect(() => {
    loadClasses()
    loadSubjects()
  }, [])

  return (
    <div className="flex justify-center items-center min-h-screen p-2">
      {/* ================= Creating Exam with Date and subjects ================= */}
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-3xl">
        <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-800 mb-6">
          <FiClipboard className="text-blue-500" /> Create Exam
        </h2>

        {error && <p className="text-red-500 mb-3">{error}</p>}
        {message && <p className="text-green-600 mb-3">{message}</p>}

        <form onSubmit={handleCreateExam} className="space-y-6">
          <div>
            <label className="flex items-center gap-2 text-gray-700 font-medium">
              <FiBookOpen className="text-blue-500" /> Exam Name
            </label>
            <input
              type="text"
              placeholder="Enter Exam Name"
              className="w-full mt-2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              onChange={(e) => setExamName(e.target.value)}
              value={examName}
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-gray-700 font-medium">
              <FiCalendar className="text-blue-500" /> Exam Date
            </label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full mt-2 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          <div>
            <p className="text-gray-700 font-medium mb-2">📘 Select Classes:</p>
            <div className="grid grid-cols-2 gap-3">
              {classes?.map((cls) => (
                <label
                  key={cls._id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition ${
                    selectedClasses.includes(cls._id)
                      ? "bg-blue-100 border-blue-400"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={selectedClasses.includes(cls._id)}
                    onChange={() =>
                      handleMultiSelect(cls._id, selectedClasses, setSelectedClasses)
                    }
                  />
                  <FiCheckCircle
                    className={`${
                      selectedClasses.includes(cls._id)
                        ? "text-blue-500"
                        : "text-gray-400"
                    }`}
                  />
                  {cls.name}
                </label>
              ))}
            </div>
          </div>

          <div>
            <p className="text-gray-700 font-medium mb-2">📖 Select Subjects:</p>
            <div className="grid grid-cols-2 gap-3">
              {subjects?.map((subj) => (
                <label
                  key={subj._id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition ${
                    selectedSubjects.includes(subj._id)
                      ? "bg-green-100 border-green-400"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={selectedSubjects.includes(subj._id)}
                    onChange={() =>
                      handleMultiSelect(
                        subj._id,
                        selectedSubjects,
                        setSelectedSubjects
                      )
                    }
                  />
                  <FiCheckCircle
                    className={`${
                      selectedSubjects.includes(subj._id)
                        ? "text-green-500"
                        : "text-gray-400"
                    }`}
                  />
                  {subj.name}
                </label>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow transition"
          >
            Create Exam
          </button>
        </form>
      </div>
    </div>
  )
}

export default Exam
