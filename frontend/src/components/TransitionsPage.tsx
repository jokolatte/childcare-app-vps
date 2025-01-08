import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Define types for Transition data
interface Transition {
    id: number;
    child: string; // Adjust based on your API's response
    next_classroom: string;
    transition_date: string;
}

interface Child {
    id: number;
    first_name: string;
    last_name: string;
}

const TransitionsPage: React.FC = () => {
    const [transitions, setTransitions] = useState<Transition[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [children, setChildren] = useState<Child[]>([]);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/transitions/')
            .then(response => {
                console.log('API Response:', response.data); // Check the response structure
                const data = response.data.results || []; // Extract the 'results' array
                setTransitions(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching transitions:', error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/children/dropdown/')
            .then(response => {
                console.log('Fetched children for dropdown:', response.data.results); // Log the response
                setChildren(response.data.results || []); // Ensure we're setting the results array
            })
            .catch(error => {
                console.error('Error fetching children for dropdown:', error);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Transitions</h1>
            
            <label htmlFor="child-select">Filter by Child:</label>
<select id="child-select">
    <option value="">-- Select a Child --</option>
    {children && children.length > 0 ? (
        children.map((child) => (
            <option key={child.id} value={child.id}>
                {child.first_name} {child.last_name}
            </option>
        ))
    ) : (
        <option disabled>No children available</option>
    )}
</select>

            
            {transitions.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Child</th>
                            <th>Next Classroom</th>
                            <th>Transition Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transitions.map((transition) => (
                            <tr key={transition.id}>
                                <td>{transition.child_name}</td>
                                <td>{transition.next_classroom_name}</td>
                                <td>{transition.transition_date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div>No transitions found.</div>
            )}
        </div>
    );
    
};

export default TransitionsPage;
