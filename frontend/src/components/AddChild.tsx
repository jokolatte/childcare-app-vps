import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";

interface Classroom {
    id: number;
    classroom_name: string;
}

interface Family {
    id: number;
    parent_1_name: string;
}

const AddChild: React.FC = () => {
    const { handleSubmit, control, reset, watch, setValue } = useForm();
    const [classrooms, setClassrooms] = useState<Classroom[]>([]);
    const [families, setFamilies] = useState<Family[]>([]);
    const [isExistingFamily, setIsExistingFamily] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>("");

    // Watch existing family toggle
    const existingFamily = watch("existing_family", false);

    // Fetch Classrooms and Families from the backend
    useEffect(() => {
        axios.get("http://127.0.0.1:8000/api/classrooms-list/")
            .then(response => setClassrooms(response.data))
            .catch(error => console.error("Error fetching classrooms:", error));

        axios.get("http://127.0.0.1:8000/api/families-list/")
            .then(response => setFamilies(response.data))
            .catch(error => console.error("Error fetching families:", error));
    }, []);

    // Handle form submission
    const onSubmit = (data: any) => {
        if (!data.existing_family) {
            // Remove existing family field if a new family is being created
            delete data.family;
        }

        // Convert "yes"/"no" to boolean for fob_required
        const formattedData = {
            ...data,
            fob_required: data.fob_required === "yes", // Convert "yes" to true, "no" to false
        };

        axios.post("http://127.0.0.1:8000/api/add-child/", formattedData)
            .then(response => {
                setSuccessMessage("Child added successfully!");
                reset(); // Clear the form
            })
            .catch(error => console.error("Error adding child:", error));
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Add Child</h2>
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

                {/* Existing Family Toggle */}
                <div>
                    <label>Existing Family?</label>
                    <Controller
                        name="existing_family"
                        control={control}
                        defaultValue={false}
                        render={({ field }) => (
                            <select {...field} onChange={(e) => setIsExistingFamily(e.target.value === "true")}>
                                <option value="false">No</option>
                                <option value="true">Yes</option>
                            </select>
                        )}
                    />
                </div>

                {/* New Family Fields */}
                {!isExistingFamily && (
                    <div>
                        <h3>New Family Information</h3>

                        {/* Parent 1 Name */}
                        <div>
                            <label>Parent 1 Name</label>
                            <Controller
                                name="parent_1_name"
                                control={control}
                                defaultValue=""
                                render={({ field }) => <input {...field} />}
                            />
                        </div>

                        {/* Parent 1 Phone */}
                        <div>
                            <label>Parent 1 Phone</label>
                            <Controller
                                name="parent_1_phone"
                                control={control}
                                defaultValue=""
                                render={({ field }) => <input type="tel" {...field} />}
                            />
                        </div>

                        {/* Parent 1 Email */}
                        <div>
                            <label>Parent 1 Email</label>
                            <Controller
                                name="parent_1_email"
                                control={control}
                                defaultValue=""
                                render={({ field }) => <input type="email" {...field} />}
                            />
                        </div>

                        {/* Parent 2 Name */}
                        <div>
                            <label>Parent 2 Name (Optional)</label>
                            <Controller
                                name="parent_2_name"
                                control={control}
                                defaultValue=""
                                render={({ field }) => <input {...field} />}
                            />
                        </div>

                        {/* Parent 2 Phone */}
                        <div>
                            <label>Parent 2 Phone (Optional)</label>
                            <Controller
                                name="parent_2_phone"
                                control={control}
                                defaultValue=""
                                render={({ field }) => <input type="tel" {...field} />}
                            />
                        </div>

                        {/* Parent 2 Email */}
                        <div>
                            <label>Parent 2 Email (Optional)</label>
                            <Controller
                                name="parent_2_email"
                                control={control}
                                defaultValue=""
                                render={({ field }) => <input type="email" {...field} />}
                            />
                        </div>

                        {/* Address */}
                        <div>
                            <label>Address</label>
                            <Controller
                                name="address"
                                control={control}
                                defaultValue=""
                                render={({ field }) => <textarea {...field} />}
                            />
                        </div>

                        {/* Payment Preferences */}
                        <div>
                            <label>Payment Preferences</label>
                            <Controller
                                name="payment_preferences"
                                control={control}
                                defaultValue="direct_deposit"
                                render={({ field }) => (
                                    <select {...field}>
                                        <option value="direct_deposit">Direct Deposit</option>
                                        <option value="etransfer">E-Transfer</option>
                                        <option value="cheque">Cheque</option>
                                        <option value="credit_card">Credit Card</option>
                                        <option value="cash">Cash</option>
                                    </select>
                                )}
                            />
                        </div>

                        {/* Notes */}
                        <div>
                            <label>Notes (Optional)</label>
                            <Controller
                                name="notes"
                                control={control}
                                defaultValue=""
                                render={({ field }) => <textarea {...field} />}
                            />
                        </div>
                    </div>
                )}

                {/* Existing Family Dropdown */}
                {isExistingFamily && (
                    <div>
                        <label>Select Existing Family</label>
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
                )}

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
                        defaultValue="yes"
                        render={({ field }) => (
                            <select {...field}>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </select>
                        )}
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
                <button type="submit">Add Child</button>
            </form>
        </div>
    );
};

export default AddChild;
