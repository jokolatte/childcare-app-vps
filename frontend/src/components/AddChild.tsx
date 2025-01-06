import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";

interface Classroom {
    id: number;
    classroom_name: string; // Ensure this matches the backend serializer field
}

interface Family {
    id: number;
    parent_1_name: string;
}

const AddChild: React.FC = () => {
    const { handleSubmit, control, reset } = useForm();
    const [classrooms, setClassrooms] = useState<Classroom[]>([]);
    const [families, setFamilies] = useState<Family[]>([]);
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    // Fetch Classrooms and Families from the backend
    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/api/classrooms-list/")
            .then((response) => {
                // Ensure classrooms data is in the correct format
                setClassrooms(response.data.map((classroom: any) => ({
                    id: classroom.id,
                    classroom_name: classroom.classroom_name, // Map only necessary fields
                })));
            })
            .catch((error) => {
                console.error("Error fetching classrooms:", error);
                setErrorMessage("Failed to load classrooms. Please try again.");
            });

        axios
            .get("http://127.0.0.1:8000/api/families-list/")
            .then((response) => setFamilies(response.data))
            .catch((error) => {
                console.error("Error fetching families:", error);
                setErrorMessage("Failed to load families. Please try again.");
            });
    }, []);

    // Handle form submission
    const onSubmit = (data: any) => {
        axios
            .post("http://127.0.0.1:8000/api/add-child/", data)
            .then((response) => {
                setSuccessMessage("Child added successfully!");
                setErrorMessage(""); // Clear any previous error message
                reset(); // Clear the form
            })
            .catch((error) => {
                console.error("Error adding child:", error);
                setErrorMessage("Failed to add child. Please check the form and try again.");
            });
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Add Child</h2>
            {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
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
                        name="classroom_id"
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

                {/* Family */}
                <div>
                    <label>Family</label>
                    <Controller
                        name="family"
                        control={control}
                        defaultValue=""
                        render={({ field }) => (
                            <select {...field}>
                                <option value="">Select a Family</option>
                                {families.map((family) => (
                                    <option key={family.id} value={family.id}>
                                        {family.parent_1_name}
                                    </option>
                                ))}
                            </select>
                        )}
                    />
                </div>

                {/* Allergy Info */}
                <div>
                    <label>Allergy Information</label>
                    <Controller
                        name="allergy_info"
                        control={control}
                        defaultValue=""
                        render={({ field }) => <textarea {...field} />}
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
                        defaultValue={true}
                        render={({ field }) => (
                            <input type="checkbox" {...field} defaultChecked={field.value} />
                        )}
                    />
                </div>

                {/* Submit Button */}
                <button type="submit">Add Child</button>
            </form>
        </div>
    );
};

export default AddChild;
