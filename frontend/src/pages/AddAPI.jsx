import { useState } from "react"
import { BASE_URL } from "../api/config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


export default function AddAPI(){
    const [name, setName] = useState("");
    const [url , setUrl] = useState("");
    const [method, setMethod] = useState("GET");

    const navigate = useNavigate();

    const handleSubmit = async(e)=>{
        e.preventDefault()
        
        try{
            const res = await fetch(`${BASE_URL}/apis/create/`, {
                method: "POST",
                headers: {
                    "Content-Type" : "application/json",
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body : JSON.stringify({
                    name:name,
                    url:url,
                    method:method,
                }),
            });

            const data = await res.json();
            console.log(data);

            if (res.ok) {
                toast.success("API Added Successfully");
                navigate("/");
            } else {
                toast.error("Failed to add API");
            }
            
            setName("");
            setUrl("");
            setMethod("GET");
        }
        catch(err){
            console.log(err)
        }
    }
    
    
    return(
        <div className="h-screen bg-gray-900 text-white flex items-center justify-center">
            <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md">
                <h1 className="text-2xl text-center font-semibold mb-4">Add API Page</h1>

                <form onSubmit={handleSubmit}>
                    <input 
                        type="text"
                        placeholder="Enter API Name"
                        className="w-full p-2 rounded bg-gray-700"
                        value={name}
                        onChange={(e)=> setName(e.target.value)}
                    />
                    
                    <input 
                        type="url"
                        placeholder="Enter API URL"
                        value={url}
                        onChange={(e)=> setUrl(e.target.value)}
                        className="w-full p-2 mt-4 rounded bg-gray-700"
                    />
                        
                    <select
                        value={method}
                        onChange={(e)=> setMethod(e.target.value)}
                        className="w-full p-2 mt-4 rounded bg-gray-700"
                    >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                    </select>

                    <button
                        className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded mt-4"
                    >
                        Add API
                    </button>
                </form>
            </div>
        </div>
    )
}