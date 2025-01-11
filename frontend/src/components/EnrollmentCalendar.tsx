import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction"; // Import interaction plugin

const EnrollmentCalendar = () => {
    const [view, setView] = useState("centre"); // "centre" or "classroom"
    const [classrooms, setClassrooms] = useState([]);
    const [selectedClassroom, setSelectedClassroom] = useState("");
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null); // Tracks selected date
    const [classroomsForDate, setClassroomsForDate] = useState([]); // Classrooms for the selected date

    // Fetch classrooms when the component loads
    useEffect(() => {
        const fetchClassrooms = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/core/api/classrooms");
                const data = await response.json();
                setClassrooms(data.results || data); // Support both flat and paginated responses
            } catch (error) {
                console.error("Error fetching classrooms:", error);
                setClassrooms([]);
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

    // Fetch classrooms for a specific date
    const fetchClassroomsForDate = async (date) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/core/api/classrooms-for-date?date=${date}`);
            const data = await response.json();
            setClassroomsForDate(data);
        } catch (error) {
            console.error("Error fetching classrooms for date:", error);
            setClassroomsForDate([]);
        }
    };

    // Handle date click
    const handleDateClick = (info) => {
        const clickedDate = info.dateStr;
        setSelectedDate(clickedDate);
        fetchClassroomsForDate(clickedDate);
    };

    // Navigate to the previous or next day
    const navigateDay = (direction) => {
        const currentDate = new Date(selectedDate);
        currentDate.setDate(currentDate.getDate() + (direction === "next" ? 1 : -1)); // Add/subtract one day
        const newDate = currentDate.toISOString().split("T")[0];
        setSelectedDate(newDate);
        fetchClassroomsForDate(newDate);
    };

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
                        {classrooms.map((classroom) => (
                            <option key={classroom.id} value={classroom.id}>
                                {classroom.classroom_name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Calendar */}
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]} // Include interaction plugin
                initialView="dayGridMonth"
                events={events}
                height="80%"
                dateClick={handleDateClick} // Handle date clicks
            />

            {/* Classroom List for Selected Date */}
            {selectedDate && (
                <div style={{ marginTop: "20px" }}>
                    <div style={{ textAlign: "center", marginBottom: "20px" }}>
                        <button onClick={() => navigateDay("prev")}>← Previous</button>
                        <span style={{ margin: "0 20px" }}>
                            Classrooms for {selectedDate}
                        </span>
                        <button onClick={() => navigateDay("next")}>Next →</button>
                    </div>
                    <ul style={{ textAlign: "left", listStyleType: "none", padding: "0" }}>
                        {classroomsForDate.map((classroom) => (
                            <li key={classroom.id} style={{ margin: "10px 0" }}>
                                {classroom.classroom_name} - {classroom.total_enrolled}/{classroom.total_capacity}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default EnrollmentCalendar;
