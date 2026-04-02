import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../api/config"
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const EditAPI = ()=>{
    const { id } = useParams();
    const navigate = useNavigate();

    console.log("ID:", id, typeof id);

    const [formData, setFormData] = useState({
        name:"",
        url : "",
        method: "GET",
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        console.log(localStorage.getItem("token"));

        fetch(`${BASE_URL}/api/apis/${id}/`, {
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
            setFormData({
                name: data.name,
                url: data.url,
                method: data.method,
            });
            });
    }, [id]);

    const handleSubmit = async (e)=>{
        e.preventDefault();

        const token = localStorage.getItem("token");

        const res = await fetch(`${BASE_URL}/apis/${id}/`, {
            method: "PUT",
            headers: {
                "Content-Type" : "application/json",
                Authorization : `Bearer ${token}`,
            },

            body: JSON.stringify(formData),
        });

        if (res.ok){
            toast.success("API updated successfully");
            navigate("/");
        }
        else {
            toast.error("Update failed");
        }
    }

    if (!formData.name) {
    return (
        <div className="flex justify-center items-center h-40 text-gray-400">
        Loading API data...
        </div>
    );
    }
    
    return(
        <div className="flex items-center justify-center min-h-screen text-white">
            <form 
                onSubmit={handleSubmit}
                className="flex flex-col gap-5 w-full max-w-lg bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-700"
            >

                <h2 className="text-2xl font-semibold text-center mb-2">
                    Edit API
                </h2>
                
                <input 
                    type="text" 
                    placeholder="API Name"
                    value={formData.name}
                    onChange={(e)=>setFormData({...formData, name: e.target.value})}
                    className="p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input 
                    type="text" 
                    placeholder="API URL"
                    value={formData.url}
                    onChange={(e)=>setFormData({...formData, url: e.target.value})}
                    className="p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <select
                    value={formData.method}
                    onChange={(e)=> setFormData({...formData, method: e.target.value})}
                    className="p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option>GET</option>
                    <option>POST</option>
                </select>

                <button className="bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-medium transition-all duration-200 hover:scale-[1.02]">
                    Update API
                </button>
            </form>
        </div>
    )
}

export default EditAPI;