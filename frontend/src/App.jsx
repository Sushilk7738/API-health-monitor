import React, { useEffect, useState } from 'react';
import ApiCard from './components/ApiCard';

const App = () => {
  const [apis, setApis] = useState([]);

  useEffect(()=>{
    fetch("http://127.0.0.1:8000/api/apis/", {
      headers: {
        Authorization : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzczODk2MzI0LCJpYXQiOjE3NzM4OTI3MjQsImp0aSI6ImZhODVmODNkNDBmNjRkOTVhNzI0NDMxM2FjNWQ2OGVjIiwidXNlcl9pZCI6IjEifQ.fiMPlRcbWXf1jPzK7M8NW2S6zsIxcZAhWbvqoUWVRGc"
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

      <h1 className='text-2xl text-center font-bold mb-6'>
        API Monitoring Dashboard
      </h1>

      {/* cards container */}

      <div className='flex flex-wrap gap-6'>
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