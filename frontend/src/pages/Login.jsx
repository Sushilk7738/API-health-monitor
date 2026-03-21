import { useState } from "react";
import { BASE_URL } from "../api/config";



const Login = ()=>{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const handleLogin = () => {
        fetch(`http://127.0.0.1:8000/login/`, {
            method: "POST",
            headers: {
                "Content-Type" : "application/json",
            },
            body: JSON.stringify({
                username: email,
                password,
            }),
        })
        .then((res) => res.json())
        .then((data) => {
            localStorage.setItem("token", data.access);
            window.location.href = "/";
        })
        .catch((err) => console.error(err));
    }
    
    
    return(
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md">
                <h1 className="text-white text-2xl font-bold mb-4">PulseAPI</h1>

                <input 
                    type="email" 
                    placeholder="Email"
                    className="w-full mb-3 p-2 rounded bg-gray-700 text-white outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full mb-4 p-2 rounded bg-gray-700 text-white outline-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-500 text-white p-2 rounded"
                >
                    Login
                </button>
            </div>
            
            
        </div>
    );
};

export default Login;