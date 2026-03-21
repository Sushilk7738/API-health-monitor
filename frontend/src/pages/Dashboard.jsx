import { useEffect, useState } from "react";
import { BASE_URL } from "../api/config";
import ApiCard from "../components/ApiCard";
import StatCard from '../components/StatCard'
import {useNavigate} from "react-router-dom";


const Dashboard = ()=>{
    const [apis, setApis] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()
    
    const total = apis.length
    const up = apis.filter(api => api.is_active).length;
    const down = apis.filter(api => !api.is_active).length;

    useEffect(()=>{
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        fetch(`${BASE_URL}/apis/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((res) =>{
            if (res.status === 401) {
                localStorage.removeItem("token");
                window.location.href ="/login";
                return null;
            }
            return res.json()
        })
        .then((data)=> {
            if (!data || !Array.isArray(data)) return;
            setApis(data);
            setLoading(false);
        })
        .catch((err) =>{
            console.error(err);
            setLoading(false);
        });
    }, [])
    
    if (loading) {
        return(
            <div className="flex justify-center items-center h-40 text-gray-400">
                Loading APIs...
            </div>
        )
    }
    
    return(
        <div>
            {apis.length === 0 && (
                <p className="text-gray-500">No APIs added yet.</p>
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
                        status={api.is_active ? "UP" : "DOWN"}
                        responseTime="--"
                        lastChecked="--"
                    />
                ))}
            </div>
        </div>
    )
}

export default Dashboard;