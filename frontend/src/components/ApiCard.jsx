import { useNavigate } from "react-router-dom";



const ApiCard = ({ name, apiStatus, responseTime, lastChecked, isChecking }) => {
    const navigate = useNavigate();

    let displayStatus = apiStatus;

    const time = parseFloat(responseTime) || 0;

    if (displayStatus?.toUpperCase() === "UP" && time> 2){
        displayStatus = "SLOW";
    }
    
    
return (
    <div 
        className="bg-gray-800 p-5 rounded-xl hover:bg-gray-700 hover:scale-105 transition-all duration-200 cursor-pointer"
        onClick={()=>navigate(`/api/${name}`)}
    >
    
    <div className="flex justify-between items-center mb-3">
        <h3 className="text-white font-semibold text-lg">{name}</h3>
        <span
        className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
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
    </div>
);
};

export default ApiCard;