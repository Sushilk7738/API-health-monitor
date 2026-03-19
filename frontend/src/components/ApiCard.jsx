import React from 'react'

const Apicard = ({ name, status, responseTime, lastChecked}) => {
    return (
        <div className='bg-gray-800 p-5 rounded-2xl shadow-lg w-80 transition transform hover:scale-105 hover:shadow-xl'>
            <div className='flex justify-between items-center'>
                <h2 className='text-lg font-semibold'>{name}</h2>
                <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1 ${
                        status === "UP" 
                        ? "bg-green-500/20 text-green-400"  
                        : "bg-red-500/20 text-red-400"
                    }`}
                
                > 
                <span className='w-2 h-2 rounded-full bg-current'></span>
                {status}
                </span>
            </div>

            <div className='border-t border-gray-700 my-3'></div>

            <p className='text-gray-400 text-sm'>Response Time: {responseTime}</p>
            <p className='text-gray-400 text-sm'>Last Checked: {lastChecked}</p>
        </div>
    )
}

export default Apicard;