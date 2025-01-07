import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

interface Classroom {
    id: number;
    classroom_name: string;
}

interface Child {
    id: number;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    classroom: number;
    fob_required: boolean;
    notes: string;
    enrollment_start_date: string;
}

const EditChild: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Get child ID from the URL
    const navigate = useNavigate();
    const { handleSubmit, control, reset, setValue } = useForm<Child>();
    const [classrooms, setClassrooms] = useState<Classroom[]>([]);
    const [successMessage, setSuccessMessage] = useState<string>("");

    // Fetch classrooms and child data on load
    useEffect(() => {
        // Fetch classrooms
        axios.get("http://127.0.0.1:8000/api/classrooms-list/")
            .then(response => setClassrooms(response.data.results || response.data))
            .catch(error => console.error("Error fetching classrooms:", error));

        // Fetch child data
        axios.get(`http://127.0.0.1:8000/api/children/${id}/`)
            .then(response => {
                const childData = response.data;
                Object.keys(childData).forEach((key) => {
                    setValue(key as keyof Child, childData[key]);
                });
            })
            .catch(error => console.error("Error fetching child data:", error));
    }, [id, setValue]);

    // Handle form submission
    const onSubmit = (data: Child) => {
        axios.put(`http://127.0.0.1:8000/api/children/${id}/`, data)
            .then(response => {
                setSuccessMessage("Child updated successfully!");
                setTimeout(() => navigate("/children"), 2000); // Redirect after success
            })
            .catch(error => console.error("Error updating child:", error));
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Edit Child</h2>
            {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* First Name */}
                <div>
                    <label>First Name</label>
                    <Controller
                        name="first_name"
                        control={control}
                        defaultValue=""
                        render={({ field }) => <input {...field} />}
                    />
                </div>

                {/* Last Name */}
                <div>
                    <label>Last Name</label>
                    <Controller
                        name="last_name"
                        control={control}
                        defaultValue=""
                        render={({ field }) => <input {...field} />}
                    />
                </div>

                {/* Date of Birth */}
                <div>
                    <label>Date of Birth</label>
                    <Controller
                        name="date_of_birth"
                        control={control}
                        defaultValue=""
                        render={({ field }) => <input type="date" {...field} />}
                    />
                </div>

                {/* Classroom */}
                <div>
                    <label>Classroom</label>
                    <Controller
                        name="classroom"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <select {...field}>
                                <option value="">Select a Classroom</option>
                                {classrooms.map((classroom) => (
                                    <option key={classroom.id} value={classroom.id}>
                                        {classroom.classroom_name}
                                    </option>
                                ))}
                            </select>
                        )}
                    />
                </div>

                {/* FOB Required */}
                <div>
                    <label>FOB Required</label>
                    <Controller
                        name="fob_required"
                        control={control}
                        defaultValue={false}
                        render={({ field }) => (
                            <select {...field}>
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </select>
                        )}
                    />
                </div>

                {/* Notes */}
                <div>
                    <label>Notes</label>
                    <Controller
                        name="notes"
                        control={control}
                        defaultValue=""
                        render={({ field }) => <textarea {...field} />}
                    />
                </div>

                {/* Enrollment Start Date */}
                <div>
                    <label>Enrollment Start Date</label>
                    <Controller
                        name="enrollment_start_date"
                        control={control}
                        defaultValue=""
                        render={({ field }) => <input type="date" {...field} />}
                    />
                </div>

                {/* Submit Button */}
                <button type="submit">Update Child</button>
            </form>
        </div>
    );
};

export default EditChild;
