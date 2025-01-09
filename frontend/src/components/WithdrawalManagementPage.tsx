import React, { useState, useEffect } from "react";

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
        fetch("http://localhost:8000/api/children/")
            .then((response) => response.json())
            .then((data) => setChildren(data.results))
            .catch((error) => console.error("Error fetching children:", error));
    }, []);

    // Fetch withdrawals for display
    useEffect(() => {
        fetch("http://localhost:8000/api/withdrawals/")
            .then((response) => response.json())
            .then((data) => setWithdrawals(data.results))
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
                        .then((data) => setWithdrawals(data.results))
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
                <label htmlFor="child">Select a Child:</label>
                <select id="child" onChange={handleChildSelection} value={selectedChildId || ""}>
                    <option value="">-- Select a Child --</option>
                    {children.map((child) => (
                        <option key={child.id} value={child.id}>
                            {child.first_name} {child.last_name}
                        </option>
                    ))}
                </select>
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
            <table>
                <thead>
                    <tr>
                        <th>Child</th>
                        <th>Withdrawal Date</th>
                        <th>Reason</th>
                        <th>Status</th>
                        <th>Notes</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {withdrawals.map((withdrawal) => (
                        <tr key={withdrawal.id}>
                            <td>{withdrawal.child_name}</td>
                            <td>{withdrawal.withdrawal_date}</td>
                            <td>{withdrawal.withdrawal_reason}</td>
                            <td>{withdrawal.status}</td>
                            <td>{withdrawal.notes}</td>
                            <td>
                                <button onClick={() => handleEdit(withdrawal)}>Edit</button>
                                <button onClick={() => handleDelete(withdrawal.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default WithdrawalManagementPage;
