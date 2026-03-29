import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { BASE_URL } from "../api/config";


const ApiCard = ({ id, name, apiStatus, responseTime, lastChecked, isChecking, onDelete }) => {
    const navigate = useNavigate();

    let displayStatus = apiStatus;

    const time = parseFloat(responseTime) || 0;

    if (displayStatus?.toUpperCase() === "UP" && time> 2){
        displayStatus = "SLOW";
    }
    
    
    const handleDelete = async (e)=>{
        e.stopPropagation();
        
        try{
            const res = await fetch(`${BASE_URL}/apis/${id}`, 
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            
            if (res.ok){
                toast.success("API Deleted successfully ✅");
                onDelete(id);
            }
            else{
                toast.error("Failed to delete API🥲");
            }
        }
        catch(err){
            console.log(err);
            toast.error("Something went wrong ❌");
        }
    }
    
    console.log("ApiCard id:", id);
    
return (

    
    <div 
        className="bg-gray-800 p-5 rounded-xl hover:bg-gray-700 hover:scale-105 transition-all duration-200 cursor-pointer"
        onClick={()=>navigate(`/api/${id}`)}
    >
    
    
        
    
    <div className="flex justify-between items-center mb-3">
        <h3 className="text-white font-semibold text-lg">{name}</h3>
        <span
        className={`text-xs px-2 py-2 rounded-full flex items-center gap-1 ${
            displayStatus?.toUpperCase() === "UP" 
            ? "bg-green-500/20 text-green-400"
            : displayStatus?.toUpperCase() === "DOWN" 
            ? "bg-red-500/20 text-red-400"
            : "bg-yellow-500/20 text-yellow-400"
        }`}
        >
            <span
                className={`w-2 h-2 rounded-full ${
                    displayStatus?.toUpperCase() === "UP"
                        ? "bg-green-400 animate-pulse"
                        : displayStatus?.toUpperCase() === "DOWN"
                        ? "bg-red-400"
                        : "bg-yellow-400 animate-pulse"
                }`}
            ></span>
            {displayStatus}
        </span>

        
    </div>

    {/* Bottom */}
    <div className="text-gray-400 text-sm flex flex-col gap-2 mt-3">
        
        <div className="flex justify-between">
            <span className="text-gray-500">Response</span>
            <span className="text-white">{responseTime}</span>
        </div>

        <div className="flex justify-between">
            <span className="text-gray-500">Last Checked</span>
            <span className="text-white">{lastChecked}</span>
        </div>

        {isChecking && (
            <p className="text-yellow-400 text-xs mt-2 animate-pulse">
                Checking...
            </p>
        )}

    </div>

    <button
        className="bg-red-600 px-3 py-1 rounded mt-3 text-sm"
        onClick={handleDelete}
    >
        Delete
    </button>

    </div>
);
};

export default ApiCard;