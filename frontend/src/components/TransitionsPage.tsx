import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Define types for Transition data
interface Transition {
    id: number;
    child_name: string;
    next_classroom_name: string;
    transition_date: string;
    age_at_transition: number;
}

interface Child {
    id: number;
    first_name: string;
    last_name: string;
    date_of_birth: string; // Ensure this field exists in the API response
}

interface Classroom {
    id: number;
    name: string;
}

const TransitionsPage: React.FC = () => {
    const [transitions, setTransitions] = useState<Transition[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [children, setChildren] = useState<Child[]>([]);
    const [selectedChild, setSelectedChild] = useState<Child | null>(null);
    const [classrooms, setClassrooms] = useState<Classroom[]>([]);
    const [nextClassroom, setNextClassroom] = useState<string>('');
    const [dateOfMove, setDateOfMove] = useState<string>('');
    const [notes, setNotes] = useState<string>('');

    // Fetch transitions
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/transitions/')
            .then(response => {
                setTransitions(response.data.results || response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching transitions:', error);
                setLoading(false);
            });
    }, []);

    // Fetch children
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/children/dropdown/')
            .then(response => {
                const sortedChildren = (response.data.results || []).sort((a, b) => {
                    const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
                    const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
                    return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
                });
                setChildren(sortedChildren);
            })
            .catch(error => {
                console.error('Error fetching children for dropdown:', error);
            });
    }, []);

    // Fetch classrooms
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/classrooms/') // Adjust API endpoint if necessary
            .then(response => {
                setClassrooms(response.data.results || response.data);
            })
            .catch(error => {
                console.error('Error fetching classrooms:', error);
            });
    }, []);

    const handleChildSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = parseInt(e.target.value);
        if (selectedId) {
            const child = children.find((child) => child.id === selectedId);
            setSelectedChild(child || null);
        } else {
            setSelectedChild(null);
        }
    };

    const handleAddTransition = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!selectedChild || !nextClassroom || !dateOfMove) {
            alert('Please fill out all required fields.');
            return;
        }

        const newTransition = {
            child: selectedChild.id,
            next_classroom: nextClassroom,
            transition_date: dateOfMove,
            notes: notes,
        };

        axios.post('http://127.0.0.1:8000/api/transitions/', newTransition)
            .then((response) => {
                alert('Transition successfully added!');
                setNextClassroom('');
                setDateOfMove('');
                setNotes('');
                setTransitions((prev) => [...prev, response.data]);
            })
            .catch((error) => {
                console.error('Error adding transition:', error);
                alert('Failed to add transition.');
            });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Transitions</h1>

            <label htmlFor="child-select">Filter by Child:</label>
            <select id="child-select" onChange={handleChildSelect}>
                <option value="">-- Select a Child --</option>
                {children.map((child) => (
                    <option key={child.id} value={child.id}>
                        {child.first_name} {child.last_name}
                    </option>
                ))}
            </select>

            {selectedChild && (
                <div>
                    <h2>Add a Transition</h2>
                    <p>
                        <strong>Child:</strong> {selectedChild.first_name} {selectedChild.last_name}
                    </p>
                    <p>
                        <strong>Date of Birth (yyyy-mm-dd):</strong> {selectedChild.date_of_birth}
                    </p>

                    <form onSubmit={handleAddTransition}>
                        <label htmlFor="next-classroom">Next Classroom:</label>
                        <select
                            id="next-classroom"
                            value={nextClassroom}
                            onChange={(e) => setNextClassroom(e.target.value)}
                        >
                            <option value="">-- Select a Classroom --</option>
                            {classrooms.map((classroom) => (
                                <option key={classroom.id} value={classroom.id}>
                                    {classroom.name}
                                </option>
                            ))}
                        </select>

                        <label htmlFor="date-of-move">Date of Move:</label>
                        <input
                            type="date"
                            id="date-of-move"
                            value={dateOfMove}
                            onChange={(e) => setDateOfMove(e.target.value)}
                        />

                        <label htmlFor="notes">Additional Notes:</label>
                        <textarea
                            id="notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        ></textarea>

                        <button type="submit">Add Transition</button>
                    </form>
                </div>
            )}

            {transitions.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Child</th>
                            <th>Next Classroom</th>
                            <th>Transition Date (yyyy-mm-dd)</th>
                            <th>Age at Transition (Months)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transitions.map((transition) => (
                            <tr key={transition.id}>
                                <td>{transition.child_name}</td>
                                <td>{transition.next_classroom_name}</td>
                                <td>{transition.transition_date}</td>
                                <td>{transition.age_at_transition}</td>
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
