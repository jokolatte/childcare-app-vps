
import React, { useState, useEffect } from "react";
import ClassroomListView from "./ClassroomListView";

const API_BASE_URL = "http://localhost:8000";

interface AlternativeCapacity {
  program_type: string;
  max_capacity: number;
}

interface Classroom {
  id?: number;
  classroom_name: string;
  program_type: string;
  max_capacity: number;
  alternative_capacities: AlternativeCapacity[];
}

const ClassroomForm: React.FC = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [formState, setFormState] = useState<Classroom>({
    classroom_name: "",
    program_type: "Infant",
    max_capacity: 0,
    alternative_capacities: [],
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAlternativeCapacity, setShowAlternativeCapacity] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8000/api/classrooms/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch classrooms");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched classrooms:", data); // Debugging log
        setClassrooms(data.results || data); // Handle results array or raw data
      })
      .catch((error) => console.error("Error fetching classrooms:", error));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `http://localhost:8000/api/classrooms/${editingId}/`
      : `http://localhost:8000/api/classrooms/`;

    console.log("Submitting to URL:", url); // Debugging log

    fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formState),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to submit classroom");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Classroom submitted:", data); // Debugging log
        setClassrooms((prev) =>
          editingId
            ? prev.map((item) => (item.id === editingId ? data : item))
            : [...prev, data]
        );
        resetForm();
      })
      .catch((error) => console.error("Error submitting classroom:", error));
  };

  const handleEdit = (classroom: Classroom) => {
    setEditingId(classroom.id || null);
    setFormState(classroom);
  };

  const handleDelete = (id: number) => {
    fetch(`http://localhost:8000/api/classrooms/${id}/`, { method: "DELETE" })
      .then(() => {
        setClassrooms((prev) => prev.filter((item) => item.id !== id));
      })
      .catch((error) => console.error("Error deleting classroom:", error)); // Add error handling
  };

  const resetForm = () => {
    setEditingId(null);
    setFormState({
      classroom_name: "",
      program_type: "Infant",
      max_capacity: 0,
      alternative_capacities: [],
    });
    setShowAlternativeCapacity(false);
  };

  const addAlternativeCapacity = () => {
    setFormState((prev) => ({
      ...prev,
      alternative_capacities: [
        ...prev.alternative_capacities,
        { program_type: "", max_capacity: 0 },
      ],
    }));
  };

  const handleAlternativeChange = (
    index: number,
    field: keyof AlternativeCapacity,
    value: string | number
  ) => {
    const updatedAltCapacities = [...formState.alternative_capacities];
    updatedAltCapacities[index] = {
      ...updatedAltCapacities[index],
      [field]: value,
    };
    setFormState((prev) => ({
      ...prev,
      alternative_capacities: updatedAltCapacities,
    }));
  };

  const removeAlternativeCapacity = (index: number) => {
    setFormState((prev) => ({
      ...prev,
      alternative_capacities: prev.alternative_capacities.filter(
        (_, i) => i !== index
      ),
    }));
  };

  return (
    <div>
      <h2>{editingId ? "Edit Classroom" : "Create/Edit Classroom"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Classroom Name:</label>
          <input
            type="text"
            value={formState.classroom_name}
            onChange={(e) =>
              setFormState({ ...formState, classroom_name: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label>Program Type:</label>
          <select
            value={formState.program_type}
            onChange={(e) =>
              setFormState({ ...formState, program_type: e.target.value })
            }
          >
            <option value="Infant">Infant</option>
            <option value="Toddler">Toddler</option>
            <option value="Preschool">Preschool</option>
          </select>
        </div>
        <div>
          <label>Max Capacity:</label>
          <input
            type="number"
            value={formState.max_capacity}
            onChange={(e) =>
              setFormState({
                ...formState,
                max_capacity: parseInt(e.target.value, 10) || 0,
              })
            }
            required
          />
        </div>
        <div>
          <label>Alternative Capacity?</label>
          <button
            type="button"
            onClick={() => setShowAlternativeCapacity(!showAlternativeCapacity)}
          >
            {showAlternativeCapacity ? "Hide" : "Add"}
          </button>
        </div>
        {showAlternativeCapacity && (
          <div>
            <h3>Alternative Capacities</h3>
            {formState.alternative_capacities.map((alt, index) => (
              <div key={index} style={{ marginBottom: "10px" }}>
                <label>Program Type:</label>
                <select
                  value={alt.program_type}
                  onChange={(e) =>
                    handleAlternativeChange(index, "program_type", e.target.value)
                  }
                >
                  <option value="Infant">Infant</option>
                  <option value="Toddler">Toddler</option>
                  <option value="Preschool">Preschool</option>
                </select>
                <label>Max Capacity:</label>
                <input
                  type="number"
                  value={alt.max_capacity}
                  onChange={(e) =>
                    handleAlternativeChange(
                      index,
                      "max_capacity",
                      parseInt(e.target.value, 10) || 0
                    )
                  }
                />
                <button
                  type="button"
                  onClick={() => removeAlternativeCapacity(index)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button type="button" onClick={addAlternativeCapacity}>
              Add Alternative Capacity
            </button>
          </div>
        )}
        <button type="submit">{editingId ? "Update" : "Create"}</button>
      </form>

      <ClassroomListView
        classrooms={classrooms}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ClassroomForm;