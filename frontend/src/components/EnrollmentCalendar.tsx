import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

const EnrollmentCalendar = () => {
    const [view, setView] = useState("centre"); // "centre" or "classroom"
    const [classrooms, setClassrooms] = useState([]);
    const [selectedClassroom, setSelectedClassroom] = useState("");
    const [events, setEvents] = useState([]);

    // Fetch classrooms when the component loads
    useEffect(() => {
        const fetchClassrooms = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/core/api/classrooms");
                if (!response.ok) {
                    throw new Error("Failed to fetch classrooms");
                }
                const data = await response.json();
                setClassrooms(data); // Update classrooms with API data
            } catch (error) {
                console.error("Error fetching classrooms:", error);
                setClassrooms([]); // Ensure classrooms is an empty array on error
            }
        };
        fetchClassrooms();
    }, []);
    

    // Fetch stats whenever the view or classroom selection changes
    useEffect(() => {
        const fetchStats = async () => {
            let url = "http://127.0.0.1:8000/core/api/enrollment/stats";
            if (view === "classroom" && selectedClassroom) {
                url += `?classroom_id=${selectedClassroom}`;
            }

            const response = await fetch(url);
            const data = await response.json();

            const calendarEvents = data.map((item) => ({
                title: `${item.total_enrolled}/${item.total_capacity}`,
                start: item.date,
                color: item.total_enrolled === item.total_capacity ? "green" : "red",
            }));

            setEvents(calendarEvents);
        };

        fetchStats();
    }, [view, selectedClassroom]);

    return (
        <div style={{ height: "85vh", padding: "10px" }}>
            <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Enrollment Calendar</h1>

            {/* Radio Buttons */}
            <div style={{ marginBottom: "20px", textAlign: "center" }}>
                <label>
                    <input
                        type="radio"
                        value="centre"
                        checked={view === "centre"}
                        onChange={() => setView("centre")}
                    />
                    Centre
                </label>
                <label style={{ marginLeft: "20px" }}>
                    <input
                        type="radio"
                        value="classroom"
                        checked={view === "classroom"}
                        onChange={() => setView("classroom")}
                    />
                    Classroom
                </label>
            </div>

            {/* Dropdown Menu */}
            {view === "classroom" && (
    <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <select
            value={selectedClassroom}
            onChange={(e) => setSelectedClassroom(e.target.value)}
        >
            <option value="">Select a Classroom</option>
            {Array.isArray(classrooms) &&
                classrooms.map((classroom) => (
                    <option key={classroom.id} value={classroom.id}>
                        {classroom.classroom_name}
                    </option>
                ))}
        </select>
    </div>
)}


            {/* Calendar */}
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={events}
                height="100%" // Full height within the container
            />
        </div>
    );
};

export default EnrollmentCalendar;
