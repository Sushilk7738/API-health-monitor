import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../api/config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
LineChart,
Line,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer,
} from "recharts";

const ApiDetail = () => {
const { id } = useParams();
const navigate = useNavigate();

const [stats, setStats] = useState({});
const [logs, setLogs] = useState([]);
const [loading, setLoading] = useState(true);
const [range, setRange] = useState("1h");

const token = localStorage.getItem("token");

// 🔹 FETCH DATA
const fetchData = async () => {
    try {
    setLoading(true);

    let query = "";
    if (range === "1h") query = "hours=1";
    if (range === "24h") query = "hours=24";
    if (range === "7d") query = "days=7";

    // Stats
    const statsRes = await fetch(
        `${BASE_URL}/api/stats/${id}?${query}`,
        {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        }
    );

    const statsData = await statsRes.json();
    setStats(statsData);

    // Logs
    const logsRes = await fetch(
        `${BASE_URL}/api/logs/?api=${id}&${query}`,
        {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        }
    );

    const logsData = await logsRes.json();
    setLogs(logsData);

    } catch (err) {
    console.log(err);
    toast.error("Failed to fetch data ❌");
    } finally {
    setLoading(false);
    }
};

useEffect(() => {
    fetchData();
}, [range]);

// 🔹 GROUP BY DAY
const groupByDay = (logs) => {
    const grouped = {};

    logs.forEach((log) => {
    const date = new Date(log.checked_at).toLocaleDateString();

    if (!grouped[date]) grouped[date] = [];

    grouped[date].push(log);
    });

    return Object.keys(grouped).map((date) => {
    const logsForDay = grouped[date];

    const avg =
        logsForDay.reduce((sum, l) => sum + l.response_time, 0) /
        logsForDay.length;

    return {
        time: date,
        response_time: avg,
    };
    });
};

// 🔹 GROUP BY HOUR
const groupByHour = (logs) => {
    const grouped = {};

    logs.forEach((log) => {
    const date = new Date(log.checked_at);
    const key = `${date.getHours()}:00`;

    if (!grouped[key]) grouped[key] = [];

    grouped[key].push(log);
    });

    return Object.keys(grouped).map((hour) => {
    const logsForHour = grouped[hour];

    const avg =
        logsForHour.reduce((sum, l) => sum + l.response_time, 0) /
        logsForHour.length;

    return {
        time: hour,
        response_time: avg,
    };
    });
};

// CHART DATA 
let chartData = [];

if (range === "1h") {
    chartData = logs.slice(-50).map((log) => ({
    time: new Date(log.checked_at).toLocaleTimeString(),
    response_time: log.response_time,
    }));
} else if (range === "24h") {
    chartData = groupByHour(logs);
} else if (range === "7d") {
    chartData = groupByDay(logs);
}

// SORT 
chartData.sort((a, b) => new Date(a.time) - new Date(b.time));

if (loading) {
    return <p className="text-white text-center mt-10">Loading...</p>;
}

return (
    <div className="p-6 text-white">

    <div className="flex justify-end mb-4">
        <button
            onClick={() => navigate(`/edit-api/${id}/`)}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm"
        >
            Edit API
        </button>
    </div>

    {/* STATS */}
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-6">

    <div className="bg-gray-800 p-5 rounded-xl hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer">
        <p className="text-gray-400 text-sm">Total Checks</p>
        <h2 className="text-2xl font-bold mt-1">{stats.total_checks}</h2>
    </div>

    <div className="bg-gray-800 p-5 rounded-xl hover:scale-105 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300 cursor-pointer">
        <p className="text-gray-400 text-sm">Success</p>
        <h2 className="text-2xl font-bold text-green-400 mt-1">
        {stats.success_checks}
        </h2>
    </div>

    <div className="bg-gray-800 p-5 rounded-xl hover:scale-105 hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300 cursor-pointer">
        <p className="text-gray-400 text-sm">Failures</p>
        <h2 className="text-2xl font-bold text-red-400 mt-1">
        {stats.failures}
        </h2>
    </div>

    <div className="bg-gray-800 p-5 rounded-xl hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/20 transition-all duration-300 cursor-pointer">
        <p className="text-gray-400 text-sm">Uptime</p>
        <h2 className="text-2xl font-bold text-yellow-400 mt-1">
        {stats.uptime_percentage}%
        </h2>
    </div>

    
    
    </div>
    {/* FILTER */}
    <div className="flex justify-end mb-4">
        <select
        className="bg-gray-800 p-2 rounded"
        value={range}
        onChange={(e) => setRange(e.target.value)}
        >
        <option value="1h">Last 1 Hour</option>
        <option value="24h">Last 24 Hours</option>
        <option value="7d">Last 7 Days</option>
        </select>
    </div>

    {/* CHART */}
    <div className="bg-gray-800 p-4 rounded h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
            <XAxis dataKey="time" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Line
            type="monotone"
            dataKey="response_time"
            stroke="#22c55e"
            />
        </LineChart>
        </ResponsiveContainer>
    </div>

    </div>
);
};

export default ApiDetail;