import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

const EnrollmentCalendar = () => {
    const [events, setEvents] = useState([]);

    // Fetch enrollment stats for all dates
    useEffect(() => {
        const fetchStats = async () => {
            const response = await fetch("http://127.0.0.1:8000/core/api/enrollment/stats");
            const data = await response.json();

            const calendarEvents = data.map((item) => ({
                title: `${item.total_enrolled}/${item.total_capacity}`,
                start: item.date,
                color: item.total_enrolled === item.total_capacity ? "green" : "red",
            }));

            setEvents(calendarEvents);
        };

        fetchStats();
    }, []);

    return (
        <div style={{ height: "85vh", padding: "10px" }}>
            <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Enrollment Calendar</h1>
            <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={events}
                height="85%" // Full height within the container
            />
        </div>
    );
};

export default EnrollmentCalendar;
