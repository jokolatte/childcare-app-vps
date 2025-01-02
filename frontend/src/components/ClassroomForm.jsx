import React, { useState } from "react";
import "./../styles/ClassroomForm.css";

const ClassroomForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/api/classrooms/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        console.log("Classroom added successfully");
        setFormData({ name: "", capacity: "" }); // Clear the form
      } else {
        console.error("Failed to add classroom");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="classroom-form">
      <div>
        <label htmlFor="name">Classroom Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="capacity">Capacity:</label>
        <input
          type="number"
          id="capacity"
          name="capacity"
          value={formData.capacity}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Add Classroom</button>
    </form>
  );
};

export default ClassroomForm;
