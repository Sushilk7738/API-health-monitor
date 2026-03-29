import { useState } from "react"
import { BASE_URL } from "../api/config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";



export default function Signup(){
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    
    const handleSubmit = async(e)=>{
        e.preventDefault();
        
        try{
            const res = await fetch(`${BASE_URL}/register`, {
                method:"POST",
                headers: {
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify({
                    username: username,
                    email : email,
                    password: password,
                })
            })
            const data = await res.json();
            console.log(data);
            toast.success("Account created successfully ✅");
            navigate("/login");
        }
        catch(err){
            console.log(err);
        }
    }
    
    return(
        <div className="h-screen bg-gray-900 text-white flex items-center justify-center">
            <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md">

                <form onSubmit={handleSubmit}>

                    <h1 className="text-2xl font-semibold mb-4">
                        Create Account
                    </h1>

                    <input 
                        type="text" 
                        value={username}
                        placeholder="Enter Username"
                        onChange={(e)=> setUsername(e.target.value)}
                        className="w-full rounded bg-slate-700 mt-4 p-2"
                    />

                    <input 
                        type="email" 
                        value={email}
                        placeholder="Enter Email"
                        onChange={(e)=>setEmail(e.target.value)}
                        className="bg-gray-700 p-2 rounded mt-4 w-full"
                    />

                    <input 
                        type="password" 
                        value={password}
                        placeholder="Enter password"
                        onChange={(e)=>setPassword(e.target.value)}
                        className="w-full p-2 mt-4 bg-gray-700 rounded"
                    />
                    
                    <button className="w-full bg-blue-600 p-2 mt-4 hover:bg-blue-700 rounded">
                        Sign Up
                    </button>
                </form>
            </div>
                
        </div>
    )
}