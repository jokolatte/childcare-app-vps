import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';

interface Transition {
    id: number;
    child_name: string;
    next_classroom_name: string;
    transition_date: string;
    age_at_transition: number;
    notes: string;
}

interface Child {
    id: number;
    first_name: string;
    last_name: string;
    date_of_birth: string;
}

interface Classroom {
    id: number;
    classroom_name: string;
}

const TransitionsPage: React.FC = () => {
    const [transitions, setTransitions] = useState<Transition[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [children, setChildren] = useState<Child[]>([]);
    const [classrooms, setClassrooms] = useState<Classroom[]>([]);
    const [selectedChild, setSelectedChild] = useState<Child | null>(null);
    const [nextClassroom, setNextClassroom] = useState<string>('');
    const [dateOfMove, setDateOfMove] = useState<string>('');
    const [notes, setNotes] = useState<string>('');
    const [editingTransitionId, setEditingTransitionId] = useState<number | null>(null);

    // Fetch children
    useEffect(() => {
        const fetchAllChildren = async () => {
            let url = "http://127.0.0.1:8000/api/children/";
            let allChildren = [];
    
            try {
                while (url) {
                    const response = await axios.get(url);
                    const data = response.data;
    
                    // Append results to allChildren
                    allChildren = [...allChildren, ...data.results];
    
                    // Update URL for the next page
                    url = data.next; // 'next' will be null when there are no more pages
                }
    
                console.log("Fetched all children:", allChildren);
    
                // Filter children based on enrollment_end_date
                const activeChildren = allChildren.filter((child) => {
                    return !child.enrollment_end_date || new Date(child.enrollment_end_date) > new Date();
                });
    
                console.log("Filtered children for dropdown:", activeChildren);
                setChildren(activeChildren); // Update the state with filtered active children
            } catch (error) {
                console.error("Error fetching children:", error);
            }
        };
    
        fetchAllChildren();
    }, []);
    
    
    

    useEffect(() => {
        axios
            .get('http://127.0.0.1:8000/api/transitions/?future_only=true') // Add query param for future transitions
            .then((response) => {
                const fetchedTransitions = response.data.results || response.data;
                // Sort transitions chronologically by transition_date
                const sortedTransitions = fetchedTransitions.sort((a: Transition, b: Transition) =>
                    new Date(a.transition_date).getTime() - new Date(b.transition_date).getTime()
                );
                setTransitions(sortedTransitions); // Set the sorted and filtered transitions
            })
            .catch((error) => console.error('Error fetching transitions:', error))
            .finally(() => setLoading(false));
    }, []);
    

    
    

    // Fetch classrooms
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/classrooms/')
            .then(response => setClassrooms(response.data.results || []))
            .catch(error => console.error('Error fetching classrooms:', error));
    }, []);

    const handleChildSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = parseInt(e.target.value);
        const child = children.find(c => c.id === selectedId) || null;
        setSelectedChild(child);
        resetForm();
    };

    const handleAddOrUpdateTransition = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    
        if (!selectedChild || !nextClassroom || !dateOfMove) {
            alert('Please fill out all required fields.');
            return;
        }
    
        const transitionData = {
            child: selectedChild.id,
            next_classroom: nextClassroom,
            transition_date: dateOfMove,
            notes,
        };
    
        try {
            if (editingTransitionId) {
                // Update transition
                const response = await axios.put(`http://127.0.0.1:8000/api/transitions/${editingTransitionId}/`, transitionData);
                setTransitions(prev => prev.map(t => t.id === editingTransitionId ? response.data : t));
                alert('Transition updated successfully!');
            } else {
                // Add transition
                const response = await axios.post('http://127.0.0.1:8000/api/transitions/', transitionData);
                setTransitions(prev => [...prev, response.data]);
                alert('Transition added successfully!');
            }
            resetForm();
        } catch (error) {
            if (error.response && error.response.data) {
                alert(error.response.data.non_field_errors || 'Failed to submit transition.');
            } else {
                alert('Failed to submit transition.');
            }
        }
    };
    
    

    const handleEditTransition = (transition: Transition) => {
        const child = children.find(c => c.first_name + ' ' + c.last_name === transition.child_name);
        if (child) {
            setSelectedChild(child);
            setNextClassroom(transition.next_classroom_name);
            setDateOfMove(transition.transition_date);
            setNotes(transition.notes || '');
            setEditingTransitionId(transition.id);
        }
    };

    const handleDeleteTransition = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this transition?')) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/transitions/${id}/`);
                setTransitions(prev => prev.filter(t => t.id !== id));
                alert('Transition deleted successfully!');
            } catch (error) {
                console.error('Error deleting transition:', error);
                alert('Failed to delete transition.');
            }
        }
    };

    const resetForm = () => {
        setNextClassroom('');
        setDateOfMove('');
        setNotes('');
        setEditingTransitionId(null);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1>Transitions</h1>

<div>
    <label htmlFor="child-select">Filter by Child:</label>
    <Select
        id="child-select"
        options={children.map((child) => ({
            value: child.id,
            label: `${child.first_name} ${child.last_name}`,
        }))}
        onChange={(selectedOption) =>
            setSelectedChild(
                selectedOption
                    ? children.find((child) => child.id === selectedOption.value)
                    : null
            )
        }
        value={children
            .map((child) => ({
                value: child.id,
                label: `${child.first_name} ${child.last_name}`,
            }))
            .find((option) => option.value === selectedChild?.id) || null}
        isClearable
    />
</div>


            {selectedChild && (
                <div>
                    <h2>{editingTransitionId ? 'Edit Transition' : 'Add Transition'}</h2>
                    <p><strong>Child:</strong> {selectedChild.first_name} {selectedChild.last_name}</p>
                    <p><strong>Date of Birth:</strong> {selectedChild.date_of_birth}</p>

                    <form onSubmit={handleAddOrUpdateTransition}>
                        <label htmlFor="next-classroom">Next Classroom:</label>
                        <select
                            id="next-classroom"
                            value={nextClassroom}
                            onChange={(e) => setNextClassroom(e.target.value)}
                        >
                            <option value="">-- Select a Classroom --</option>
                            {classrooms.map(classroom => (
                                <option key={classroom.id} value={classroom.id}>
                                    {classroom.classroom_name}
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

                        <button type="submit">{editingTransitionId ? 'Update' : 'Add'} Transition</button>
                        {editingTransitionId && <button type="button" onClick={resetForm}>Cancel</button>}
                    </form>
                </div>
            )}

            {transitions.length > 0 ? (
                <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid black', padding: '8px' }}>Child</th>
                            <th style={{ border: '1px solid black', padding: '8px' }}>Next Classroom</th>
                            <th style={{ border: '1px solid black', padding: '8px' }}>Transition Date</th>
                            <th style={{ border: '1px solid black', padding: '8px' }}>Age at Transition</th>
                            <th style={{ border: '1px solid black', padding: '8px' }}>Notes</th>
                            <th style={{ border: '1px solid black', padding: '8px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transitions.map(transition => (
                            <tr key={transition.id}>
                                <td style={{ border: '1px solid black', padding: '8px' }}>{transition.child_name}</td>
                                <td style={{ border: '1px solid black', padding: '8px' }}>{transition.next_classroom_name}</td>
                                <td style={{ border: '1px solid black', padding: '8px' }}>{transition.transition_date}</td>
                                <td style={{ border: '1px solid black', padding: '8px' }}>{transition.age_at_transition}</td>
                                <td style={{ border: '1px solid black', padding: '8px' }}>{transition.notes}</td>
                                <td style={{ border: '1px solid black', padding: '8px' }}>
                                    <button onClick={() => handleEditTransition(transition)}>Edit</button>
                                    <button onClick={() => handleDeleteTransition(transition.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No transitions found.</p>
            )}
        </div>
    );
};

export default TransitionsPage;
