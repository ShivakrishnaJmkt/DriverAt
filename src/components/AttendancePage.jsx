import { useState, useEffect } from "react";
import jsPDF from "jspdf";

export default function AttendancePage({ currentDriver, logout }) {
  const today = new Date();
  const todayDate = today.toISOString().split("T")[0];
  const currentMonth = today.toISOString().slice(0, 7);

  const [selectedDate, setSelectedDate] = useState(todayDate);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [dutyType, setDutyType] = useState("P");
  const [busNumber, setBusNumber] = useState("");
  const [routeName, setRouteName] = useState("");

  const storageKey = "attendance_" + currentDriver.username;

  const [attendance, setAttendance] = useState(() => {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(attendance));
  }, [attendance, storageKey]);

  const dutyPoints = { P: 1, DD: 2, OT: 2.5, A: 0 };

  const monthlyData = attendance.filter((a) =>
    a.date.startsWith(selectedMonth)
  );

  const totalDutyUnits = monthlyData
    .filter((a) => a.duty !== "A")
    .reduce((sum, a) => sum + a.units, 0);

  const absentDays = monthlyData.filter((a) => a.duty === "A").length;

  const ratePerUnit = 800;
  const totalSalary = totalDutyUnits * ratePerUnit;

  const saveAttendance = () => {
    if (!selectedDate) return;

    const existingIndex = attendance.findIndex(
      (a) => a.date === selectedDate
    );

    const newEntry = {
      date: selectedDate,
      duty: dutyType,
      units: dutyPoints[dutyType],
      busNumber,
      routeName,
    };

    let updated;

    if (existingIndex !== -1) {
      updated = [...attendance];
      updated[existingIndex] = newEntry;
    } else {
      updated = [...attendance, newEntry];
    }

    setAttendance(updated);
    setBusNumber("");
    setRouteName("");
    setDutyType("P");
  };

  const deleteEntry = (date) => {
    const updated = attendance.filter((a) => a.date !== date);
    setAttendance(updated);
  };

  // ✅ Generate PDF with Logo
  const generatePDF = async () => {
    const doc = new jsPDF();
    let y = 20;

    // Load Logo
    const img = new Image();
    img.src = "/logo.png";

    await new Promise((resolve) => {
      img.onload = resolve;
    });

    doc.addImage(img, "PNG", 20, y, 40, 25);
    y += 30;

    doc.setFontSize(16);
    doc.text("SV TRANS PRIVATE LIMITED", 20, y);
    y += 10;

    doc.setFontSize(12);
    doc.text(`Driver: ${currentDriver.username}`, 20, y);
    y += 8;
    doc.text(`Month: ${selectedMonth}`, 20, y);
    y += 12;

    doc.text("Date", 20, y);
    doc.text("Duty", 50, y);
    doc.text("Bus", 80, y);
    doc.text("Route", 110, y);
    doc.text("Units", 170, y);
    y += 8;

    monthlyData.forEach((entry) => {
      doc.text(entry.date, 20, y);
      doc.text(entry.duty, 50, y);
      doc.text(entry.busNumber || "-", 80, y);
      doc.text(entry.routeName || "-", 110, y);
      doc.text(entry.units.toString(), 170, y);
      y += 7;
    });

    y += 10;
    doc.text(`Total Units: ${totalDutyUnits}`, 20, y);
    y += 8;
    doc.text(`Net Salary: ₹${totalSalary.toLocaleString()}`, 20, y);

    doc.save(`${currentDriver.username}_${selectedMonth}.pdf`);
  };

  // Calendar Days Array
  const daysInMonth = new Date(
    selectedMonth.split("-")[0],
    selectedMonth.split("-")[1],
    0
  ).getDate();

  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => {
    const day = String(i + 1).padStart(2, "0");
    const fullDate = `${selectedMonth}-${day}`;
    const record = monthlyData.find((a) => a.date === fullDate);

    return { date: fullDate, day: i + 1, record };
  });

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">

        <div className="bg-indigo-700 text-white p-6 flex justify-between">
          <h2>Welcome, {currentDriver.username}</h2>
          <button onClick={logout}>Logout</button>
        </div>

        <div className="p-6">

          <div className="flex justify-center gap-6 mb-6">
            <div className="w-36 h-36 rounded-full bg-blue-100 flex flex-col items-center justify-center shadow-lg">
              <p className="text-3xl font-bold text-blue-700">
                {totalDutyUnits}
              </p>
              <p className="text-sm text-gray-600">Total Duty Units</p>
            </div>
            <div className="w-36 h-36 rounded-full bg-red-100 flex flex-col items-center justify-center shadow-lg">
              <p className="text-3xl font-bold text-red-600">
                {absentDays}
              </p>
              <p className="text-sm text-gray-600">Absent Days</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6 text-center">
            <div className="bg-gray-100 p-3 rounded-xl">
              <p className="font-bold">{monthlyData.length}</p>
              <p className="text-xs">Records</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-xl">
              <p className="font-bold">₹{ratePerUnit}</p>
              <p className="text-xs">Rate</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-xl">
              <p className="font-bold">₹{totalSalary.toLocaleString()}</p>
              <p className="text-xs">Salary</p>
            </div>
          </div>

          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full p-3 border rounded-xl mb-4"
          />

          <div className="space-y-3 mb-6">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-3 border rounded-xl"
            />

            <select
              value={dutyType}
              onChange={(e) => setDutyType(e.target.value)}
              className="w-full p-3 border rounded-xl"
            >
              <option value="P">Present (1)</option>
              <option value="DD">Double Duty (2)</option>
              <option value="OT">Overtime (2.5)</option>
              <option value="A">Absent (0)</option>
            </select>

            <input
              type="text"
              placeholder="Bus Number"
              value={busNumber}
              onChange={(e) => setBusNumber(e.target.value)}
              className="w-full p-3 border rounded-xl"
            />

            <input
              type="text"
              placeholder="Route Name"
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
              className="w-full p-3 border rounded-xl"
            />

            <button
              onClick={saveAttendance}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl"
            >
              Save Attendance
            </button>
          </div>

          <button
            onClick={generatePDF}
            className="w-full bg-emerald-500 text-white py-3 rounded-xl mb-6"
          >
            Download Salary Slip
          </button>

          <h3 className="font-bold mb-3">Monthly Attendance</h3>

          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day) => (
              <div
                key={day.date}
                className="border rounded-lg p-2 text-xs bg-gray-50 min-h-[80px]"
              >
                <p className="font-bold text-gray-700">{day.day}</p>

                {day.record ? (
                  <>
                    <p className="text-blue-600 font-semibold">
                      {day.record.duty}
                    </p>
                    <p className="text-gray-600 truncate">
                      {day.record.routeName || "-"}
                    </p>
                    <p className="text-gray-500 truncate">
                      {day.record.busNumber || "-"}
                    </p>
                  </>
                ) : (
                  <p className="text-gray-300">-</p>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}