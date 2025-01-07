import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";

interface Child {
    id: number;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    classroom: number;
    family: number;
    notes: string;
    fob_required: boolean;
    enrollment_start_date: string;
}

interface Classroom {
    id: number;
    classroom_name: string;
}

const EditChild: React.FC = () => {
    const { handleSubmit, control, reset, setValue } = useForm();
    const [children, setChildren] = useState<Child[]>([]);
    const [classrooms, setClassrooms] = useState<Classroom[]>([]);
    const [selectedChildId, setSelectedChildId] = useState<number | null>(null);

    // Fetch the list of children and classrooms from the backend
    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/api/children-list/")
            .then((response) => setChildren(response.data.results))
            .catch((error) => console.error("Error fetching children:", error));

        axios
            .get("http://127.0.0.1:8000/api/classrooms-list/")
            .then((response) => setClassrooms(response.data))
            .catch((error) => console.error("Error fetching classrooms:", error));
    }, []);

    // Fetch child details when a child is selected
    useEffect(() => {
        if (selectedChildId) {
            axios
                .get(`http://127.0.0.1:8000/api/children/${selectedChildId}/`)
                .then((response) => {
                    const childData = response.data;
                    Object.keys(childData).forEach((key) => setValue(key, childData[key]));
                })
                .catch((error) => console.error("Error fetching child details:", error));
        }
    }, [selectedChildId, setValue]);

    // Handle form submission
    const onSubmit = (data: any) => {
        if (selectedChildId) {
            const formattedData = {
                ...data,
                classroom: Number(data.classroom), // Ensure classroom is submitted as an ID
            };

            axios
                .put(`http://127.0.0.1:8000/api/children/${selectedChildId}/`, formattedData)
                .then((response) => alert("Child updated successfully!"))
                .catch((error) => console.error("Error updating child:", error));
        } else {
            alert("Please select a child first.");
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Edit Child</h2>

            {/* Dropdown to select a child */}
            <div>
                <label>Select a Child</label>
                <select
                    onChange={(e) => setSelectedChildId(Number(e.target.value))}
                    value={selectedChildId || ""}
                >
                    <option value="">-- Select a Child --</option>
                    {children.map((child) => (
                        <option key={child.id} value={child.id}>
                            {child.first_name} {child.last_name}
                        </option>
                    ))}
                </select>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: "2rem" }}>
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

                <div>
    <label>Child Notes</label>
    <Controller
        name="notes"
        control={control}
        defaultValue=""
        render={({ field }) => <textarea {...field} />}
    />
</div>

{/* Allergy Information */}
<div>
    <label>Allergy Information</label>
    <Controller
        name="allergy_info"
        control={control}
        defaultValue=""
        render={({ field }) => <textarea {...field} />}
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
                                <option value="">-- Select a Classroom --</option>
                                {classrooms.map((classroom) => (
                                    <option key={classroom.id} value={classroom.id}>
                                        {classroom.classroom_name}
                                    </option>
                                ))}
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

                {/* FOB Required */}
                <div>
                    <label>FOB Required</label>
                    <Controller
                        name="fob_required"
                        control={control}
                        defaultValue={false}
                        render={({ field }) => <input type="checkbox" {...field} />}
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
                <button type="submit" disabled={!selectedChildId}>
                    Update Child
                </button>
            </form>
        </div>
    );
};

export default EditChild;
