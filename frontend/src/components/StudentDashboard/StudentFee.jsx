import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getStudentFee } from '../../api/feeApi';
import { DollarSign, Calendar, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';

const StudentFee = () => {
  const { user } = useSelector((state) => state.auth);
  const studentId = user?.user?.roleDocumentId;

  const [feeData, setFeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // ----------------------------
  // Fetch student fee data based on selected year
  // ----------------------------
  useEffect(() => {
    const fetchFeeRecords = async () => {
      if (!studentId || !selectedYear) return;
      try {
        setLoading(true);
        const data = await getStudentFee(studentId, selectedYear);
        console.log(data);
        setFeeData(data);
      } catch (error) {
        console.error('Error fetching fee records:', error);
        setFeeData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchFeeRecords();
  }, [studentId, selectedYear]);

  // ----------------------------
  // Loading State
  // ----------------------------
  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading fee records...</p>
        </div>
      </div>
    );
  }

  // ----------------------------
  // No Data State
  // ----------------------------
  if (!feeData || !feeData.records) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
        <div className="text-center bg-white p-12 rounded-2xl shadow-xl">
          <DollarSign className="w-20 h-20 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-xl">No fee records found</p>
        </div>
      </div>
    );
  }

  // ----------------------------
  // Check if all months are "not assigned"
  // ----------------------------
  const allNotAssigned = feeData.records.every(r => r.status === 'not assigned');

  // ----------------------------
  // Calculate Fee Statistics
  // ----------------------------
  const calculateStats = () => {
    const records = feeData.records || [];
    const paid = records.filter(r => r.status === 'paid').length;
    const pending = records.filter(r => r.status === 'pending').length;
    const overdue = records.filter(r => r.status === 'overdue').length;
    const notAssigned = records.filter(r => r.status === 'not assigned').length;

    const totalAssigned = records.filter(r => r.amount !== null).reduce((sum, r) => sum + r.amount, 0);
    const totalPaid = records.filter(r => r.status === 'paid').reduce((sum, r) => sum + r.amount, 0);
    const totalPending = records.filter(r => r.status === 'pending' || r.status === 'overdue').reduce((sum, r) => sum + r.amount, 0);

    return { paid, pending, overdue, notAssigned, totalAssigned, totalPaid, totalPending };
  };

  const stats = calculateStats();

  // ----------------------------
  // Define UI colors and labels based on status
  // ----------------------------
  const getStatusConfig = (status) => {
    switch (status) {
      case 'paid':
        return {
          icon: CheckCircle,
          text: 'Paid',
          bg: 'bg-green-50',
          border: 'border-green-200',
          textColor: 'text-green-700',
          badgeBg: 'bg-green-100'
        };
      case 'pending':
        return {
          icon: Clock,
          text: 'Pending',
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          textColor: 'text-yellow-700',
          badgeBg: 'bg-yellow-100'
        };
      case 'overdue':
        return {
          icon: AlertCircle,
          text: 'Overdue',
          bg: 'bg-red-50',
          border: 'border-red-200',
          textColor: 'text-red-700',
          badgeBg: 'bg-red-100'
        };
      default:
        return {
          icon: XCircle,
          text: 'Not Assigned',
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          textColor: 'text-gray-700',
          badgeBg: 'bg-gray-100'
        };
    }
  };

  // ----------------------------
  // Generate Year Options for Dropdown
  // ----------------------------
  const currentYear = new Date().getFullYear();
  const yearOptions = [];
  for (let i = currentYear - 5; i <= currentYear + 5; i++) {
    yearOptions.push(i);
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 md:px-8">
      
      {/* ============================ */}
      {/* HEADER SECTION */}
      {/* ============================ */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <DollarSign className="w-10 h-10 text-green-600" />
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Fee Records</h1>
              <p className="text-gray-600 mt-1">{feeData.student}</p>
            </div>
          </div>

          {/* Year Selector Dropdown */}
          <div className="flex items-center gap-3 bg-white rounded-xl shadow-md px-4 py-3">
            <Calendar className="w-5 h-5 text-green-600" />
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="text-lg font-semibold text-gray-800 bg-transparent border-none outline-none cursor-pointer"
            >
              {yearOptions.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ============================ */}
      {/* STATISTICS CARDS */}
      {/* ============================ */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Paid */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Paid</p>
              <p className="text-3xl font-bold text-green-600 mt-1">₨{stats.totalPaid.toLocaleString()}</p>
              <p className="text-sm text-gray-600 mt-1">{stats.paid} months</p>
            </div>
          </div>
        </div>

        {/* Pending Amount */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Pending Amount</p>
              <p className="text-3xl font-bold text-yellow-600 mt-1">₨{stats.totalPending.toLocaleString()}</p>
              <p className="text-sm text-gray-600 mt-1">{stats.pending + stats.overdue} months</p>
            </div>
          </div>
        </div>

        {/* Overdue */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Overdue</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{stats.overdue}</p>
              <p className="text-sm text-gray-600 mt-1">months</p>
            </div>
          </div>
        </div>

        {/* Total Assigned */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Assigned</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">₨{stats.totalAssigned.toLocaleString()}</p>
              <p className="text-sm text-gray-600 mt-1">for {selectedYear}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ============================ */}
      {/* MONTHLY RECORDS SECTION */}
      {/* ============================ */}
      {allNotAssigned ? (
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-12 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Fee Records for {selectedYear}</h2>
          <p className="text-gray-600">
            No fees have been assigned for this year yet. Try selecting a different year from the dropdown above.
          </p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Monthly Breakdown</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {feeData.records.map((record, index) => {
              const statusConfig = getStatusConfig(record.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={index}
                  className={`${statusConfig.bg} ${statusConfig.border} border-2 rounded-xl p-5 transition-all hover:shadow-md`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-800 text-lg">{record.month}</h3>
                    <span className={`${statusConfig.badgeBg} ${statusConfig.textColor} px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusConfig.text}
                    </span>
                  </div>

                  {/* Fee Details */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Amount:</span>
                      <span className="font-bold text-gray-800">
                        {record.amount !== null ? `₨${record.amount.toLocaleString()}` : 'N/A'}
                      </span>
                    </div>

                    {record.dueDate && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">Due Date:</span>
                        <span className="text-gray-700 text-sm font-medium">
                          {new Date(record.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    {record.paymentDate && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">Paid On:</span>
                        <span className="text-green-700 text-sm font-medium">
                          {new Date(record.paymentDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Overdue Warning */}
                  {record.status === 'overdue' && (
                    <div className="mt-3 pt-3 border-t border-red-200">
                      <p className="text-red-600 text-xs font-semibold">
                        Payment overdue! Please clear dues immediately.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================ */}
      {/* PAYMENT SUMMARY FOOTER */}
      {/* ============================ */}
      {!allNotAssigned && (
        <div className="max-w-7xl mx-auto mt-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-lg p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-green-100 text-sm mb-2">Payment Progress</p>
              <div className="w-full bg-green-800 rounded-full h-3 mb-2">
                <div
                  className="bg-white h-3 rounded-full transition-all duration-500"
                  style={{ width: `${stats.totalAssigned > 0 ? (stats.totalPaid / stats.totalAssigned) * 100 : 0}%` }}
                ></div>
              </div>
              <p className="text-2xl font-bold">
                {stats.totalAssigned > 0 ? ((stats.totalPaid / stats.totalAssigned) * 100).toFixed(1) : 0}% Complete
              </p>
            </div>

            <div>
              <p className="text-green-100 text-sm mb-2">Months Cleared</p>
              <p className="text-4xl font-bold">{stats.paid}/12</p>
            </div>

            <div>
              <p className="text-green-100 text-sm mb-2">Outstanding Balance</p>
              <p className="text-4xl font-bold">₨{stats.totalPending.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentFee;
