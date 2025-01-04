import React from "react";

interface Classroom {
  id: number;
  classroom_name: string;
  program_type: string;
  max_capacity: number;
}

interface ClassroomListViewProps {
  classrooms: Classroom[];
  onEdit: (classroom: Classroom) => void;
  onDelete: (id: number) => void;
}

const ClassroomListView: React.FC<ClassroomListViewProps> = ({
  classrooms,
  onEdit,
  onDelete,
}) => {
  return (
    <div>
      <h3>Existing Classrooms</h3>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Classroom Name</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Program Type</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Max Capacity</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {classrooms.map((classroom) => (
            <tr key={classroom.id}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {classroom.classroom_name}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {classroom.program_type}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {classroom.max_capacity}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                <button
                  onClick={() => onEdit(classroom)}
                  style={{ marginRight: "8px", cursor: "pointer" }}
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(classroom.id)}
                  style={{ cursor: "pointer" }}
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

export default ClassroomListView;
