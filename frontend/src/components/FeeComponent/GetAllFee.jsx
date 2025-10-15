import React, { useState, useEffect } from "react";
import { createFee, getFeeByClass } from "../../api/feeApi";
import { getAllStudents } from "../../api/studentApi";
import { fetchAllClasses } from "../../api/classApi";

const GetAllFeeDetails = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [status, setStatus] = useState("unpaid");

  const [classes, setClasses] = useState([]);
  const [selectClass, setSelectClass] = useState("");
  const [feeRecords, setFeeRecords] = useState(null);

  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");

  // ================= Load all students =================
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await getAllStudents();
        setStudents(res.data);
      } catch (err) {
        console.error("Error fetching students:", err);
        setMessage("❌ Failed to fetch students");
        setMessageType("error");
      }
    };
    fetchStudents();
  }, []);

  // ================= Load all classes  =================
  useEffect(() => {
    const loadClasses = async () => {
      try {
        const response = await fetchAllClasses();
        setClasses(response);
      } catch (error) {
        setMessage(" Failed to fetch classes");
        setMessageType("error");
      }
    };
    loadClasses();
  }, []);

  // ================= Fetch fee details by class =================
  const handleFeeSubmit = async (classId) => {
    try {
      console.log("classId being sent:", classId);
      const response = await getFeeByClass(classId);
      console.log("Fee Records:", response);
      setFeeRecords(response);
    } catch (error) {
      console.error("Error fetching fee details:", error);
      setMessage("Error while getting fee details");
      setMessageType("error");
    }
  };

  //================= Create Fee Record =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !amount || !dueDate) {
      setMessage("Please fill all required fields!");
      setMessageType("error");
      return;
    }

    try {
      const res = await createFee({
        student: selectedStudent,
        amount,
        dueDate,
        paymentDate: status === "paid" ? paymentDate : null,
        status,
      });

      setMessage("Fee record created successfully!");
      setMessageType("success");

      setSelectedStudent("");
      setAmount("");
      setDueDate("");
      setPaymentDate("");
      setStatus("unpaid");
    } catch (err) {
      console.error("Error creating fee:", err);
      const apiMessage =
        err.response?.data?.message || "Error creating fee record";
      setMessage(apiMessage);
      setMessageType("error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6">Fee Management</h2>

        {message && (
          <div
            className={`p-4 mb-6 rounded-lg text-center font-medium transition-all duration-300 ${
              messageType === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 mb-10">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Student</label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            >
              <option value="">-- Select Student --</option>
              {students.map((stu) => (
                <option key={stu._id} value={stu._id}>
                  {stu?.user?.name} (Roll No: {stu.rollNumber})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fee Amount</label>
            <input
              type="number"
              placeholder="Enter Fee Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>

          {status === "paid" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-semibold"
          >
            Create Fee
          </button>
        </form>

        <div className="mt-8">
          <p className="text-lg font-semibold text-gray-700 mb-3">Select Class to View Fee Details</p>
          <select
            value={selectClass}
            onChange={async (e) => {
              const selected = e.target.value;
              setSelectClass(selected);
              if (selected) {
                await handleFeeSubmit(selected);
              }
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value="">-- Select Class --</option>
            {classes.map((cl) => (
              <option key={cl._id} value={cl._id}>
                {cl?.name}
              </option>
            ))}
          </select>

          {feeRecords && (
            <div className="mt-8 overflow-x-auto">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Fee Records</h3>
              <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
                <thead>
                  <tr className="bg-gray-50 text-gray-700">
                    <th className="border border-gray-200 p-4 text-left font-semibold">Student</th>
                    <th className="border border-gray-200 p-4 text-left font-semibold">Roll No</th>
                    <th className="border border-gray-200 p-4 text-left font-semibold">Amount</th>
                    <th className="border border-gray-200 p-4 text-left font-semibold">Due Date</th>
                    <th className="border border-gray-200 p-4 text-left font-semibold">Payment Date</th>
                    <th className="border border-gray-200 p-4 text-left font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {feeRecords.records.map((rec) =>
                    rec.fees.map((fee) => (
                      <tr key={fee.feeId} className="hover:bg-gray-50 transition-colors">
                        <td className="border border-gray-200 p-4">{rec.name}</td>
                        <td className="border border-gray-200 p-4">{rec.rollNumber}</td>
                        <td className="border border-gray-200 p-4">{fee.amount}</td>
                        <td className="border border-gray-200 p-4">
                          {fee.dueDate
                            ? new Date(fee.dueDate).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="border border-gray-200 p-4">
                          {fee.paymentDate
                            ? new Date(fee.paymentDate).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="border border-gray-200 p-4">
                          <span
                            className={`px-2 py-1 rounded-full text-sm font-medium ${
                              fee.status === "paid"
                                ? "bg-green-100 text-green-700"
                                : fee.status === "unpaid"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {fee.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GetAllFeeDetails;