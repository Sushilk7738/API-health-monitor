import React from 'react'
import Navbar from './components/Navbar'
import { Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from './pages/Login';
import ApiDetail from "./pages/ApiDetail";
import AddAPI from './pages/AddAPI';
import Signup from './pages/Signup';
import EditAPI from './pages/EditAPI';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const App = () => {
  const location = useLocation()
  
  return (
    <div className='min-h-screen bg-gray-900 text-gray-100 p-6'>
      {!location.pathname.startsWith("/login") &&
      !location.pathname.startsWith("/signup") &&
      !location.pathname.startsWith("/add-api") &&
      !location.pathname.startsWith("/edit-api") && <Navbar />}

      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/login' element={<Login />} />
        <Route path='/Signup' element={<Signup />} />
        <Route path='/api/:id' element={<ApiDetail/>}/>
        <Route path='/add-api' element={<AddAPI/>} />
        <Route path='/edit-api/:id' element={<EditAPI/>} />
      </Routes>      
      <ToastContainer/>
    </div>
  )

}

export default App;