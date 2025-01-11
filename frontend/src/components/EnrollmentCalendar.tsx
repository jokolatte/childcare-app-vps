import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const EnrollmentCalendar = () => {
    const [view, setView] = useState("calendar"); // Tracks "calendar" or "day"
    const [statsView, setStatsView] = useState("centre"); // Tracks "centre" or "classroom"
    const [classrooms, setClassrooms] = useState([]);
    const [selectedClassroom, setSelectedClassroom] = useState("");
    const [attendance, setAttendance] = useState([]);
    const [events, setEvents] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null); // Tracks selected date
    const [classroomsForDate, setClassroomsForDate] = useState([]);

    // Fetch classrooms when the component loads
    useEffect(() => {
        const fetchClassrooms = async () => {
            try {
                const response = await fetch("http://127.0.0.1:8000/core/api/classrooms");
                const data = await response.json();
                setClassrooms(data.results || data);
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
            if (statsView === "classroom" && selectedClassroom) {
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
    }, [statsView, selectedClassroom]);

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

    // Fetch attendance for a specific classroom
    const fetchAttendance = async (classroomId, date) => {
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/core/api/classroom-attendance?classroom_id=${classroomId}&date=${date}`
            );
            const data = await response.json();
            setAttendance(data);
        } catch (error) {
            console.error("Error fetching attendance:", error);
            setAttendance([]);
        }
    };

    // Handle date click
    const handleDateClick = (info) => {
        const clickedDate = info.dateStr;
        setSelectedDate(clickedDate);
        fetchClassroomsForDate(clickedDate);
        setView("day"); // Switch to day view
    };

    // Handle classroom click
    const handleClassroomClick = (classroomId) => {
        setSelectedClassroom(classroomId);
        fetchAttendance(classroomId, selectedDate);
    };

    // Navigate between dates and refresh classroom attendance
const navigateDate = async (direction) => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() + (direction === "next" ? 1 : -1));
    const newDate = currentDate.toISOString().split("T")[0];
    setSelectedDate(newDate);

    if (selectedClassroom) {
        // If a classroom is selected, fetch its attendance for the new date
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/core/api/classroom-attendance?classroom_id=${selectedClassroom}&date=${newDate}`
            );
            const data = await response.json();
            setAttendance(data);
        } catch (error) {
            console.error("Error fetching attendance for the new date:", error);
        }
    } else {
        // If no classroom is selected, fetch classroom stats for the new date
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/core/api/classroom-attendance-stats?date=${newDate}`
            );
            const data = await response.json();
            setClassrooms(data);
        } catch (error) {
            console.error("Error fetching classroom stats for the new date:", error);
        }
    }
};


    // Handle going back to the calendar view
    const handleBackToCalendar = () => {
        setSelectedDate(null);
        setView("calendar");
    };

    return (
        <div style={{ height: "85vh", padding: "10px" }}>
            {view === "calendar" && (
                <>
                    <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Enrollment Calendar</h1>

                    {/* Radio Buttons */}
                    <div style={{ marginBottom: "20px", textAlign: "center" }}>
                        <label>
                            <input
                                type="radio"
                                value="centre"
                                checked={statsView === "centre"}
                                onChange={() => setStatsView("centre")}
                            />
                            Centre
                        </label>
                        <label style={{ marginLeft: "20px" }}>
                            <input
                                type="radio"
                                value="classroom"
                                checked={statsView === "classroom"}
                                onChange={() => setStatsView("classroom")}
                            />
                            Classroom
                        </label>
                    </div>

                    {/* Dropdown Menu */}
                    {statsView === "classroom" && (
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
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        events={events}
                        height="80%"
                        dateClick={handleDateClick}
                    />
                </>
            )}

            {view === "day" && (
                <>
                    <div style={{ textAlign: "center", marginBottom: "20px" }}>
                        <button onClick={() => navigateDate("prev")}>← Previous</button>
                        <span style={{ margin: "0 20px" }}>Classrooms for {selectedDate}</span>
                        <button onClick={() => navigateDate("next")}>Next →</button>
                    </div>


                    <div style={{ display: "flex", gap: "20px" }}>
                        {/* Classroom Buttons */}
                        <ul style={{ flex: 1, textAlign: "left", listStyleType: "none", padding: "0" }}>
                            {classroomsForDate.map((classroom) => (
                                <li key={classroom.id} style={{ margin: "10px 0" }}>
                                    <button
                                        style={{
                                            width: "100%",
                                            padding: "10px",
                                            background: "lightblue",
                                            border: "none",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => handleClassroomClick(classroom.id)}
                                    >
                                        {classroom.classroom_name} - {classroom.total_enrolled}/{classroom.total_capacity}
                                    </button>
                                </li>
                            ))}
                        </ul>

                        {/* Attendance List */}
                        <div style={{ flex: 2 }}>
                            <h3>Attendance for {classroomsForDate.find((c) => c.id === selectedClassroom)?.classroom_name}</h3>
                            <ul style={{ listStyleType: "none", padding: "0" }}>
                                {attendance.map((child) => (
                                    <li key={child.id} style={{ margin: "10px 0" }}>
                                        {child.name} - DOB: {child.date_of_birth} - Age: {child.age_in_months} months
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <button
                        onClick={handleBackToCalendar}
                        style={{ marginTop: "20px", display: "block", margin: "0 auto" }}
                    >
                        Back to Calendar
                    </button>
                </>
            )}
        </div>
    );
};

export default EnrollmentCalendar;
