import React from 'react'
import Navbar from './components/Navbar'
import { Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from './pages/Login';
import ApiDetail from "./pages/ApiDetail";

const App = () => {
  const location = useLocation()
  
  return (
    <div className='min-h-screen bg-gray-900 text-gray-100 p-6'>
      {location.pathname !== "/login" && <Navbar/>}

      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/login' element={<Login />} />
        <Route path='/api/:id' element={<ApiDetail/>}/>
      </Routes>      
    </div>
  )
}

export default App;