import React, { useEffect, useState } from "react";
import Select from "react-select";
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
    const { handleSubmit, control, reset, watch } = useForm();
    const [classrooms, setClassrooms] = useState<Classroom[]>([]);
    const [families, setFamilies] = useState<{ value: number; label: string }[]>([]);
    const [isExistingFamily, setIsExistingFamily] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>("");

    // Watch existing family toggle
    const existingFamily = watch("existing_family", false);

    // Fetch Classrooms and Families from the backend
    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/api/classrooms-list/")
            .then((response) => setClassrooms(response.data))
            .catch((error) => console.error("Error fetching classrooms:", error));

        axios
            .get("http://127.0.0.1:8000/api/families-list/")
            .then((response) => {
                const formattedFamilies = response.data.map((family: Family) => ({
                    value: family.id,
                    label: family.parent_1_name,
                }));
                setFamilies(formattedFamilies);
            })
            .catch((error) => console.error("Error fetching families:", error));
    }, []);

    // Handle form submission
    const onSubmit = (data: any) => {
        console.log("Raw form data:", data); // Debugging: Log raw form data

        // Clean up the data by removing empty optional fields
        const cleanedData = Object.keys(data).reduce((acc, key) => {
            if (data[key] !== null && data[key] !== "" && data[key] !== undefined) {
                acc[key] = data[key];
            }
            return acc;
        }, {});

        // Convert "yes"/"no" to boolean for `fob_required`
        cleanedData.fob_required = cleanedData.fob_required === "yes";

        // Remove `family` field if a new family is being created
        if (!cleanedData.existing_family) {
            delete cleanedData.family;
        }

        console.log("Cleaned data for submission:", cleanedData); // Debugging: Log cleaned data

        axios
            .post("http://127.0.0.1:8000/api/add-child/", cleanedData)
            .then(() => {
                setSuccessMessage("Child added successfully!");
                reset(); // Clear the form
            })
            .catch((error) => {
                console.error("Error adding child:", error);
                if (error.response) {
                    console.error("Backend error response:", error.response.data); // Backend error details
                }
            });
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

                {/* Child Notes */}
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

                {/* Existing Family Toggle */}
                <div>
                    <label>Existing Family?</label>
                    <Controller
                        name="existing_family"
                        control={control}
                        defaultValue={false}
                        render={({ field }) => (
                            <select
                                {...field}
                                onChange={(e) => {
                                    const isExisting = e.target.value === "true";
                                    setIsExistingFamily(isExisting);
                                    field.onChange(isExisting); // Update form state
                                }}
                            >
                                <option value="false">No</option>
                                <option value="true">Yes</option>
                            </select>
                        )}
                    />
                </div>

                {/* Existing Family Dropdown */}
{isExistingFamily && (
    <div>
        <label>Select Existing Family</label>
        <Controller
            name="family"
            control={control}
            defaultValue={null}
            render={({ field }) => (
                <Select
                    {...field}
                    options={families}
                    onChange={(selectedOption) => {
                        field.onChange(selectedOption?.value); // Update form state with the selected family ID
                    }}
                    value={families.find(family => family.value === field.value) || null} // Bind selected value
                    placeholder="Search for a family"
                    isClearable
                />
            )}
        />
    </div>
)}

                {/* New Family Fields */}
                {!isExistingFamily && (
                    <div>
                        <h3>New Family Information</h3>
                        <div>
                            <label>Parent 1 Name</label>
                            <Controller
                                name="parent_1_name"
                                control={control}
                                defaultValue=""
                                render={({ field }) => <input {...field} />}
                            />
                        </div>
                        <div>
                            <label>Parent 1 Phone</label>
                            <Controller
                                name="parent_1_phone"
                                control={control}
                                defaultValue=""
                                render={({ field }) => <input type="tel" {...field} />}
                            />
                        </div>
                        <div>
                            <label>Parent 1 Email</label>
                            <Controller
                                name="parent_1_email"
                                control={control}
                                defaultValue=""
                                render={({ field }) => <input type="email" {...field} />}
                            />
                        </div>
                        <div>
                            <label>Address</label>
                            <Controller
                                name="address"
                                control={control}
                                defaultValue=""
                                render={({ field }) => <textarea {...field} />}
                            />
                        </div>
                        <div>
                            <label>Payment Preferences</label>
                            <Controller
                                name="payment_preferences"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <select {...field}>
                                        <option value="">Choose one</option>
                                        <option value="EFT">EFT</option>
                                        <option value="Credit Card">Credit Card</option>
                                        <option value="Cash">Cash</option>
                                        <option value="Cheque">Cheque</option>
                                        <option value="Direct Payment">Direct Payment</option>
                                    </select>
                                )}
                            />
                        </div>
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
