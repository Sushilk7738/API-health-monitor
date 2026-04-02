import { useEffect, useState } from "react";
import { BASE_URL } from "../api/config";
import ApiCard from "../components/ApiCard";
import StatCard from '../components/StatCard'
import {useNavigate} from "react-router-dom";
import { toast } from "react-toastify";


const Dashboard = ()=>{
    const [apis, setApis] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingCheck, setLoadingCheck] = useState(false);
    const [checkingIds, setCheckingIds] = useState([]);
    const [error, setError] = useState(null);
    const [lastUpdated , setLastUpdated] = useState(null);
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState("ALL");


    const navigate = useNavigate()
    
    const total = apis.length;
    const up = apis.filter(api => api.status === "UP").length;
    const down = apis.filter(api => api.status === "DOWN").length;

    
    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log("REAL APIs:", apis);

        if (!token) {
            navigate("/login");
            return;
        }

        const fetchData = () => {
            fetch(`${BASE_URL}/api/status/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                if (res.status === 401) {
                    localStorage.removeItem("token");
                    window.location.href = "/login";
                    return null;
                }
                return res.json();
            })
            .then((data) => {
                if (!data || !Array.isArray(data)) return;
                setApis(data);
                setLastUpdated(new Date());
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("Failed to load APIs");
                setLoading(false);
            });
        };

        fetchData(); // first load

        const interval = setInterval(fetchData, 10000); // every 10 sec

        return () => clearInterval(interval); // cleanup
    }, []);
    
    if (loading) {
        return(
            <div className="flex justify-center items-center h-40 text-gray-400">
                Loading APIs...
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-40 text-red-400">
                {error}
            </div>
        );
    }


    const handleCheckNow = async ()=>{
        const token = localStorage.getItem("token");
        setLoadingCheck(true);
        setCheckingIds(apis.map(api => api.id));

        try{
            await Promise.all(
                apis.map((api) =>
                    fetch(`${BASE_URL}/api/check/${api.id}/`, {
                        headers: {
                            Authorization :`Bearer ${token}`
                        },
                    })
            )
            );

            const res =await fetch(`${BASE_URL}/api/status/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })

            const data = await res.json();
            setApis(data);
        } 
        catch (err) {
            console.error(err);   
        }
        finally {
            setLoadingCheck(false);
            setCheckingIds([]);
        }
    }

    
    const handleToggle = (id, newValue) => {
        setApis((prev) =>
            prev.map((api) =>
                api.id === id ? { ...api, keep_alive: newValue } : api
            )
        );
    };
    
    
    return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 text-white">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate__animated animate__fadeInDown">

        <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
            API Dashboard
            </h1>
            <p className="text-gray-400 text-sm">
            Monitor API performance and uptime
            </p>
        </div>

        <div className="flex gap-2">
            <button
            onClick={handleCheckNow}
            disabled={loadingCheck}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white transition duration-200 hover:scale-105"
            >
            {loadingCheck ? "Checking..." : "Check Now"}
            </button>

            <button
            onClick={() => navigate("/add-api")}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white transition duration-200 hover:scale-105"
            >
            Add API
            </button>
        </div>
        </div>
        

        {/* Insights Panel */}
        <div className="grid sm:grid-cols-3 gap-4 animate__animated animate__fadeInUp">

        <div className="bg-gray-800 p-4 rounded-xl hover:shadow-lg hover:shadow-blue-500/20 transition">
            <p className="text-gray-400 text-sm">System Health</p>
            <h2 className={`text-lg font-semibold mt-1 ${down > 0 ? "text-red-400" : "text-green-400"}`}>
            {down > 0 ? "Issues detected" : "All systems operational"}
            </h2>
        </div>

        <div className="bg-gray-800 p-4 rounded-xl hover:shadow-lg hover:shadow-yellow-500/20 transition">
            <p className="text-gray-400 text-sm">Last Updated</p>
            <h2 className="text-lg font-semibold mt-1">
            {lastUpdated ? lastUpdated.toLocaleTimeString() : "--"}
            </h2>
        </div>

        <div className="bg-gray-800 p-4 rounded-xl hover:shadow-lg hover:shadow-purple-500/20 transition">
            <p className="text-gray-400 text-sm">Failure Rate</p>
            <h2 className="text-lg font-semibold mt-1">
            {total > 0 ? ((down / total) * 100).toFixed(1) : 0}%
            </h2>
        </div>

        </div>


        <div className="flex flex-col sm:flex-row gap-3">
            <input 
                type="text" 
                placeholder="Search APIs..."
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
                className="bg-gray-800 p-2 rounded w-full sm:w-1/3 text-white"
            />

            <select 
                value={statusFilter}
                onChange={(e)=> setStatusFilter(e.target.value)}
                className="bg-gray-800 p-2 rounded text-white"
            >
                <option value="ALL">All</option>
                <option value="UP">UP</option>
                <option value="DOWN">DOWN</option>
            </select>
        </div>


        

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

        <div className="bg-gray-800 p-5 rounded-xl hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer animate__animated animate__zoomIn">
            <p className="text-gray-400 text-sm">Total APIs</p>
            <h2 className="text-2xl font-bold text-blue-400 mt-1">
            {total}
            </h2>
        </div>

        <div className="bg-gray-800 p-5 rounded-xl hover:scale-105 hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300 cursor-pointer animate__animated animate__zoomIn">
            <p className="text-gray-400 text-sm">APIs UP</p>
            <h2 className="text-2xl font-bold text-green-400 mt-1">
            {up}
            </h2>
        </div>

        <div className="bg-gray-800 p-5 rounded-xl hover:scale-105 hover:shadow-lg hover:shadow-red-500/20 transition-all duration-300 cursor-pointer animate__animated animate__zoomIn">
            <p className="text-gray-400 text-sm">APIs DOWN</p>
            <h2 className="text-2xl font-bold text-red-400 mt-1">
            {down}
            </h2>
        </div>

        </div>

        {/* Empty State */}
        {apis.length === 0 && (
        <div className="flex flex-col items-center justify-center text-gray-400 py-16 bg-gray-800 rounded-xl animate__animated animate__fadeIn">
            <p className="text-lg font-semibold mb-1">
            No APIs available
            </p>
            <p className="text-sm mb-4 text-gray-500">
            Add your first API to start monitoring
            </p>

            <button
            onClick={() => navigate("/add-api")}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm transition hover:scale-105"
            >
            Add API
            </button>
        </div>
        )}

        {/* API Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {apis
        .filter((api) =>
            api.name.toLowerCase().includes(search.toLowerCase())
        )
        .filter((api) =>
            statusFilter === "ALL" ? true : api.status === statusFilter
        )
        .map((api) =>  (
            <div className="animate__animated animate__fadeInUp" key={api.id}>
            <ApiCard
                id={api.id}
                name={api.name}
                status={api.status}
                keep_alive={api.keep_alive}
                onToggle = {handleToggle}
                responseTime={
                api.response_time ? api.response_time.toFixed(2) + "s" : "--"
                }
                lastChecked={
                api.last_checked
                    ? new Date(api.last_checked).toLocaleString()
                    : "--"
                }
                isChecking={checkingIds.includes(api.id)}
                onDelete={(id) => {
                setApis((prev) => prev.filter((a) => a.id !== id));
                }}
            />
            </div>
        ))}
        </div>

    </div>
);
}

export default Dashboard;