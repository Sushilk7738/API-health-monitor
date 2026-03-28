import { useEffect, useState } from "react";
import { BASE_URL } from "../api/config";
import ApiCard from "../components/ApiCard";
import StatCard from '../components/StatCard'
import {useNavigate} from "react-router-dom";


const Dashboard = ()=>{
    const [apis, setApis] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingCheck, setLoadingCheck] = useState(false);
    const [checkingIds, setCheckingIds] = useState([]);
    const [error, setError] = useState(null);
    const [lastUpdated , setLastUpdated] = useState(null);

    const navigate = useNavigate()
    
    const total = apis.length;
    const up = apis.filter(api => api.status === "UP").length;
    const down = apis.filter(api => api.status === "DOWN").length;

    
    useEffect(() => {
        const token = localStorage.getItem("token");
        

        if (!token) {
            navigate("/login");
            return;
        }

        const fetchData = () => {
            fetch(`${BASE_URL}/status`, {
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
                    fetch(`${BASE_URL}/check/${api.id}/`, {
                        headers: {
                            Authorization :`Bearer ${token}`
                        },
                    })
            )
            );

            const res =await fetch(`${BASE_URL}/status`, {
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
    
    
    
    return(
        <div className="p-4 sm:p-6 lg:p-8 space-y-4">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap">
                <h1 className="text-white text-2xl sm:text-3xl font-bold">
                    API Dashboard
                </h1>
                
                <button
                    onClick={handleCheckNow}
                    disabled={loadingCheck}
                    className="mb-4 bg-blue-500 px-4 py-2 rounded text-white disabled:opacity-50"
                >
                    {loadingCheck ? "Checking...." : "Check Now"}
                </button>

            </div>
            {lastUpdated && (
                <p className="text-gray-400 text-sm">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
            )}

            {apis.length === 0 && (
                <div className="flex flex-col items-center justify-center text-gray-400 py-10">
                    <p className="text-lg mb-2">No APIs added</p>
                    <p className="text-sm">Start by adding an API to monitor</p>
                </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <StatCard title="Total APIs" value={total} color="text-blue-400" icon="🚀" />
                <StatCard title="APIs UP" value={up} color="text-green-400" icon="🟢" />
                <StatCard title="APIs DOWN" value={down} color="text-red-400" icon="🔴" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ">
                {apis.map((api) =>(
                    <ApiCard
                        key={api.id}
                        name={api.name}
                        status={api.status}
                        responseTime={
                            api.response_time ? api.response_time.toFixed(2) + "s" : "--"
                        }
                        lastChecked={
                            api.last_checked
                                ? new Date(api.last_checked).toLocaleString()
                                : "--"
                        }
                        isChecking = {checkingIds.includes(api.id)}
                    />
                ))}
            </div>
        </div>
    )
}

export default Dashboard;