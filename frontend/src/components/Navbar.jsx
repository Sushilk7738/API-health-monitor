function Navbar() {
    return(
        <div className="flex justify-between items-center mb-6 px-6 py-4 bg-gray-800 rounded">
            <div className="flex items-center gap-2">
                <span>⚡</span>
                <h1 className="text-lg font-semibold sm:text-xl tracking-tight text-white">
                    PulseAPI
                </h1>
            </div>

            <div className="flex items-center gap-4">
                <span className="text-xs sm:text-sm text-gray-400">
                    Welcome, User👋
                </span>
                <button 
                    onClick={()=>{
                        localStorage.removeItem("token");
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
