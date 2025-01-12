import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Enrollment {
    enrollment_start_date: string;
    child_name: string;
    date_of_birth: string;
    classroom_name: string;
    allergy_info: string;
    notes: string;
}

interface Transition {
    transition_date: string;
    child_name: string;
    next_classroom_name: string;
    age_at_transition: number;
    notes: string;
}

interface Withdrawal {
    withdrawal_date: string;
    child_name: string;
    reason: string;
    status: string;
    notes: string;
}

const ChildMovementSummary: React.FC = () => {
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [transitions, setTransitions] = useState<Transition[]>([]);
    const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch upcoming enrollments
                const enrollmentsResponse = await axios.get('http://127.0.0.1:8000/api/upcoming_enrollments/');
                setEnrollments(enrollmentsResponse.data.results || enrollmentsResponse.data);

                // Fetch upcoming transitions
                const transitionsResponse = await axios.get('http://127.0.0.1:8000/api/transitions/');
                const sortedTransitions = (transitionsResponse.data.results || transitionsResponse.data).sort(
                    (a: Transition, b: Transition) =>
                        new Date(a.transition_date).getTime() - new Date(b.transition_date).getTime()
                );
                setTransitions(sortedTransitions);

                // Fetch upcoming withdrawals
                const withdrawalsResponse = await axios.get('http://127.0.0.1:8000/api/withdrawals/');
                const sortedWithdrawals = (withdrawalsResponse.data.results || withdrawalsResponse.data).sort(
                    (a: Withdrawal, b: Withdrawal) =>
                        new Date(a.withdrawal_date).getTime() - new Date(b.withdrawal_date).getTime()
                );
                setWithdrawals(sortedWithdrawals);
            } catch (error) {
                console.error('Error fetching child movement data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const tableStyle = {
        border: '1px solid black',
        borderCollapse: 'collapse',
        width: '100%',
        marginBottom: '20px',
    };

    const thTdStyle = {
        border: '1px solid black',
        padding: '8px',
        textAlign: 'left' as const,
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1>Child Movement Summary</h1>

            {/* Upcoming New Enrollments */}
            <section>
                <h2>Upcoming New Enrollments</h2>
                {enrollments.length > 0 ? (
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thTdStyle}>Start Date</th>
                                <th style={thTdStyle}>Child Name</th>
                                <th style={thTdStyle}>Date of Birth</th>
                                <th style={thTdStyle}>Classroom</th>
                                <th style={thTdStyle}>Allergy Info</th>
                                <th style={thTdStyle}>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {enrollments.map((enrollment, index) => (
                                <tr key={index}>
                                    <td style={thTdStyle}>{enrollment.enrollment_start_date}</td>
                                    <td style={thTdStyle}>{enrollment.child_name}</td>
                                    <td style={thTdStyle}>{enrollment.date_of_birth}</td>
                                    <td style={thTdStyle}>{enrollment.classroom_name}</td>
                                    <td style={thTdStyle}>{enrollment.allergy_info || 'None'}</td>
                                    <td style={thTdStyle}>{enrollment.notes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No upcoming enrollments found.</p>
                )}
            </section>

            {/* Upcoming Transitions */}
            <section>
                <h2>Upcoming Transitions</h2>
                {transitions.length > 0 ? (
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thTdStyle}>Transition Date</th>
                                <th style={thTdStyle}>Child Name</th>
                                <th style={thTdStyle}>Next Classroom</th>
                                <th style={thTdStyle}>Age at Transition</th>
                                <th style={thTdStyle}>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transitions.map((transition, index) => (
                                <tr key={index}>
                                    <td style={thTdStyle}>{transition.transition_date}</td>
                                    <td style={thTdStyle}>{transition.child_name}</td>
                                    <td style={thTdStyle}>{transition.next_classroom_name}</td>
                                    <td style={thTdStyle}>{transition.age_at_transition}</td>
                                    <td style={thTdStyle}>{transition.notes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No upcoming transitions found.</p>
                )}
            </section>

            {/* Upcoming Withdrawals */}
            <section>
                <h2>Upcoming Withdrawals</h2>
                {withdrawals.length > 0 ? (
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thTdStyle}>Withdrawal Date</th>
                                <th style={thTdStyle}>Child Name</th>
                                <th style={thTdStyle}>Reason</th>
                                <th style={thTdStyle}>Status</th>
                                <th style={thTdStyle}>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {withdrawals.map((withdrawal, index) => (
                                <tr key={index}>
                                    <td style={thTdStyle}>{withdrawal.withdrawal_date}</td>
                                    <td style={thTdStyle}>{withdrawal.child_name}</td>
                                    <td style={thTdStyle}>{withdrawal.reason}</td>
                                    <td style={thTdStyle}>{withdrawal.status}</td>
                                    <td style={thTdStyle}>{withdrawal.notes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No upcoming withdrawals found.</p>
                )}
            </section>
        </div>
    );
};

export default ChildMovementSummary;
