


import React, { useState, useEffect, useMemo } from "react";
import "./Login.css";
import { jsPDF } from "jspdf";

const STATUS_OPTIONS = ["Present", "Absent", "12hrs", "OT", "DD", "3D", "4D"];

const RATE_MULTIPLIER = {
  Present: 1,
  Absent: 0,
  "12hrs": 1.5,
  OT: 2.5,
  DD: 2,
  "3D": 3,
  "4D": 4,
};

export default function AttendancePage({ user, onLogout }) {
  const empName = user?.name || user?.username || "Employee";
  const empId = user?.empId || user?.username;

  const [dailyRate, setDailyRate] = useState(800);
  const [month, setMonth] = useState("2026-01");
  const [selectedDate, setSelectedDate] = useState("2026-01-01");
  const [attendance, setAttendance] = useState({});
  const [pendingChanges, setPendingChanges] = useState({});

  const daysInMonth = useMemo(() => {
    const [y, m] = month.split("-").map(Number);
    const count = new Date(y, m, 0).getDate();
    return Array.from({ length: count }, (_, i) => i + 1);
  }, [month]);

  const formatDate = (d) => `${month}-${String(d).padStart(2, "0")}`;

  // dropdown change -> pendingChanges
  const handleSelectChange = (day, value) => {
    const dateStr = `${month}-${String(day).padStart(2, "0")}`;
    setPendingChanges((prev) => ({ ...prev, [dateStr]: value }));
  };

  const handleSaveDay = (day) => {
    const dateStr = `${month}-${String(day).padStart(2, "0")}`;
    const newValue = pendingChanges[dateStr];

    if (newValue !== undefined) {
      setAttendance((prev) => ({ ...prev, [dateStr]: newValue }));
      setPendingChanges((prev) => {
        const updated = { ...prev };
        delete updated[dateStr];
        return updated;
      });
    }
  };

  // Quick update also goes through pendingChanges
  const handleQuickUpdate = (status) => {
    setPendingChanges((prev) => ({ ...prev, [selectedDate]: status }));
  };

  // Load saved data
  useEffect(() => {
  if (!empId) return; // 🔥 prevent running before user restored

  const key = `svpayAttendance_${empId}_${month}`;
  const saved = localStorage.getItem(key);
  if (saved !== null) {
    setAttendance(JSON.parse(saved));
  } else {
    setAttendance({});
  }

  setPendingChanges({});
}, [month, empId]);

  // Save automatically
  useEffect(() => {
  if (!empId) return; // 🔥 prevent overwriting with undefined key
  if (Object.keys(attendance).length === 0) return;
    const key = `svpayAttendance_${empId}_${month}`;
  localStorage.setItem(key, JSON.stringify(attendance));
}, [attendance, empId, month]);

  // Stats
  const stats = useMemo(() => {
    let present = 0;
    let absent = 0;
    let twelveHrs = 0;
    let ot = 0;
    let dd = 0;
    let threeD = 0;
    let fourD = 0;

    Object.values(attendance).forEach((status) => {
      if (status === "Present") present++;
      else if (status === "Absent") absent++;
      else if (status === "12hrs") twelveHrs++;
      else if (status === "OT") ot++;
      else if (status === "DD") dd++;
      else if (status === "3D") threeD++;
      else if (status === "4D") fourD++;
    });
    const workedDays =
    present + twelveHrs + ot + dd + threeD + fourD;

    let weekOff = 0;
    let casualLeave = 0;

    if (workedDays >= 24) {
      weekOff = 4;
      casualLeave = 1;
    } else {
      weekOff = Math.floor(workedDays / 7);
      casualLeave = 0;
    }

    const dutyUnits =
      present * RATE_MULTIPLIER.Present +
      twelveHrs * RATE_MULTIPLIER["12hrs"] +
      ot * RATE_MULTIPLIER.OT +
      dd * RATE_MULTIPLIER.DD +
      threeD * RATE_MULTIPLIER["3D"] +
      fourD * RATE_MULTIPLIER["4D"];

    const extraUnits = weekOff + casualLeave;
    const totalUnits = dutyUnits + extraUnits;
    const totalPayable = totalUnits * dailyRate;


    return {
      present,
      absent,
      twelveHrs,
      ot,
      dd,
      threeD,
      fourD,
      workedDays,
      weekOff,
      casualLeave,
      dutyUnits,
      totalPayable,
    };
  }, [attendance, dailyRate]);

  const handleDownloadPayslip = () => {
    const doc = new jsPDF();

    const logoUrl = "/logo.png";
    try {
      doc.addImage(logoUrl, "PNG", 15, 10, 30, 30);
    } catch (e) {
      console.warn("Logo load failed, PDF without logo", e);
    }
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("SVPAY - Monthly Payslip", 105, 20, { align: "center" });

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Employee Name: ${empName}`, 15, 40);
    doc.text(`Employee ID: ${empId}`, 15, 48);
    doc.text(`Month: ${month}`, 15, 56);
    doc.text(`Daily Rate: ₹${dailyRate}`, 15, 64);

    let y = 80;

    doc.setFont("helvetica", "bold");
    doc.text("Earnings Breakdown", 15, y);
    y += 10;

    const addRow = (label, units, rate, amount) => {
      doc.setFont("helvetica", "normal");
      doc.text(label, 15, y);
      doc.text(String(units), 80, y);
      doc.text(rate, 120, y);
      doc.text(`₹${amount.toFixed(2)}`, 160, y);
      y += 8;
    };

    addRow("Regular", stats.present, `₹${dailyRate}`, stats.present * dailyRate);
    addRow("12hrs", stats.twelveHrs, "1.5x", stats.twelveHrs * RATE_MULTIPLIER["12hrs"] * dailyRate);
    addRow("Overtime", stats.ot, "2.5x", stats.ot * RATE_MULTIPLIER.OT * dailyRate);
    addRow("Double Duty", stats.dd, "2x", stats.dd * RATE_MULTIPLIER.DD * dailyRate);
    addRow("3 Duty", stats.threeD, "3x", stats.threeD * RATE_MULTIPLIER["3D"] * dailyRate);
    addRow("4 Duty", stats.fourD, "4x", stats.fourD * RATE_MULTIPLIER["4D"] * dailyRate);
    addRow("Week Off Earned", stats.weekOff, `₹${dailyRate}`, stats.weekOff * dailyRate);
    addRow("Casual Leave", stats.casualLeave, `₹${dailyRate}`, stats.casualLeave * dailyRate);

    y += 5;
    doc.setFont("helvetica", "bold");
    doc.text(`Net Payable: ₹${stats.totalPayable.toFixed(2)}`, 15, y);

    doc.save(`Payslip-${month}-${empId}.pdf`);
  };

    
  return (
    <div className="app-shell">
      {!user ? (
        <div className="card">No user selected.</div>
      ) : (
        <div className="card">
          {/* LEFT COLUMN */}
          <div>
            <div className="header-bar">
              <div className="brand">
                <div className="brand-badge">SV</div>
                <span className="brand-title">SVPAY</span>
              </div>
              <button className="logout-btn" onClick={onLogout}>
                ⏏ Logout
              </button>
            </div>

            <div className="profile-card">
              <div className="profile-row">
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div className="avatar">
                    <div className="avatar-inner">
                      {empName
                        .split(" ")
                        .map((p) => p[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>
                      {empName}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>
                      ID: {empId}
                    </div>
                  </div>
                </div>
                <span className="chip">Active</span>
              </div>

              <div className="profile-meta">
                <div className="badge-pill">
                  <span>💲</span>
                  <span>
                    Rate&nbsp;
                    <input
                      className="rate-input"
                      type="number"
                      value={dailyRate}
                      onChange={(e) =>
                        setDailyRate(Number(e.target.value || 0))
                      }
                    />
                  </span>
                </div>
                <div className="badge-pill">
                  <span>📅</span>
                  <span>
                    Month&nbsp;
                    <input
                      type="month"
                      value={month}
                      onChange={(e) => {
                        const newMonth = e.target.value;
                        setMonth(newMonth);
                        setSelectedDate(`${newMonth}-01`);
                      }}
                      className="rate-input"
                      style={{ width: 120 }}
                    />
                  </span>
                </div>
              </div>

              <div className="circle-row">
                <div className="circle-card">
                  <div className="circle-label">Total Salary</div>
                  <div className="circle-value">
                    ₹{stats.totalPayable.toFixed(2)}
                  </div>
                </div>
                <div className="circle-card">
                  <div className="circle-label">Duty Units</div>
                  <div className="circle-value">
                    {stats.dutyUnits.toFixed(2)}
                  </div>
                </div>
                <div className="circle-card">
                  <div className="circle-label">Absent Days</div>
                  <div className="circle-value">{stats.absent}</div>
                </div>
              </div>

              <div className="stat-grid">
                <div className="stat-pill">
                  <div className="stat-label">Present</div>
                  <div className="stat-value ok">{stats.present}</div>
                </div>
                <div className="stat-pill">
                  <div className="stat-label">12hrs</div>
                  <div className="stat-value">{stats.twelveHrs}</div>
                </div>
                <div className="stat-pill">
                  <div className="stat-label">OT Days</div>
                  <div className="stat-value">{stats.ot}</div>
                </div>
                <div className="stat-pill">
                  <div className="stat-label">Double Duty</div>
                  <div className="stat-value">{stats.dd}</div>
                </div>
              </div>
            </div>

            <div className="section-title">
              <span>⚡ Quick date update</span>
            </div>

            <div className="quick-row">
              <input
                type="date"
                className="date-input"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div className="chip-toggle-group">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  className={
                    "chip-toggle" +
                    (pendingChanges[selectedDate] === s ||
                    attendance[selectedDate] === s
                      ? " active"
                      : "")
                  }
                  onClick={() => handleQuickUpdate(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="panel-right">
            <div className="calendar-card">
              <div className="calendar-header">
                <div>
                  <div className="month-title">Monthly Attendance</div>
                  <div className="sub">
                    {month} · {stats.dutyUnits.toFixed(2)} duty units
                  </div>
                </div>
                <span className="month-badge">{daysInMonth.length} days</span>
              </div>

              <div className="week-row">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
                  gap: 4,
                }}
              >
                {daysInMonth.map((day) => {
                  const dateStr = formatDate(day);
                  const currentValue = attendance[dateStr] || "";
                  const pendingValue = pendingChanges[dateStr];
                  const displayValue =
                    pendingValue !== undefined ? pendingValue : currentValue;
                  const hasUnsaved = pendingValue !== undefined;

                  return (
                    <div key={day} className="day-cell">
                      <div className="day-label">{day}</div>
                      <select
                        className="day-select"
                        value={displayValue}
                        onChange={(e) =>
                          handleSelectChange(day, e.target.value)
                        }
                      >
                        <option value="">-</option>
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>

                      {hasUnsaved && (
                        <button
                          className="btn-save-day"
                          onClick={() => handleSaveDay(day)}
                        >
                          💾 Save
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="payslip-card">
              <div className="payslip-header">
                <div>
                  <div className="month-title">Payslip Preview</div>
                  <div className="sub">Auto-calculated from attendance</div>
                </div>
                <button className="btn-primary" onClick={handleDownloadPayslip}>
                  📄 Download PDF
                </button>
              </div>

              <div className="payslip-summary">
                <span className="tag">Rate: ₹{dailyRate}</span>
                <span className="tag">
                  Duty units: {stats.dutyUnits.toFixed(2)}
                </span>
                <span className="tag">
                  Total: ₹{stats.totalPayable.toFixed(2)}
                </span>
              </div>

              <table className="payslip-table">
                <thead>
                  <tr>
                    <th>Earning</th>
                    <th>Units</th>
                    <th>Rate</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Regular</td>
                    <td>{stats.present}</td>
                    <td>₹{dailyRate}</td>
                    <td>₹{(stats.present * dailyRate).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>12hrs</td>
                    <td>{stats.twelveHrs}</td>
                    <td>1.5x</td>
                    <td>
                      ₹
                      {(
                        stats.twelveHrs *
                        RATE_MULTIPLIER["12hrs"] *
                        dailyRate
                      ).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td>Overtime</td>
                    <td>{stats.ot}</td>
                    <td>2.5x</td>
                    <td>
                      ₹
                      {(
                        stats.ot * RATE_MULTIPLIER.OT * dailyRate
                      ).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td>Double duty</td>
                    <td>{stats.dd}</td>
                    <td>2x</td>
                    <td>
                      ₹
                      {(
                        stats.dd * RATE_MULTIPLIER.DD * dailyRate
                      ).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td>3 Duty (3D)</td>
                    <td>{stats.threeD}</td>
                    <td>3x</td>
                    <td>
                      ₹
                      {(
                        stats.threeD * RATE_MULTIPLIER["3D"] * dailyRate
                      ).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td>4 Duty (4D)</td>
                    <td>{stats.fourD}</td>
                    <td>4x</td>
                    <td>
                      ₹
                      {(
                        stats.fourD * RATE_MULTIPLIER["4D"] * dailyRate
                      ).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="payslip-footer">
                <span>Net Payable</span>
                <span style={{ fontWeight: 600 }}>
                  ₹{stats.totalPayable.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
