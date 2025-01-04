import React from "react";

interface AlternativeCapacity {
  program_type: string;
  max_capacity: number;
}

interface Classroom {
  id: number;
  classroom_name: string;
  program_type: string;
  max_capacity: number;
  alternative_capacities: AlternativeCapacity[];
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
      {classrooms.map((classroom) => (
        <div
          key={classroom.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "5px",
          }}
        >
          <h4>{classroom.classroom_name}</h4>
          <p>
            <strong>Program Type:</strong> {classroom.program_type}
          </p>
          <p>
            <strong>Max Capacity:</strong> {classroom.max_capacity}
          </p>
          {classroom.alternative_capacities &&
            classroom.alternative_capacities.length > 0 && (
              <div>
                <strong>Alternative Capacities:</strong>
                <ul>
                  {classroom.alternative_capacities.map((alt, index) => (
                    <li key={index}>
                      {alt.program_type} - {alt.max_capacity}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          <button onClick={() => onEdit(classroom)}>Edit</button>
          <button onClick={() => onDelete(classroom.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default ClassroomListView;
