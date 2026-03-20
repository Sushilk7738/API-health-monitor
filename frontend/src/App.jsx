import React, { useEffect, useState } from 'react';
import ApiCard from './components/ApiCard';
import Navbar from './components/Navbar';


const App = () => {
  const [apis, setApis] = useState([]);
  const token = localStorage.getItem("token")

  useEffect(()=>{
    fetch("http://127.0.0.1:8000/api/apis/", {
      headers: {
        Authorization : `Bearer ${token}`
      },
    })
    .then((res) =>res.json())
    .then((data) => {
      setApis(data);
    })
    .catch((err) => console.error(err));
  }, []);
  
  
  return (
    <div className='min-h-screen bg-gray-900 text-gray-100 p-6'>
      {/* title */}
      <Navbar/>

      {/* cards container */}

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        {apis.map((api)=>(
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

export default App;