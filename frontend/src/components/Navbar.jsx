import { useNavigate } from "react-router-dom";




function Navbar() {
    const navigate = useNavigate();
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const username = userInfo?.name;

    
    return(
        <div className="flex justify-between items-center mb-6 px-6 py-4 bg-gray-800 rounded">
            <div 
                className="flex items-center gap-2"
                onClick={()=> navigate("/")}
            >
                <span>⚡</span>
                <h1 className="text-lg font-semibold sm:text-xl tracking-tight text-white">
                    PulseAPI
                </h1>
            </div>

            <div className="flex items-center gap-4">
                <span className="text-xs font-bold sm:text-sm text-gray-200">
                    Welcome, {username || "User"}👋
                </span>
                <button 
                    onClick={()=>{
                        localStorage.removeItem("token");
                        localStorage.removeItem("userInfo");
                        window.location.href = "/login"; 
                    }}
                    className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 rounded-lg transition"
                >
                    Logout
                </button>
            </div>
        </div>
    )
}

export default Navbar;
