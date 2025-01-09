import React, { useState, useEffect } from "react";

const WithdrawalManagementPage: React.FC = () => {
    const [children, setChildren] = useState<{ id: number; name: string }[]>([]);
    const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        withdrawal_date: "",
        withdrawal_reason: "",
        deposit_status: "",
        notes: "",
    });

    // Fetch the list of children
    useEffect(() => {
        const fetchChildren = async () => {
            try {
                const response = await fetch("http://localhost:8000/api/children/");
                const data = await response.json();
                setChildren(
                    data.results.map((child) => ({
                        id: child.id,
                        name: `${child.first_name} ${child.last_name}`,
                    }))
                );
            } catch (error) {
                console.error("Error fetching children:", error);
            }
        };

        fetchChildren();
    }, []);

    // Handle input changes in the form
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedChildId) return;

        const submissionData = { ...formData, child: selectedChildId };

        fetch("http://localhost:8000/api/withdrawals/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(submissionData),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("Withdrawal created:", data);
                alert("Withdrawal submitted successfully!");
                // Reset form after successful submission
                setSelectedChildId(null);
                setFormData({
                    withdrawal_date: "",
                    withdrawal_reason: "",
                    deposit_status: "",
                    notes: "",
                });
            })
            .catch((error) => console.error("Error submitting withdrawal:", error));
    };

    return (
        <div>
            <h1>Withdrawal Management</h1>

            {/* Dropdown for selecting a child */}
            <div>
                <label htmlFor="childDropdown">Select a Child: </label>
                <select
                    id="childDropdown"
                    value={selectedChildId || ""}
                    onChange={(e) => setSelectedChildId(Number(e.target.value))}
                >
                    <option value="">-- Select a Child --</option>
                    {children.map((child) => (
                        <option key={child.id} value={child.id}>
                            {child.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Display editable fields when a child is selected */}
            {selectedChildId && (
                <form onSubmit={handleSubmit}>
                    <h2>Withdrawal Details for Child ID: {selectedChildId}</h2>

                    <label htmlFor="withdrawal_date">Withdrawal Date:</label>
                    <input
                        type="date"
                        id="withdrawal_date"
                        name="withdrawal_date"
                        value={formData.withdrawal_date}
                        onChange={handleInputChange}
                        required
                    />

                    <label htmlFor="withdrawal_reason">Reason for Withdrawal:</label>
                    <input
                        type="text"
                        id="withdrawal_reason"
                        name="withdrawal_reason"
                        value={formData.withdrawal_reason}
                        onChange={handleInputChange}
                        required
                    />

                    <label htmlFor="deposit_status">Deposit Status:</label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">-- Select Status --</option>
                        <option value="refunded">Refunded</option>
                        <option value="forfeited">Forfeited</option>
                    </select>

                    <label htmlFor="notes">Notes:</label>
                    <textarea
                        id="notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                    ></textarea>

                    <button type="submit">Submit Withdrawal</button>
                </form>
            )}
        </div>
    );
};

export default WithdrawalManagementPage;
