import React from "react";

export default function HomePage({ currentDriver, logout }) {
  const attendancePercent = 80; // You can make this dynamic later
  const attended = 24;
  const totalDays = 30;
  const leavesLeft = totalDays - attended;

  // Circle math
  const radius = 70;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset =
    circumference - (attendancePercent / 100) * circumference;

  return (
    <div className="min-h-screen bg-gray-200 flex justify-center items-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* 🔵 Top Blue Header */}
        <div className="bg-indigo-900 text-white p-5 flex justify-between items-center">
          <div className="text-2xl cursor-pointer">☰</div>
          <div className="font-semibold text-lg">
            {currentDriver.username}
          </div>
        </div>

        {/* ⚪ Main Content */}
        <div className="p-6 bg-gray-100 rounded-t-3xl -mt-6">

          {/* Title */}
          <h2 className="text-center text-gray-700 font-semibold mb-1">
            Overall Attendance
          </h2>
          <p className="text-center text-sm text-gray-500 mb-6">
            Monthly Overview
          </p>

          {/* 🔵 Circular Progress */}
          <div className="flex justify-center mb-6">
            <svg height={radius * 2} width={radius * 2}>
              <circle
                stroke="#e5e7eb"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <circle
                stroke="#2563eb"
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={`${circumference} ${circumference}`}
                style={{
                  strokeDashoffset,
                  transition: "stroke-dashoffset 0.5s ease",
                }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <text
                x="50%"
                y="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                className="text-2xl font-bold fill-indigo-900"
              >
                {attendancePercent}%
              </text>
            </svg>
          </div>

          {/* 📊 Stats Cards */}
          <div className="grid grid-cols-3 gap-3 text-center mb-6">
            <div className="bg-white p-4 rounded-xl shadow">
              <p className="text-2xl font-bold text-indigo-700">
                {attended}
              </p>
              <p className="text-xs text-gray-500">Attended</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow">
              <p className="text-2xl font-bold text-indigo-700">
                {totalDays}
              </p>
              <p className="text-xs text-gray-500">Total</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow">
              <p className="text-2xl font-bold text-indigo-700">
                {leavesLeft}
              </p>
              <p className="text-xs text-gray-500">Leaves Left</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold shadow-md"
          >
            Logout
          </button>

        </div>
      </div>
    </div>
  );
}


