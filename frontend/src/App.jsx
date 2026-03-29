import React from 'react'
import Navbar from './components/Navbar'
import { Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from './pages/Login';
import ApiDetail from "./pages/ApiDetail";
import AddAPI from './pages/AddAPI';
import Signup from './pages/Signup';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



const App = () => {
  const location = useLocation()
  
  return (
    <div className='min-h-screen bg-gray-900 text-gray-100 p-6'>
      {!["/login", "/Signup", "/add-api"].includes(location.pathname) && <Navbar/>}

      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/login' element={<Login />} />
        <Route path='/Signup' element={<Signup />} />
        <Route path='/api/:id' element={<ApiDetail/>}/>
        <Route path='/add-api' element={<AddAPI/>} />
      </Routes>      
      <ToastContainer/>
    </div>
  )

}

export default App;