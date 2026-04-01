import { useState } from "react";
import { BASE_URL } from "../api/config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Signup() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`${BASE_URL}/register/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                }),
            });

            if (res.ok) {
                toast.success("Account created successfully ✅");
                navigate("/login");
            } else {
                toast.error("Signup failed ❌");
            }
        } catch (err) {
            console.log(err);
            toast.error("Something went wrong ❌");
        }
    };

    return (
        <div className="h-screen bg-gray-900 flex items-center justify-center animate__animated animate__fadeIn">
            <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md animate__animated animate__fadeInUp">

                <form onSubmit={handleSubmit}>
                    <h1 className="text-2xl font-semibold mb-4 text-white text-center">
                        Create Account
                    </h1>

                    <input
                        type="text"
                        value={username}
                        placeholder="Enter Username"
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full rounded bg-gray-700 mt-4 p-2 text-white outline-none"
                    />

                    <input
                        type="email"
                        value={email}
                        placeholder="Enter Email"
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-gray-700 p-2 rounded mt-4 w-full text-white outline-none"
                    />

                    <input
                        type="password"
                        value={password}
                        placeholder="Enter password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 mt-4 bg-gray-700 rounded text-white outline-none"
                    />

                    <button className="w-full bg-blue-600 p-2 mt-4 hover:bg-blue-700 rounded text-white transition">
                        Sign Up
                    </button>

                    {/* LOGIN  */}
                    <p className="text-gray-400 text-sm mt-4 text-center">
                        Already have an account?{" "}
                        <span
                            onClick={() => navigate("/login")}
                            className="text-blue-400 cursor-pointer hover:underline"
                        >
                            Login
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
}