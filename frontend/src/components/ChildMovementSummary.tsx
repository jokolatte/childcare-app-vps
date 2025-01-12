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

    // Fetch data from APIs
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch upcoming enrollments
                const enrollmentsResponse = await axios.get('http://127.0.0.1:8000/api/upcoming_enrollments/');
                console.log('Enrollments:', enrollmentsResponse.data);
                setEnrollments(enrollmentsResponse.data.results || enrollmentsResponse.data);

                // Fetch upcoming transitions
                const transitionsResponse = await axios.get('http://127.0.0.1:8000/api/transitions/');
                console.log('Transitions:', transitionsResponse.data);
                setTransitions(transitionsResponse.data.results || transitionsResponse.data);

                // Fetch upcoming withdrawals
                const withdrawalsResponse = await axios.get('http://127.0.0.1:8000/api/withdrawals/');
                console.log('Withdrawals:', withdrawalsResponse.data);
                setWithdrawals(withdrawalsResponse.data.results || withdrawalsResponse.data);
            } catch (error) {
                console.error('Error fetching child movement data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1>Child Movement Summary</h1>

            {/* Upcoming New Enrollments */}
            <section>
                <h2>Upcoming New Enrollments</h2>
                {enrollments.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Start Date</th>
                                <th>Child Name</th>
                                <th>Date of Birth</th>
                                <th>Classroom</th>
                                <th>Allergy Info</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {enrollments.map((enrollment, index) => (
                                <tr key={index}>
                                    <td>{enrollment.enrollment_start_date}</td>
                                    <td>{enrollment.child_name}</td>
                                    <td>{enrollment.date_of_birth}</td>
                                    <td>{enrollment.classroom_name}</td>
                                    <td>{enrollment.allergy_info || 'None'}</td>
                                    <td>{enrollment.notes}</td>
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
                    <table>
                        <thead>
                            <tr>
                                <th>Transition Date</th>
                                <th>Child Name</th>
                                <th>Next Classroom</th>
                                <th>Age at Transition</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transitions.map((transition, index) => (
                                <tr key={index}>
                                    <td>{transition.transition_date}</td>
                                    <td>{transition.child_name}</td>
                                    <td>{transition.next_classroom_name}</td>
                                    <td>{transition.age_at_transition}</td>
                                    <td>{transition.notes}</td>
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
                    <table>
                        <thead>
                            <tr>
                                <th>Withdrawal Date</th>
                                <th>Child Name</th>
                                <th>Reason</th>
                                <th>Status</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {withdrawals.map((withdrawal, index) => (
                                <tr key={index}>
                                    <td>{withdrawal.withdrawal_date}</td>
                                    <td>{withdrawal.child_name}</td>
                                    <td>{withdrawal.reason}</td>
                                    <td>{withdrawal.status}</td>
                                    <td>{withdrawal.notes}</td>
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
