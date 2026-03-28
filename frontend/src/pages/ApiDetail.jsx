import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../api/config";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from "recharts";
import { useNavigate } from "react-router-dom";


const ApiDetail = ()=>{
    const { id } = useParams()
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [logs, setLogs] = useState([]);
    const [apiName, setApiName] = useState("");
    const [range, setRange] = useState('1h');

    const navigate = useNavigate();

    useEffect(() => {
    const token = localStorage.getItem("token");

    setLoading(true);

    let query = "";

    if (range === "1h") {
        query = "?hours=1";
    } else if (range === "24h") {
        query = "?days=1";
    } else if (range === "7d") {
        query = "?days=7";
    }

    // start
    const timer = setTimeout(() => {

        // stats
        fetch(`${BASE_URL}/stats/${id}${query}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(res => {
            if (!res.ok) throw new Error("API failed");
            return res.json();
        })
        .then(data => {
            setStats(data);
            setLoading(false);
        })
        .catch(err => {
            console.log(err);
            setLoading(false);
        });

        // logs

        fetch(`${BASE_URL}/logs/?api=${id}${query}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) {
                setLogs(data);

                if (data.length > 0 && data[0].api_name) {
                    setApiName(data[0].api_name);
                }
            } else {
                setLogs([]);
            }
        })
        .catch(err => console.log(err));

    }, 300);

    // cleanup
        return () => clearTimeout(timer);

    }, [id, range]);
    
    if (loading) {
        return <div className="text-white p-6">Loading....</div>
    }

    const safeLogs = Array.isArray(logs) ? logs : [];
    const recentLogs = safeLogs;

    const chartData = recentLogs.map((log, index)=>({
        time: new Date(log.checked_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}),
        response:log.response_time,
    }))
    
    
    return(
        <div className="text-white p-6">
            <h1 className="text-2xl font-bold mb-2">
                {apiName || "API Detail"}
            </h1>

            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 hover:scale-105 text-white px-4 py-2 rounded-lg transition-all duration-200 mb-4 border border-gray-700"
            >
                <span className="text-lg">←</span>
                <span className="text-sm font-medium">Back to Dashboard</span>
            </button>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

                <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Total Checks</p>
                    <h2 className="text-xl font-bold">{stats?.total_checks}</h2>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Success</p>
                    <h2 className="text-green-400 text-xl font-bold">{stats?.success_checks}</h2>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Failures</p>
                    <h2 className="text-red-400 text-xl font-bold">{stats?.failures}</h2>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Uptime</p>
                    <h2 className="text-blue-400 text-xl font-bold">{stats?.uptime_percentage}%</h2>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Avg Response</p>
                    <h2 className="text-yellow-400 text-xl font-bold">
                        {stats?.avg_response_time?.toFixed(2)}s
                    </h2>
                </div>

        </div>

        <div className="flex justify-between items-center mt-6">
            <h2 className="text-lg font-semibold text-white mt-6">
                Performance Trend
            </h2>

            <select
                value={range}
                onChange={(e)=>{
                    setRange(e.target.value);
                    console.log(e.target.value);
                }}
                className="bg-gray-800 text-white text-sm px-3 py-2 rounded-lg border border-gray-700 focus:outline-none"
            >
                <option value="1h">Last 1 Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
            </select>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg mt-8 w-full">
            <p className="text-gray-400 mb-2">Response Time Trend</p>
            {chartData.length > 0 && (
                <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <XAxis dataKey="time" />
                            <YAxis />
                            <Tooltip/>
                            <Line 
                                type="monotone" 
                                dataKey="response" 
                                stroke="#22c55e"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    </div>
    )
}

export default ApiDetail;