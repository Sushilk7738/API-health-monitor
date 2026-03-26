const StatCard = ({ title, value, color, icon }) => {
return (
    <div className="bg-gray-800 p-5 rounded-xl flex justify-between items-center hover:bg-gray-700 hover:scale-105 transition-all duration-200 cursor-pointer">
        
        {/* Left */}
        <div>
            <p className="text-gray-400 text-sm mb-1">{title}</p>
            <h2 className={`text-4xl font-bold ${color}`}>{value}</h2>
        </div>

        {/* Right */}
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-700">
            {icon}
        </div>

    </div>
);
};

export default StatCard;