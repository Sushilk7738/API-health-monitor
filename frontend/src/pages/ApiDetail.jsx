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

    const navigate = useNavigate();

    useEffect(()=> {
        const token = localStorage.getItem("token");

        fetch(`${BASE_URL}/stats/${id}`, {
            headers: {
                Authorization : `Bearer ${token}`,
            },
        })
        .then(res => res.json())
        .then(data => {
            setStats(data);
            setLoading(false);
        })
        .catch(err =>{
            console.log(err);
            setLoading(false);
        })
    }, [id]);

    if (loading) {
        return <div className="text-white p-6">Loading....</div>
    }

    const chartData = [
        { time: "1", response: 0.5 },
        { time: "2", response: 1.2 },
        { time: "3", response: 0.8 },
        { time: "4", response: 2.1 },
    ];
    
    
    return(
        <div className="text-white p-6">

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
                    <h2 className="text-xl font-bold">{stats.total_checks}</h2>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Success</p>
                    <h2 className="text-green-400 text-xl font-bold">{stats.success_checks}</h2>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Failures</p>
                    <h2 className="text-red-400 text-xl font-bold">{stats.failures}</h2>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Uptime</p>
                    <h2 className="text-blue-400 text-xl font-bold">{stats.uptime_percentage}%</h2>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-gray-400 text-sm">Avg Response</p>
                    <h2 className="text-yellow-400 text-xl font-bold">
                        {stats.avg_response_time?.toFixed(2)}s
                    </h2>
                </div>

        </div>

        <h2 className="text-lg font-semibold text-white mt-6">
            Performance Trend
        </h2>
        
        <div className="bg-gray-800 p-4 rounded-lg mt-8">
            <p className="text-gray-400 mb-2">Response Time Trend</p>

            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip/>
                        <Line type="monotone" dataKey="response" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
    )
}

export default ApiDetail;