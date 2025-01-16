import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import Select from "react-select";

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
    const [families, setFamilies] = useState<{ value: number; label: string }[]>([]);
    const [selectedFamily, setSelectedFamily] = useState<{ value: number; label: string } | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // Fetch the list of families
    useEffect(() => {
        const fetchFamiliesAndChildren = async () => {
            try {
                // Fetch families
                const familiesResponse = await axios.get("http://127.0.0.1:8000/api/families-list/");
                const allFamilies = familiesResponse.data; // Ensure this is an array
                console.log("Fetched Families:", allFamilies);
    
                // Fetch children (handle pagination)
                const allChildren = [];
                let childrenResponse = await axios.get("http://127.0.0.1:8000/api/children/");
                allChildren.push(...childrenResponse.data.results);
    
                // Fetch additional pages if they exist
                while (childrenResponse.data.next) {
                    childrenResponse = await axios.get(childrenResponse.data.next);
                    allChildren.push(...childrenResponse.data.results);
                }
                console.log("Fetched Children:", allChildren);
    
                // Filter families with at least one active child
                const activeFamilies = allFamilies.filter((family) =>
                    allChildren.some(
                        (child) =>
                            child.family === family.id &&
                            (!child.enrollment_end_date || new Date(child.enrollment_end_date) > new Date())
                    )
                );
                console.log("Active Families:", activeFamilies);
    
                // Format families for the dropdown
                const formattedFamilies = activeFamilies.map((family) => ({
                    value: family.id,
                    label: family.parent_1_name,
                }));
    
                setFamilies(formattedFamilies); // Update dropdown options
                setLoading(false); // Stop loading indicator
            } catch (error) {
                console.error("Error fetching families or children:", error);
                setLoading(false); // Stop loading indicator in case of error
            }
        };
    
        fetchFamiliesAndChildren();
    }, []);
    
    

    // Fetch family details when a family is selected
    useEffect(() => {
        if (selectedFamily) {
            axios
                .get(`http://127.0.0.1:8000/api/families/${selectedFamily.value}/`)
                .then((response) => {
                    const familyData = response.data;
                    console.log("Fetched family details:", familyData);

                    // Populate form fields with family data
                    Object.keys(familyData).forEach((key) => {
                        if (familyData[key] !== null && familyData[key] !== undefined) {
                            setValue(key, familyData[key]);
                        }
                    });
                })
                .catch((error) => console.error("Error fetching family details:", error));
        } else {
            reset(); // Reset form if no family is selected
        }
    }, [selectedFamily, setValue, reset]);

    // Handle form submission
    const onSubmit = (data: any) => {
        console.log("Submitting data:", data); // Debugging line
        if (selectedFamily) {
            axios
                .put(`http://127.0.0.1:8000/api/families/${selectedFamily.value}/`, data)
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
                    {/* Searchable Dropdown to select a family */}
                    <div>
                        <label>Select a Family</label>
                        <Select
                            options={families}
                            onChange={setSelectedFamily}
                            value={selectedFamily}
                            placeholder="Search for a family"
                            isClearable
                        />
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

                        {/* Parent 2 Phone */}
                        <div>
                            <label>Parent 2 Phone</label>
                            <Controller
                                name="parent_2_phone"
                                control={control}
                                defaultValue=""
                                render={({ field }) => <input type="tel" {...field} />}
                            />
                        </div>

                        {/* Parent 2 Email */}
                        <div>
                            <label>Parent 2 Email</label>
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
                                defaultValue=""
                                render={({ field }) => (
                                    <select {...field}>
                                        <option value="">-- Select Payment Preference --</option>
                                        <option value="Direct Payment">Direct Payment</option>
                                        <option value="ETF">E-Transfer</option>
                                        <option value="Cheque">Cheque</option>
                                        <option value="Credit Card">Credit Card</option>
                                        <option value="Cash">Cash</option>
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
                        <button type="submit" disabled={!selectedFamily}>
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
