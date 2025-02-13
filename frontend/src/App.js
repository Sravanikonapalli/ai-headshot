import React, { useState } from "react";
import axios from "axios";
import './App.css'
function App() {
    const [file, setFile] = useState(null);
    const [taskId, setTaskId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please select an image file first.");
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("photo", file);

        try {
            const response = await axios.post("http://localhost:5000/generate-headshot", formData);
            setTaskId(response.data.task_id);
        } catch (err) {
            setError("Failed to generate headshot.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h1>AI Headshot Generator</h1>
            <div className="file"> 
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={loading}>
                {loading ? "Processing..." : "Generate Headshot"}
            </button>
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {taskId && <p>Task ID: {taskId}</p>}
            
        </div>
    );
}

export default App;
