import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";


const WithdrawalManagementPage = () => {
    const [children, setChildren] = useState([]);
    const [withdrawals, setWithdrawals] = useState([]);
    const [formData, setFormData] = useState({
        withdrawal_date: "",
        withdrawal_reason: "",
        status: "",
        notes: "",
    });
    const [selectedChildId, setSelectedChildId] = useState(null);
    const [editingWithdrawalId, setEditingWithdrawalId] = useState(null); // Tracks the withdrawal being edited

    // Fetch children for dropdown
    useEffect(() => {
        const fetchAllChildren = async () => {
            let url = "http://127.0.0.1:8000/api/children/";
            let allChildren = [];
            try {
                while (url) {
                    const response = await axios.get(url);
                    const data = response.data;
                    // Append results to allChildren
                    allChildren = [...allChildren, ...data.results];
                    // Update URL for the next page
                    url = data.next; // 'next' will be null when there are no more pages
                }
                console.log("Fetched all children:", allChildren);
    
                // Filter children based on enrollment_end_date
                const activeChildren = allChildren.filter((child) => {
                    return !child.enrollment_end_date || new Date(child.enrollment_end_date) > new Date();
                });
                console.log("Filtered children for dropdown:", activeChildren);
    
                setChildren(activeChildren); // Update the state with filtered active children
            } catch (error) {
                console.error("Error fetching children:", error);
            }
        };
    
        fetchAllChildren();
    }, []);
    
    

    // Fetch withdrawals for display
    useEffect(() => {
        fetch("http://localhost:8000/api/withdrawals/")
            .then((response) => response.json())
            .then((data) => {
                // Sort withdrawals by withdrawal_date (earliest first)
                const sortedWithdrawals = data.results.sort(
                    (a, b) => new Date(a.withdrawal_date) - new Date(b.withdrawal_date)
                );
                setWithdrawals(sortedWithdrawals);
            })
            .catch((error) => console.error("Error fetching withdrawals:", error));
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleChildSelection = (event) => {
        const childId = event.target.value;
        setSelectedChildId(childId);
        setEditingWithdrawalId(null); // Reset editing mode
        setFormData({
            withdrawal_date: "",
            withdrawal_reason: "",
            status: "",
            notes: "",
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!selectedChildId && !editingWithdrawalId) {
            alert("Please select a child or an entry to edit.");
            return;
        }

        const payload = {
            child: selectedChildId,
            withdrawal_date: formData.withdrawal_date,
            withdrawal_reason: formData.withdrawal_reason,
            status: formData.status,
            notes: formData.notes,
        };

        const endpoint = editingWithdrawalId
            ? `http://localhost:8000/api/withdrawals/${editingWithdrawalId}/`
            : "http://localhost:8000/api/withdrawals/";

        const method = editingWithdrawalId ? "PUT" : "POST";

        fetch(endpoint, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
            .then((response) => {
                if (response.ok) {
                    alert(
                        editingWithdrawalId
                            ? "Withdrawal updated successfully!"
                            : "Withdrawal submitted successfully!"
                    );
                    setFormData({
                        withdrawal_date: "",
                        withdrawal_reason: "",
                        status: "",
                        notes: "",
                    });
                    setSelectedChildId(null);
                    setEditingWithdrawalId(null);

                    // Refresh withdrawals table
                    fetch("http://localhost:8000/api/withdrawals/")
                        .then((res) => res.json())
                        .then((data) =>
                            setWithdrawals(
                                data.results.sort(
                                    (a, b) =>
                                        new Date(a.withdrawal_date) - new Date(b.withdrawal_date)
                                )
                            )
                        )
                        .catch((error) =>
                            console.error("Error refreshing withdrawals:", error)
                        );
                } else {
                    alert("Error submitting withdrawal.");
                }
            })
            .catch((error) => console.error("Submission error:", error));
    };

    const handleEdit = (withdrawal) => {
        setEditingWithdrawalId(withdrawal.id);
        setSelectedChildId(withdrawal.child);
        setFormData({
            withdrawal_date: withdrawal.withdrawal_date,
            withdrawal_reason: withdrawal.withdrawal_reason,
            status: withdrawal.status,
            notes: withdrawal.notes,
        });
    };

    const handleDelete = (withdrawalId) => {
        if (window.confirm("Are you sure you want to delete this withdrawal?")) {
            fetch(`http://localhost:8000/api/withdrawals/${withdrawalId}/`, {
                method: "DELETE",
            })
                .then((response) => {
                    if (response.ok) {
                        alert("Withdrawal deleted successfully!");
                        setWithdrawals((prev) =>
                            prev.filter((withdrawal) => withdrawal.id !== withdrawalId)
                        );
                    } else {
                        alert("Error deleting withdrawal.");
                    }
                })
                .catch((error) => console.error("Deletion error:", error));
        }
    };

    return (
        <div>
            <h1>Withdrawal Management</h1>
            <div>
                <div>
    <label htmlFor="child">Select a Child:</label>
    <Select
        options={children.map((child) => ({
            value: child.id,
            label: `${child.first_name} ${child.last_name}`,
        }))}
        onChange={(selectedOption) =>
            setSelectedChildId(selectedOption ? selectedOption.value : null)
        }
        value={children
            .map((child) => ({
                value: child.id,
                label: `${child.first_name} ${child.last_name}`,
            }))
            .find((option) => option.value === selectedChildId) || null}
        isClearable
    />
</div>
            </div>
            {(selectedChildId || editingWithdrawalId) && (
                <form onSubmit={handleSubmit}>
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

                    <label htmlFor="status">Deposit Status:</label>
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

                    <button type="submit">
                        {editingWithdrawalId ? "Update Withdrawal" : "Submit Withdrawal"}
                    </button>
                </form>
            )}

            <h2>Existing Withdrawals</h2>
            <table style={{ borderCollapse: "collapse", width: "100%", border: "2px solid black" }}>
                <thead>
                    <tr>
                        <th style={{ border: "1px solid black", padding: "8px" }}>Child</th>
                        <th style={{ border: "1px solid black", padding: "8px" }}>Withdrawal Date</th>
                        <th style={{ border: "1px solid black", padding: "8px" }}>Reason</th>
                        <th style={{ border: "1px solid black", padding: "8px" }}>Status</th>
                        <th style={{ border: "1px solid black", padding: "8px" }}>Notes</th>
                        <th style={{ border: "1px solid black", padding: "8px" }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {withdrawals.map((withdrawal) => (
                        <tr key={withdrawal.id}>
                            <td style={{ border: "1px solid black", padding: "8px" }}>
                                {withdrawal.child_name}
                            </td>
                            <td style={{ border: "1px solid black", padding: "8px" }}>
                                {withdrawal.withdrawal_date}
                            </td>
                            <td style={{ border: "1px solid black", padding: "8px" }}>
                                {withdrawal.withdrawal_reason}
                            </td>
                            <td style={{ border: "1px solid black", padding: "8px" }}>
                                {withdrawal.status}
                            </td>
                            <td style={{ border: "1px solid black", padding: "8px" }}>
                                {withdrawal.notes}
                            </td>
                            <td style={{ border: "1px solid black", padding: "8px" }}>
                                <button onClick={() => handleEdit(withdrawal)}>Edit</button>
                                <button
                                    style={{ marginLeft: "8px" }}
                                    onClick={() => handleDelete(withdrawal.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default WithdrawalManagementPage;
