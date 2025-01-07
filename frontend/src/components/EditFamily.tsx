import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";

interface Family {
    id: number;
    parent_1_name: string;
    parent_1_phone: string;
    parent_1_email: string;
    parent_2_name?: string;
    parent_2_phone?: string;
    parent_2_email?: string;
    address: string;
    payment_preferences: string;
    notes?: string;
}

const EditFamily: React.FC = () => {
    const { handleSubmit, control, reset, setValue } = useForm();
    const [families, setFamilies] = useState<Family[]>([]);
    const [selectedFamilyId, setSelectedFamilyId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // Fetch the list of families
    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/api/families-list/")
            .then((response) => {
                console.log("Fetched families:", response.data); // Adjusted to log response.data
                setFamilies(response.data || []); // Adjusted to handle array directly
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching families:", error);
                setLoading(false);
            });
    }, []);

    // Fetch family details when a family is selected
    useEffect(() => {
        if (selectedFamilyId) {
            axios
                .get(`http://127.0.0.1:8000/api/families/${selectedFamilyId}/`)
                .then((response) => {
                    const familyData = response.data;
                    Object.keys(familyData).forEach((key) => setValue(key, familyData[key]));
                })
                .catch((error) => console.error("Error fetching family details:", error));
        }
    }, [selectedFamilyId, setValue]);

    // Handle form submission
    const onSubmit = (data: any) => {
        if (selectedFamilyId) {
            axios
                .put(`http://127.0.0.1:8000/api/families/${selectedFamilyId}/`, data)
                .then(() => alert("Family updated successfully!"))
                .catch((error) => console.error("Error updating family:", error));
        } else {
            alert("Please select a family first.");
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Edit Family</h2>

            {/* Loading Indicator */}
            {loading ? (
                <p>Loading families...</p>
            ) : families.length > 0 ? (
                <>
                    {/* Dropdown to select a family */}
                    <div>
                        <label>Select a Family</label>
                        <select
                            onChange={(e) => setSelectedFamilyId(Number(e.target.value))}
                            value={selectedFamilyId || ""}
                        >
                            <option value="">-- Select a Family --</option>
                            {families.map((family) => (
                                <option key={family.id} value={family.id}>
                                    {family.parent_1_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: "2rem" }}>
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
                            <label>Parent 2 Name</label>
                            <Controller
                                name="parent_2_name"
                                control={control}
                                defaultValue=""
                                render={({ field }) => <input {...field} />}
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
                                defaultValue=""
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
                            <label>Notes</label>
                            <Controller
                                name="notes"
                                control={control}
                                defaultValue=""
                                render={({ field }) => <textarea {...field} />}
                            />
                        </div>

                        {/* Submit Button */}
                        <button type="submit" disabled={!selectedFamilyId}>
                            Update Family
                        </button>
                    </form>
                </>
            ) : (
                <p>No families found. Please add a family first.</p>
            )}
        </div>
    );
};

export default EditFamily;
