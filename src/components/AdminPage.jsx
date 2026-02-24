import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminPage() {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState(() => {
  const storedDrivers = localStorage.getItem("drivers");
  return storedDrivers ? JSON.parse(storedDrivers) : [];
});
const navigate = useNavigate();
const [newDriverName, setNewDriverName] = useState("");

useEffect(() => {
  localStorage.setItem("drivers", JSON.stringify(drivers));
}, [drivers]);
  const addDriver = () => {
    if (!newDriverName.trim()) return;


    const newDriver = {
      id: Date.now(),
      name: newDriverName.trim(),
      username: newDriverName.toLowerCase().replace(/\s+/g, ''),
      password: '1234'
    };
    setDrivers([...drivers, newDriver]);
    setNewDriverName('');
  };

  const deleteDriver = (id) => {
    setDrivers(drivers.filter(d => d.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-white mb-12 text-center bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
          SVPay Admin - Manage Drivers
        </h1>

        {/* Add Driver Form */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 mb-12 border border-white/20 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end mb-8">
            <input
              type="text"
              placeholder="Driver Full Name"
              value={newDriverName}
              onChange={(e) => setNewDriverName(e.target.value)}
              className="flex-1 p-6 text-xl bg-white/20 text-white border-2 border-white/30 rounded-2xl focus:border-yellow-400"
              onKeyPress={(e) => e.key === 'Enter' && addDriver()}
            />
            <span className="text-lg text-gray-300 md:col-span-2">
              Username: {newDriverName.toLowerCase().replace(/\s+/g, '') || 'auto'} | Password: 1234
            </span>
          </div>
          <button
            onClick={addDriver}
            className="w-full p-6 bg-yellow-600 hover:bg-yellow-700 text-xl font-bold text-white rounded-2xl shadow-xl"
          >
            Add Driver
          </button>
        </div>

        {/* Drivers List */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          <h3 className="text-3xl font-bold text-white mb-8">Drivers List ({drivers.length})</h3>
          <div className="space-y-4">
            {drivers.map(driver => (
              <div key={driver.id} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl hover:bg-white/10 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center font-bold text-white text-xl">
                    {driver.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white">{driver.name}</p>
                    <p className="text-indigo-300">@{driver.username} / 1234</p>
                  </div>
                </div>
                <button
                  onClick={() => deleteDriver(driver.id)}
                  className="p-3 bg-red-500/70 hover:bg-red-600 text-white rounded-xl font-bold transition-all hover:scale-105"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => navigate('/')}
            className="px-12 py-4 bg-gray-600 hover:bg-gray-700 text-xl font-bold text-white rounded-2xl"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
