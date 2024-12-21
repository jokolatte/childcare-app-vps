import React, { useState } from "react";

const TestAPI: React.FC = () => {
    const [response, setResponse] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchData = async () => {
        setLoading(true); // Start loading state
        setError(null); // Clear any existing error
        setResponse(null); // Clear previous responses

        try {
            const res = await fetch("http://127.0.0.1:8000/api/test/"); // Ensure this matches the backend endpoint
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json(); // Use `.json()` since the backend returns JSON
            setResponse(data.message || "No message received"); // Handle `message` field explicitly
        } catch (err) {
            setError("Error: Unable to connect to backend");
            console.error("API Fetch Error:", err); // Log the error for debugging
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div>
            <h1>API Test</h1>
            <button onClick={fetchData} disabled={loading}>
                {loading ? "Loading..." : "Test API"}
            </button>
            {response && <p>Response: {response}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default TestAPI;
