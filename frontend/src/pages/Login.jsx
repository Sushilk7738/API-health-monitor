import { useState } from "react";
import { BASE_URL } from "../api/config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/login/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: userName,
                    password,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                // store 
                localStorage.setItem("token", data.access);
                localStorage.setItem(
                    "userInfo",
                    JSON.stringify({ name: userName })
                );

                toast.success("Login successful ✅");
                navigate("/");
            } else {
                toast.error("Invalid credentials ❌");
            }
        } catch (err) {
            console.error(err);
            toast.error("Login failed ❌");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 animate__animated animate__fadeIn">
            <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md animate__animated animate__fadeInDown">

                <h1 className="text-white text-2xl font-bold mb-4 text-center">
                    PulseAPI
                </h1>

                <input
                    type="text"
                    placeholder="Username"
                    className="w-full mb-3 p-2 rounded bg-gray-700 text-white outline-none"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
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
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded transition"
                >
                    Login
                </button>

                {/* SIGNUP  */}
                <p className="text-gray-400 text-sm mt-4 text-center">
                    New user?{" "}
                    <span
                        onClick={() => navigate("/signup")}
                        className="text-blue-400 cursor-pointer hover:underline"
                    >
                        Create account
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;